---
id: T-009
title: Restore the grid and resume sessions on restart
status: todo
owner:
spec: specs/001-launch-and-grid.md
depends: [T-007, T-008]
touches: [apps/desktop/src-tauri/src/workspace/restore.rs, apps/desktop/src-tauri/src/workspace/commands.rs, apps/desktop/src/app/**, tests/e2e/restore.e2e.ts]
---

## Goal

Quit and reopen: same workspaces, groups, seat names, and layout, with each seat resuming its
agent session where the agent supports it.

## Steps

- [ ] Persist layout slots, focused seat, maximized seat, sidebar and dock state
- [ ] On start, relaunch seats with the agent's resume args + stored `session_id`; fresh
      session when there is none or resume fails (and say so in the seat)
- [ ] Full-app e2e with `fake-agent`: launch, quit, reopen, assert names, layout, resume id

## Done when

- [ ] Spec 001 restore criterion passes
- [ ] `pnpm check` green
- [ ] Docs updated (see AGENTS.md table)

## Notes

## Outcome
