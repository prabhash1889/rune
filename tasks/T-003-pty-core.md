---
id: T-003
title: Run seats in real PTYs
status: todo
owner:
spec: specs/001-launch-and-grid.md
depends: [T-001, T-002]
touches: [apps/desktop/src-tauri/src/pty/**, apps/desktop/src-tauri/src/commands.rs, apps/desktop/src-tauri/Cargo.toml]
---

## Goal

Rust can spawn, stream, write to, resize, and kill one PTY per seat on all three OSes.

## Steps

- [ ] `pty` module on `portable-pty` (ConPTY on Windows): spawn(cmd, args, cwd, env, size)
- [ ] Reader thread per seat, batched every ~8 ms into a Tauri `Channel` (`seat_output`)
- [ ] A tap so other modules (status) get the same bytes without a second reader
- [ ] Commands: `write_seat`, `resize_seat`, `close_seat` (kill the process tree, collect the
      exit code)
- [ ] `send_prompt(seat_id, text)`: one bracketed paste then Enter
- [ ] Exit event with code; no orphan processes after close or app quit
- [ ] Integration tests with `fake-agent`: echo round trip, resize, bracketed paste arrives as
      one input, exit code, 16 concurrent seats

## Done when

- [ ] Echo < 50 ms with 16 `fake-agent` seats in the integration test, on Windows and Linux CI
- [ ] `pnpm check` green
- [ ] Docs updated (see AGENTS.md table)

## Notes

Root `commands.rs`: one line only.

## Outcome
