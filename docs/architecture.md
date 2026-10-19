# Architecture

Template: [templates/architecture.md](templates/architecture.md). Status: proposed. Stack per
[ADR-0001](../decisions/0001-desktop-stack.md) (accepted). Covers P0-P1; later features get a section
when their spec lands.

## Overview

```
+------------------------------- Rune desktop (Tauri 2) ---------------------------------+
|  WebView: React + TS                         |  Rust core                              |
|                                              |                                         |
|  app shell (chrome, sidebar, dock)           |  commands.rs  <-- typed IPC (specta)    |
|  features/grid  -- xterm.js per seat  <------+-- pty:       spawn, resize, write, kill |
|  features/launcher, tasks, prompts, ...      |     stream:  Channel<bytes> per seat    |
|  features/orchestrate (sagas, runs, chat)    |  orchestrator: sagas, runs, autopilot   |
|                                              |  git:        worktrees, diff, merge     |
|  stores (zustand)  <-- events ---------------+-- status:    hooks+screen -> state      |
|                                              |  agents:     registry, detect, headless |
|  browser tabs: Tauri child webviews          |  workspace:  folders, groups, seats     |
|                                              |  store:      SQLite (app data dir)      |
|                                              |  mcp:        Rune MCP server (P1)       |
+----------------------------------------------+-----------------------------------------+
            spawns  -->  claude / codex / gemini / cursor-agent / ... (user's own CLIs)
```

## Components

| Module | Side | Responsibility |
|--------|------|----------------|
| `pty` | Rust | One pseudo-terminal per seat (`portable-pty`, ConPTY on Windows). Spawn with agent command, cwd = workspace, env. Streams raw bytes to the UI over a Tauri `Channel`; accepts input and resize. Owns process lifetime. |
| `status` | Rust | Turns each seat into `SeatState`, `context%`, and `session_id`. Two sources, hooks first: (1) the CLI's own lifecycle events (Claude Code hooks, Codex `notify`) posted to a per-seat local endpoint; (2) a headless terminal emulator (`vt100`) per seat that keeps the rendered screen, matched by per-agent screen matchers. Agents with neither fall back to output-flow / 3 s silence. Emits `seat-status` only on change. Matchers are pure functions over screen snapshots, unit tested with recorded fixtures. |
| `agents` | Rust | Registry of `AgentDef` (id, name, icon, binary, version cmd, launch args, initial-prompt arg, resume args, hook setup, install cmd, screen matcher, headless adapter). Detects installed agents on PATH. Runs one-shot headless calls (`claude -p`, `codex exec`, `gemini -p`) for planning and checks, read-only, using the CLI's native output-schema flag where it has one. |
| `workspace` | Rust | Workspaces, groups, seats, presets. Restores the grid on restart: re-launch with the agent's resume args and the seat's stored `session_id`, else a fresh session. |
| `store` | Rust | SQLite via `rusqlite`, migrations embedded. Single writer. |
| `orchestrator` | Rust | P1. Sagas, specs, tasks, runs, findings. Builds planner and checker prompts, validates their JSON output, drives the run state machine and Autopilot scheduler. Talks to seats only through `pty` writes. See [ADR-0002](../decisions/0002-orchestration-engine.md). |
| `git` | Rust | P1. Thin wrapper over the `git` CLI: saga branches, worktree add/remove/sweep, diff vs base (incl. untracked), commit, merge. Never writes to the user's checkout except `merge_saga` on a clean tree. |
| `mcp` | Rust | P1. Local MCP server exposing tasks, memory, and seat messaging to every agent. |
| `ipc/` | TS | Generated from Rust with `tauri-specta`. The UI's only way to reach Rust. |
| `features/*` | TS | UI per feature. State in small zustand stores; server state comes from Rust events. |

## Data model

```
Workspace  id, name, path, pinned, sort, created_at
Group      id, workspace_id, label, preset_id?, created_at
Seat       id, group_id, agent_id, rune_name, layout_slot, state, context_pct,
           session_id?, started_at
Preset     id, name, lineup: [{agent_id, count}]
AgentDef   static registry in code + detected {installed, version, path}
Task       id, workspace_id, title, body, column, seat_id?, sort       (P1)
Prompt     id, title, body, variables[], tags[]                        (P1)
Saga       id, workspace_id, title, goal, status, planner_agent_id, base_branch,
           branch, worktree, autopilot (json)                          (P1)
Spec       id, saga_id, kind, title, body, sort                        (P1)
SagaMsg    id, saga_id, role, body, refs[], created_at                 (P1)
Run        id, task_id, seat_id?, agent_id, branch, worktree, base_sha,
           plan?, status, fix_round, commit_sha?, created_at           (P1)
Finding    id, run_id, check_no, severity, file?, line?, body, status  (P1)
```

`Task` gains `saga_id?`, `acceptance`, `depends[]` for sagas. Kanban cards and saga tasks are
the same rows, so a saga task shows on the board and a card can join a saga.

`SagaStatus = draft | active | paused | done`
`RunStatus = planning | ready | running | checking | fixing | passed | failed | merged | discarded`
`Severity = blocker | major | minor | outdated`

`SeatState = starting | working | idle | needs_input | done | error | exited`

## Key flows

**Launch.** Launcher -> `launch_group(workspace_id, lineup)` -> Rust creates group + seats in
one transaction, spawns PTYs in parallel, returns seat ids -> UI mounts an xterm per seat and
opens its channel. Budget (Rune's own overhead, CLI startup excluded): click to all PTYs
spawned < 100 ms; first output byte painted within 16 ms of arriving.

**Output.** PTY reader thread -> batched every ~8 ms -> `Channel` -> `xterm.write`. The same
bytes feed the seat's `vt100` screen in `status`. Browsers cap live WebGL contexts (~16 per
page in Chromium/WebView2), so only visible seats hold a WebGL renderer; the rest use the DOM
renderer, and a lost context falls back to DOM instead of going blank. Hidden panes keep
buffering but skip rendering.

**Status.** At spawn, `agents` adds the agent's hook setup (for Claude Code a `--settings`
file whose hooks call back with the seat id; for Codex a `notify` override) pointing at a
loopback endpoint with a per-launch token. Hook events (prompt submitted, needs permission,
turn stopped, session start with `session_id`) set state directly. The screen matcher runs on
each batch for agents without hooks and for `context%`. `idle` from silence alone never
counts as "settled" for Orchestrate; only a hook stop event or a matcher's explicit idle does.

**Input.** xterm `onData` -> `write_seat(seat_id, bytes)`. Prompts/tasks dispatch through
`send_prompt(seat_id, text)`, which writes the text as one bracketed paste
(`ESC[200~ ... ESC[201~`) then Enter, only when the seat is `idle` or `needs_input`. A seat's
first prompt (a run's plan, a dispatched card) is passed as the agent's initial-prompt
argument at launch instead, so nothing races the TUI startup. Everything an agent receives is
still something a user could have typed.

**Plan (Orchestrate).** Saga chat or a `Generate` action -> `orchestrator` builds a prompt
(goal, specs, tasks, repo path) -> `agents` runs the saga's planner CLI headless, read-only,
cwd = workspace -> stdout parsed as JSON against a schema (one retry with the error on
failure) -> rows written -> `saga_updated` event. The planner reads the repo itself; Rune
never uploads code.

**Saga branch.** Starting a saga's first run creates branch `rune/<saga>` from the user's
current branch (`base_branch`) and a saga worktree for it. All run merges land there, never in
the user's checkout. `merge_saga` merges `rune/<saga>` into `base_branch` only when the user
asks and their checkout is clean; otherwise it explains and leaves both branches.

**Run.** `start_run(task_id, agent_id)` -> `git worktree add` on a new branch
`rune/<saga>/<task>` from the current tip of `rune/<saga>` (so it contains every merged
dependency) -> plan written to `.rune/plan.md` inside the worktree (`.rune/` added to the
repo's `.git/info/exclude`) -> a seat is launched with cwd = worktree in the saga's group,
with "implement `.rune/plan.md`" as its initial prompt. A settled seat (see Status) marks the
run ready to check.

**Check.** `git diff base_sha` in the worktree (plus untracked files) -> checker CLI headless
with plan, acceptance criteria, and diff -> findings JSON -> rows + `finding_added`. Sending
findings goes through `send_prompt` into the same seat; the run goes `fixing` and is checked
again when the seat settles. `accept_run` commits in the worktree; `merge_run` merges into
`rune/<saga>` in the saga worktree when clean, else leaves the branch and says so.

**Autopilot.** Scheduler loop in `orchestrator`: start runs for tasks whose `depends` are
`merged` into `rune/<saga>`, up to the saga's concurrency (default 3). Each run: plan -> run -> check -> send
findings at or above the chosen severity -> repeat up to `max_fix_rounds` (default 3) ->
accept + merge. Pauses the saga on: seat `needs_input`, run `failed`, cap reached, merge
conflict, headless call error (rate limit). Resume continues from stored state, so a restart
loses nothing.

## Cross-cutting

- **Security.** Terminal output, prompts, and code never leave the device unless a feature
  says so explicitly (Rune Remote, cloud Voice). Orchestrate sends nothing itself; planner
  and checker calls go through the user's own CLI exactly as if the user ran it. Secrets live in the OS keychain. The webview
  gets no shell or fs capability; Tauri capabilities are allow-listed per command.
- **Performance budgets.** 16 seats: 60 fps scroll, < 50 ms echo, < 600 MB RAM for the app
  itself (agents excluded), cold start < 1.5 s.
- **Cross-platform.** macOS, Windows, Linux from day one. CI builds all three. Paths, shells,
  and PTY quirks (ConPTY) are handled in `pty` only.
- **Errors.** Rust returns typed errors; the UI shows them inline on the seat or as a toast.
  A crashed agent marks the seat `exited` with its exit code and a Restart action.

## Testing strategy

| Layer | Tool | What |
|-------|------|------|
| Rust units | `cargo test` | screen matchers and hook parsing (fixture recordings per agent), store, layout math, run state machine, planner/checker JSON parsing (fixtures), git ops on temp repos |
| TS units | Vitest | stores, layout engine, components with mocked `ipc` |
| Rust integration | `cargo test` | real PTYs running `fake-agent`: spawn, echo latency, resize, hooks -> state, bracketed paste, resume |
| E2E (UI) | Playwright on the Vite UI with a fake IPC backend | layout, focus, dialogs, keyboard, screenshots at both window sizes |
| E2E (full app) | `tauri-driver` WebDriver on Windows and Linux, agents = `fake-agent` | user flows from spec acceptance criteria that cross IPC: launch, status, worktrees, merge, Autopilot, restore |

`fake-agent` (`tests/fixtures/fake-agent/`) is a small scripted CLI registered as an agent in
test builds. A script per scenario drives it: print recorded TUI screens, fire hook events,
wait for input, emit headless planner/checker JSON, edit files in its cwd, exit with a code.
macOS has no WebDriver for WKWebView, so it gets CI builds, Rust and TS tests, and a manual
pass before each release.

## Risks

- Status detection depends on each CLI's hooks and screens, which change between versions.
  Prefer hooks (a documented interface) over screen matching; keep matchers data-driven with
  recorded fixtures; add a fixture per CLI release that breaks us.
- Hook setup must not touch the user's own CLI config files. Pass it per launch (flags, env,
  or a temp settings file); if a CLI cannot take it per launch, use screen matching only.
- The usage meter (F13) cannot come from the PTY alone; reading provider limits likely means
  using the CLI's stored credentials and calling the provider. That is a network call by Rune
  and a credentials question: needs an ADR before its spec.
- 16+ WebGL contexts exceed the browser cap. Covered by the visible-only WebGL rule in Output;
  test with 16 seats plus a browser tab open.
- Child webviews for the browser dock are behind Tauri's `unstable` flag. Spike before F11.
- ConPTY rendering differences on Windows. Test the grid on Windows early, not at the end.
- Headless CLI flags and JSON output differ per agent and change between versions. Same
  answer as status: per-agent headless adapters with recorded fixtures.
- Autopilot spends the user's subscription. Hard caps (concurrency, fix rounds) and visible
  pause reasons are required, not optional.
- Many worktrees eat disk. Sweep removes worktrees of merged and discarded runs.
