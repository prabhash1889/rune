---
id: T-004
title: Agent registry and detection
status: todo
owner:
spec: specs/001-launch-and-grid.md
depends: [T-001]
touches: [apps/desktop/src-tauri/src/agents/**, apps/desktop/src-tauri/src/commands.rs, apps/desktop/src/ui/icons/agents/**]
---

## Goal

Rune knows which agent CLIs exist, which are installed, and how to launch and install each.

## Steps

- [ ] `AgentDef` per architecture.md: id, name, icon, binary, version cmd, launch args,
      initial-prompt arg, resume args, install cmd. Hook setup (T-008) and headless adapter
      (spec 002) stay empty here
- [ ] Entries: Claude Code, Codex, Gemini CLI, Cursor Agent, GitHub Copilot CLI, OpenCode,
      plain Terminal (user's shell). Others from research.md as follow-ups
- [ ] Detect on PATH (Windows `.cmd`/`.exe` shims included), read version, cache per app start
- [ ] `fake-agent` registered only in test builds
- [ ] Command `list_agents`
- [ ] Monochrome agent icons drawn for Rune; vendor marks only where their brand rules allow
- [ ] Unit tests for detection with a temp PATH

## Done when

- [ ] `list_agents` reports installed and missing agents correctly on all three OSes in CI
- [ ] `pnpm check` green
- [ ] Docs updated (see AGENTS.md table)

## Notes

Verify each CLI's current initial-prompt and resume flags against its docs; record the
version checked next to the entry.

## Outcome
