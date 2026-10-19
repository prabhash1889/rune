# Rune

A desktop cockpit for AI coding agents. Launch Claude Code, Codex, Gemini CLI, Cursor Agent
and more side by side in one terminal grid, dispatch tasks to them, and see who is working,
idle, or waiting on you at a glance. Bring your own agent subscriptions.

> Status: pre-implementation. Repo holds the product, architecture, and design docs plus the
> first spec and task. The app lands with [T-001](tasks/T-001-scaffold-desktop-app.md).

## Start here

| You want to... | Read |
|----------------|------|
| Contribute code (human or agent) | [AGENTS.md](AGENTS.md) |
| Know what we are building | [docs/product.md](docs/product.md) |
| Know how it is built | [docs/architecture.md](docs/architecture.md) |
| Build UI | [docs/design.md](docs/design.md) |
| See the reference product teardown | [docs/research.md](docs/research.md) |
| Pick up work | `tasks/` - any `status: todo` task with done dependencies |

## Stack (proposed)

Tauri 2, Rust, React, TypeScript, xterm.js, SQLite. See
[ADR-0001](decisions/0001-desktop-stack.md).

## Development

Commands live in the [AGENTS.md](AGENTS.md#commands) table once T-001 is done.
