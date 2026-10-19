---
id: T-007
title: Workspaces sidebar, launcher, launch_group
status: todo
owner:
spec: specs/001-launch-and-grid.md
depends: [T-003, T-004, T-005, T-006]
touches: [apps/desktop/src/features/sidebar/**, apps/desktop/src/features/launcher/**, apps/desktop/src/ui/Dialog*, apps/desktop/src/ui/Tile*, apps/desktop/src/ui/SegmentedControl*, apps/desktop/src/ui/SidebarRow*, apps/desktop/src-tauri/src/workspace/launch.rs, apps/desktop/src-tauri/src/workspace/commands.rs, tests/e2e/launch.e2e.ts]
---

## Goal

A user adds a folder, opens the launcher, picks agents and a count, and gets a group of
seats in the grid.

## Steps

- [ ] Sidebar: `Workspaces` header with `+` (folder picker), rows with nested groups and seat
      counts, hover actions (pin, `+`), collapse
- [ ] Launcher dialog per spec 001 Behavior 1-6 and design.md: presets, agent tiles,
      `Not installed` row with `Install`, how many 1-6 + `More` up to 16, will-launch preview
- [ ] `Install` runs the agent's install command in a visible seat, then re-detects
- [ ] `launch_group(workspace_id, lineup)`: one transaction for group + seats, PTYs spawned in
      parallel, ids returned; budget < 100 ms until all are spawned
- [ ] Empty workspace state: "Launch your first seats" + shortcut
- [ ] `Ctrl/Cmd+T` opens the launcher for the selected workspace
- [ ] Full-app e2e with `fake-agent`: add workspace, launch 6, all paint

## Done when

- [ ] Spec 001 criteria for launch, layout, and Not installed pass in e2e
- [ ] `pnpm check` green
- [ ] Docs updated (see AGENTS.md table)

## Notes

## Outcome
