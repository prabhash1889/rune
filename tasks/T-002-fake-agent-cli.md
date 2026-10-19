---
id: T-002
title: Add the fake-agent test CLI
status: todo
owner:
spec: specs/001-launch-and-grid.md
depends: [T-001]
touches: [tests/fixtures/fake-agent/**, Cargo.toml]
---

## Goal

Tests can launch a scripted stand-in for any agent CLI, so status, launch, resume, and
Orchestrate flows are tested without real accounts (see AGENTS.md Testing).

## Steps

- [ ] Rust binary crate `tests/fixtures/fake-agent`, member of the root Cargo workspace
- [ ] Reads a scenario file (`--scenario <path>` or `FAKE_AGENT_SCENARIO`): JSON lines of steps
      `print` (raw bytes or a recorded screen file), `wait_input` (until Enter or a bracketed
      paste ends), `hook` (event name + JSON), `sleep_ms`, `write_file`, `stdout_json`, `exit`
- [ ] `hook` steps run the hook command from a Claude-Code-style `--settings` file the same way
      the real CLI does (command + JSON on stdin), so Rune's real hook path is exercised
- [ ] Accepts an initial prompt argument and `--resume <id>`, and records what it received
- [ ] Headless mode (`-p`): prints a scenario's `stdout_json` and exits
- [ ] Scenarios: `idle-prompt`, `working-then-stop`, `permission-prompt`, `context-usage`,
      `crash-exit-2`, `planner-ok`, `planner-malformed`, `checker-findings`
- [ ] Unit tests for the scenario parser

## Done when

- [ ] `cargo build -p fake-agent` works on all three OSes in CI
- [ ] `pnpm check` green
- [ ] Docs updated (see AGENTS.md table)

## Notes

Recorded screens come from real CLI sessions. Scrub them: no paths with real user names, no
tokens, no private repo content.

## Outcome
