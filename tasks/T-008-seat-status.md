---
id: T-008
title: Seat status from hooks and screen matching
status: todo
owner:
spec: specs/001-launch-and-grid.md
depends: [T-002, T-003, T-004, T-006]
touches: [apps/desktop/src-tauri/src/status/**, apps/desktop/src-tauri/src/agents/hooks.rs, apps/desktop/src-tauri/src/commands.rs, apps/desktop/src-tauri/Cargo.toml, apps/desktop/src/features/grid/status*, tests/e2e/status.e2e.ts]
---

## Goal

Every seat shows working / idle / needs input / done / error and `Context N%` correctly,
within 1 s, per the Status flow in architecture.md.

## Steps

- [ ] Loopback hook endpoint with a per-launch token; rejects anything without it
- [ ] Hook command that forwards stdin JSON to the endpoint without needing curl (Rune's own
      binary with a `hook` subcommand, or the CLI's HTTP hook type if it has one)
- [ ] Claude Code: per-launch `--settings` temp file with hooks for prompt submit, permission /
      notification, stop, and session start (`session_id`). Never touch `~/.claude`
- [ ] Codex: per-launch `notify` override
- [ ] `vt100` screen per seat fed by the PTY tap; screen matchers for Claude Code and Codex
      (needs-input prompt, idle prompt, context usage line)
- [ ] Fallback for other agents: working while output flows, idle after 3 s of silence,
      flagged low confidence (never "settled" for Orchestrate)
- [ ] `seat_status` event on change only; store `session_id` on the seat
- [ ] Unit tests on recorded screens; integration tests with `fake-agent` scenarios

## Done when

- [ ] `needs_input` within 1 s on the `permission-prompt` scenario; no false idle while
      `working-then-stop` is mid-turn
- [ ] `pnpm check` green
- [ ] Docs updated (see AGENTS.md table)

## Notes

Check current hook event names and the `notify` payload against each CLI's docs, and record
the CLI versions in the fixtures.

## Outcome
