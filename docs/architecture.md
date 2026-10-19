# Architecture

Template: [templates/architecture.md](templates/architecture.md). Status: proposed, pending
[ADR-0001](../decisions/0001-desktop-stack.md). Covers P0-P1; later features get a section
when their spec lands.

## Overview

```
+------------------------------- Rune desktop (Tauri 2) --------------------------------+
|  WebView: React + TS                         |  Rust core                              |
|                                              |                                         |
|  app shell (chrome, sidebar, dock)           |  commands.rs  <-- typed IPC (specta)    |
|  features/grid  -- xterm.js per seat  <------+-- pty:       spawn, resize, write, kill |
|  features/launcher, tasks, prompts, ...      |     stream:  Channel<bytes> per seat    |
|  stores (zustand)  <-- events ---------------+-- status:    output -> seat state       |
|                                              |  agents:     registry, detect, install  |
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
| `status` | Rust | Taps each PTY stream. Per-agent matchers turn output into `SeatState` and `context%`. Emits `seat-status` events. Pure functions, heavily unit tested with recorded output fixtures. |
| `agents` | Rust | Registry of `AgentDef` (id, name, icon, binary, version cmd, launch args, install cmd, status matcher). Detects installed agents on PATH. |
| `workspace` | Rust | Workspaces, groups, seats, presets. Restores the grid on restart (re-launch with resume flags where the CLI supports it). |
| `store` | Rust | SQLite via `rusqlite`, migrations embedded. Single writer. |
| `mcp` | Rust | P1. Local MCP server exposing tasks, memory, and seat messaging to every agent. |
| `ipc/` | TS | Generated from Rust with `tauri-specta`. The UI's only way to reach Rust. |
| `features/*` | TS | UI per feature. State in small zustand stores; server state comes from Rust events. |

## Data model

```
Workspace  id, name, path, pinned, sort, created_at
Group      id, workspace_id, label, preset_id?, created_at
Seat       id, group_id, agent_id, rune_name, layout_slot, state, context_pct, started_at
Preset     id, name, lineup: [{agent_id, count}]
AgentDef   static registry in code + detected {installed, version, path}
Task       id, workspace_id, title, body, column, seat_id?, sort       (P1)
Prompt     id, title, body, variables[], tags[]                        (P1)
```

`SeatState = starting | working | idle | needs_input | done | error | exited`

## Key flows

**Launch.** Launcher -> `launch_group(workspace_id, lineup)` -> Rust creates group + seats in
one transaction, spawns PTYs in parallel, returns seat ids -> UI mounts an xterm per seat and
opens its channel. Budget: < 1 s to first painted prompt for 6 seats.

**Output.** PTY reader thread -> batched every ~8 ms -> `Channel` -> `xterm.write`. The same
bytes go to `status`, which emits only on state change. xterm uses the WebGL renderer;
hidden panes keep buffering but skip rendering.

**Input.** xterm `onData` -> `write_seat(seat_id, bytes)`. Prompts/tasks dispatch through the
same command, so everything an agent receives is something a user could have typed.

## Cross-cutting

- **Security.** Terminal output, prompts, and code never leave the device unless a feature
  says so explicitly (Rune Remote, cloud Voice). Secrets live in the OS keychain. The webview
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
| Rust units | `cargo test` | status matchers (fixture recordings per agent), store, layout math |
| TS units | Vitest | stores, layout engine, components with mocked `ipc` |
| E2E | Playwright on the Vite UI with a fake IPC backend; `tauri-driver` WebDriver for full-app smoke on Windows/Linux | user flows from spec acceptance criteria |

## Risks

- Status detection depends on each CLI's output, which changes between versions. Keep matchers
  data-driven with recorded fixtures; add a fixture per CLI release that breaks us.
- Child webviews for the browser dock are behind Tauri's `unstable` flag. Spike before F11.
- ConPTY rendering differences on Windows. Test the grid on Windows early, not at the end.
