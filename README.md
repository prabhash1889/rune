# Rune

A desktop cockpit for AI coding agents. Launch Claude Code, Codex, Gemini CLI, Cursor Agent
and more side by side in one terminal grid, dispatch tasks to them, and see who is working,
idle, or waiting on you at a glance. Orchestrate mode turns a goal into specs and tasks, hands
them to agents in parallel git worktrees, and checks each result against its plan. Bring your
own agent subscriptions.

> Status: pre-implementation. Repo holds the product, architecture, and design docs, spec
> 001 (approved), specs 002-005 (drafts), and tasks T-001-T-010 for the first milestones (see the Roadmap in
> [docs/product.md](docs/product.md#roadmap)). The app lands with
> [T-001](tasks/T-001-scaffold-desktop-app.md).

## Start here

| You want to... | Read |
|----------------|------|
| Contribute code (human or agent) | [AGENTS.md](AGENTS.md) |
| Know what we are building | [docs/product.md](docs/product.md) |
| Know how it is built | [docs/architecture.md](docs/architecture.md) |
| Build UI | [docs/design.md](docs/design.md) |
| See the reference products teardown | [docs/research.md](docs/research.md) |
| Pick up work | `tasks/` - any `status: todo` task with done dependencies |

## Stack

Tauri 2, Rust, React, TypeScript, xterm.js, SQLite. See
[ADR-0001](decisions/0001-desktop-stack.md).

## Development

Commands live in the [AGENTS.md](AGENTS.md#commands) table once T-001 is done.
