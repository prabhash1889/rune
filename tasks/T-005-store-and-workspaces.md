---
id: T-005
title: SQLite store and workspace model
status: todo
owner:
spec: specs/001-launch-and-grid.md
depends: [T-001]
touches: [apps/desktop/src-tauri/src/store/**, apps/desktop/src-tauri/src/workspace/**, apps/desktop/src-tauri/src/commands.rs, apps/desktop/src-tauri/Cargo.toml]
---

## Goal

Workspaces, groups, seats, and presets persist in SQLite with embedded migrations.

## Steps

- [ ] `store`: `rusqlite`, app data dir, embedded migrations, single writer
- [ ] Tables for Workspace, Group, Seat (incl. `session_id`), Preset per architecture.md
- [ ] Rune name assignment per workspace in product.md order, reusing freed names
- [ ] Commands: `add_workspace` (folder path), `list_workspaces`, `rename_workspace`,
      `remove_workspace`, `list_presets`, `save_preset`, `rename_preset`, `delete_preset`
- [ ] Unit tests: migrations from empty, name assignment and reuse, cascade on remove

## Done when

- [ ] `pnpm check` green
- [ ] Docs updated (see AGENTS.md table)

## Notes

`launch_group` lives in T-007 because it also needs `pty` and `agents`.

## Outcome
