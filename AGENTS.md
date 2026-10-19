# AGENTS.md

The single source of coding instructions for everyone working in this repo, human or AI.
Tool-specific files (`CLAUDE.md`, editor rules, etc.) only point here. If an instruction is
not in this file or a doc it links to, it is not a rule.

## Project

**Rune** is a desktop agent workspace: launch many AI coding agents (Claude Code, Codex,
Gemini CLI, Cursor Agent, ...) side by side in a terminal grid, dispatch work to them from a
kanban, plan and verify multi-agent work in Orchestrate mode, and watch them from one window.
Behavior is modeled on BridgeMind (cockpit) and Traycer (orchestration); identity is our own.

- What we build and why: [docs/product.md](docs/product.md)
- How it is built: [docs/architecture.md](docs/architecture.md)
- How it looks: [docs/design.md](docs/design.md)
- Reference products teardown: [docs/research.md](docs/research.md)

Status: pre-implementation. The stack is set by [ADR-0001](decisions/0001-desktop-stack.md)
(accepted); the orchestration engine is proposed in
[ADR-0002](decisions/0002-orchestration-engine.md).

## Repo map

| Path | Holds | Naming |
|------|-------|--------|
| `docs/` | Living product, architecture, design docs | fixed names |
| `docs/templates/` | Templates for every doc type below | - |
| `specs/` | One feature spec per file | `NNN-slug.md` |
| `tasks/` | One task per file, frontmatter is the tracker | `T-NNN-slug.md` |
| `decisions/` | Architecture decision records, append-only | `NNNN-slug.md` |
| `tests/e2e/` | End-to-end tests that drive the real app | `*.e2e.ts` |
| `apps/desktop/` | The app (created by T-001) | see Code organization |
| `sample/` | Reference screenshots of the product we model (git-ignored, local only) | read-only |

`sample/` is not in task worktrees. Read it from the main checkout:
`$(git rev-parse --path-format=absolute --git-common-dir)/../sample/`. `docs/design.md` is
the spec; screenshots only show intent.

## Ground rules

1. **Read before you write.** Before touching code, read this file, the spec your task links,
   and the part of `docs/architecture.md` it touches.
2. **Own identity.** Replicate behavior and quality, never brand. Do not copy BridgeMind's or
   Traycer's names, logos, marketing copy, illustrations, characters, or assets. Use Rune
   names from `docs/product.md` (Naming) and tokens from `docs/design.md`.
3. **Simple first.** No abstraction with one implementation, no config for a constant, no code
   "for later". Prefer the platform and existing deps over new ones. A new dependency needs a
   one-line justification in the PR.
4. **Specs before features, ADRs before irreversible choices.** Small fixes skip both.
5. **Leave it cleaner.** If you see a failing test, lint error, flaky test, or a UI glitch, fix
   it or open a task for it. Never ignore it.
6. **Never commit sensitive information.** This repo is public. No API keys, tokens,
   passwords, private keys, `.env` files, credentials, personal data, or real user/customer
   content in code, tests, fixtures, docs, or commit messages. Secrets go in the OS keychain
   or a git-ignored `.env`; commit only `.env.example` with placeholder values. Check
   `git diff --staged` before every commit. If a secret is ever pushed, rotate it immediately,
   then remove it from history; deleting it in a later commit is not enough.
7. **Writing style.** Plain hyphen `-`, never the em dash. Short sentences. No filler.

## Workflow

```
idea -> spec (specs/) -> tasks (tasks/) -> branch + code + tests -> PR review -> merge -> docs updated
```

1. **Spec.** Copy `docs/templates/spec.md` to `specs/NNN-slug.md` (next free number).
   Code starts only when its status is `approved` (approved by the human owner) and every
   spec in its `depends` is approved. Build order lives in `docs/product.md` (Roadmap).
2. **Tasks.** Split the spec into tasks a single agent can finish in one session. Copy
   `docs/templates/task.md` to `tasks/T-NNN-slug.md`. Fill `spec`, `depends`, `touches`.
3. **Decisions.** Anything costly to reverse (framework, storage format, IPC protocol,
   security model) gets an ADR from `docs/templates/adr.md`. ADRs are never edited after
   `accepted`; supersede them with a new one.

## Task ownership (multi-agent)

The task file's frontmatter is the source of truth. There is no other board.

- **Claim:** pick a `todo` task whose `depends` are all `done`. Set `owner: <your-id>` and
  `status: in-progress`, commit that change alone on `main` (`chore(tasks): claim T-007`)
  and push it. Claims, unclaims, and `blocked` updates are the only commits that skip a PR.
  If the claim conflicts on push, someone beat you: pick another task.
- **Isolate:** one agent, one task, one branch, one worktree.
  `git worktree add ../rune-T-007 -b task/T-007-slug`. A worktree holds only committed
  files, so specs and docs must be on `main` before a task that needs them is claimed.
- **Stay in your lane:** only edit paths listed in your task's `touches`. Need a path another
  `in-progress` task touches? Write it in both tasks' `Notes` and coordinate before editing.
  Shared files (`AGENTS.md`, `docs/*`, lockfiles) change in small, separate commits.
- **Blocked:** set `status: blocked` and say why in `Notes`. Do not sit on a claim.
- **Done:** `status: done` only after the PR is merged. Fill the `Outcome` section.
- **Ids:** `owner` is a human handle or `agent:<tool>-<short-id>` (e.g. `agent:claude-3f2a`).

## Code organization

Target layout, created by T-001. Update this section if the layout changes.

```
apps/desktop/
  src/                  React + TypeScript UI
    app/                shell: window chrome, routing, providers
    features/<name>/    one folder per feature: components, state, hooks, tests
    ui/                 shared primitives (Button, Tabs, Dialog...), tokens only
    lib/                framework-free helpers
    ipc/                generated Rust bindings - never hand-edit
  src-tauri/
    src/
      <domain>/         one module per domain: pty, agents, workspace, store, ...
        commands.rs     that domain's IPC commands
      commands.rs       registers each domain's commands (one line per domain)
```

- Add IPC commands in your domain's `commands.rs`, not the root one, so parallel tasks do not
  collide. `ipc/` bindings are regenerated by the build; on a merge conflict in `ipc/` or a
  lockfile, take either side and regenerate, never hand-merge.

- A feature folder owns its UI, state, and tests. Features import from `ui/`, `lib/`, `ipc/`,
  never from each other's internals. Cross-feature needs go through a store or an event.
- Rust owns processes, files, secrets, and persistence. The UI never spawns processes.
- Styling uses design tokens (CSS variables) only. No raw hex values in components.

## Commands

To be confirmed by T-001. Keep this table true.

| Task | Command |
|------|---------|
| Install | `pnpm install` |
| Run app | `pnpm dev` |
| Lint + format check | `pnpm lint` |
| Typecheck | `pnpm typecheck` |
| Unit tests (TS + Rust) | `pnpm test` |
| E2E tests | `pnpm test:e2e` |
| Everything CI runs | `pnpm check` |

## Testing

- Unit tests sit next to the code: `foo.test.ts`, Rust `#[cfg(test)] mod tests`.
- `tests/e2e/` holds user-flow tests against the running app. Every spec's acceptance
  criteria map to at least one e2e test.
- Tests never run real agent CLIs (they need accounts). They use `fake-agent`
  (`tests/fixtures/fake-agent/`), a scripted CLI that replays recorded screens, hook events,
  and headless JSON. When a real CLI changes, record a new fixture.
- Full-app e2e runs on Windows and Linux only (`tauri-driver` has no macOS support). macOS is
  covered by CI build + unit tests + a manual pass before release.
- **Bug fixes start by reproducing the bug end to end** the way a user would hit it, then a
  failing test, then the fix. The fix goes in the shared code path, not only the caller named
  in the report.
- Flaky tests are bugs. Fix the cause; never add retries or sleeps to hide it.
- **UI work is verified in the running app**, not just tests. Compare against
  `docs/design.md`: alignment, spacing, truncation, hover/focus states, both small and large
  window sizes. Pixel-level sloppiness is a defect.
- `pnpm check` passes before you open a PR. No exceptions.

## Code review

Every change except task claims lands through a PR reviewed by someone other than the author
(a human, or an agent in a separate session). The reviewer checks:

- [ ] Meets the spec's acceptance criteria; nothing outside the task's scope
- [ ] Tests cover the change and would fail without it
- [ ] `pnpm check` green; no new warnings
- [ ] UI matches `docs/design.md`; tokens, not literals; screenshots attached for UI changes
- [ ] No secrets, no terminal output or prompts sent anywhere off-device
- [ ] Docs updated per the table below

Authors answer every comment with a change or a reason. Reviewers approve or request changes,
no silent drive-bys.

## Keeping docs current

Docs ship in the same PR as the change that made them stale.

| If you change... | Update |
|------------------|--------|
| Scope, priorities, naming | `docs/product.md` |
| Modules, data model, IPC, process model | `docs/architecture.md` |
| Tokens, components, layout rules | `docs/design.md` |
| Commands, layout, conventions | `AGENTS.md` |
| An irreversible technical choice | new ADR in `decisions/` |
| Behavior described in a spec | the spec, plus a line in its `Changelog` section |

## Commits and branches

- Branch: `task/T-NNN-slug`. Commits: Conventional Commits with the task id,
  e.g. `feat(grid): auto layout for 5-8 panes (T-012)`.
- Do not add AI co-author trailers to commits.
- Never hand-edit generated files (`ipc/` bindings, lockfiles, `CHANGELOG.md`).
