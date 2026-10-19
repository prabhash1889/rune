---
id: 001
title: Launch agents into the terminal grid
feature: F02, F03, F05
depends: []
status: approved
owner: Prabhash
---

# Launch agents into the terminal grid

## Why

The core loop of Rune: pick a workspace, launch a lineup of agents, watch them work side by
side. Everything else hangs off this. Reference: `sample/1.png`, `sample/2.png`,
`sample/5.png`, `sample/6.png` (in a worktree, see AGENTS.md Repo map for the path).

## Behavior

1. User clicks `+` on a workspace row (or `Ctrl/Cmd+T`). The launcher opens over the grid
   area, scoped to that workspace.
2. **Preset** row shows saved lineups as tiles (name, composition, seat count) and a
   `New preset` tile. Picking a preset fills the lineup.
3. **Agent** grid shows every registry agent as a tile with its icon. Installed agents are
   selectable. Missing ones are listed under `Not installed` with an `Install` button that
   runs the agent's install command in a visible seat.
4. **How many**: 1-6 segmented control, `More` reveals up to 16 total.
5. **Will launch** previews each seat: agent + rune name.
6. `Launch` (`Enter`) creates one group under the workspace and opens one seat per agent.
   Seats show the CLI's own UI immediately.
7. **Grid** lays out seats with the auto layouts in `docs/design.md`. Clicking a seat
   focuses it (brighter border + glow). Header actions: menu, maximize (toggle, `Ctrl/Cmd+Enter`),
   add seat (opens launcher with this agent preselected, count 1), close (confirm if working).
8. Each seat header shows a live status dot and `Context N%` when the agent exposes it.
9. Closing the app and reopening restores workspaces, groups, and layout; seats relaunch,
   resuming their previous agent session where the agent supports it.

States: empty workspace shows a centered "Launch your first seats" call to action with the
shortcut. A seat whose process exits shows the exit code and `Restart` inline.

## UI

Components: Dialog, Tile, SegmentedControl, SidebarRow, StatusDot, seat header as specified
in `docs/design.md`. Launcher width 760px, max height 80vh, scrolls inside.

## Technical notes

- New IPC: `list_agents`, `launch_group`, `write_seat`, `resize_seat`, `close_seat`;
  channel `seat_output`; event `seat_status`.
- Rune names are assigned in order from `docs/product.md` within a workspace, reusing freed
  names.
- Status per [architecture](../docs/architecture.md) (Status flow): hooks first (Claude Code
  hooks via a per-launch `--settings` file, Codex `notify` override), screen matchers on a
  `vt100` screen second. Both ship for Claude Code and Codex first; other agents show
  `working` while output flows and `idle` after 3 s of silence until they get one. Hooks
  also give the `session_id` used for resume. Never edit the user's own CLI config.
- Only visible seats use the xterm WebGL renderer; others use DOM (WebGL context cap).
- Tests drive `fake-agent`, never real CLIs (see AGENTS.md Testing).

## Acceptance criteria

- [ ] Launching 6 seats spawns all PTYs < 100 ms after `Launch`, and each seat paints output
      within 16 ms of its first byte (Rune's overhead; CLI startup is not ours).
- [ ] Layout for 1-16 seats matches the auto-layout table; no pane below 280x160.
- [ ] Typing in a focused seat reaches only that seat; echo < 50 ms with 16 seats live.
- [ ] Resizing the window or toggling sidebar/dock resizes every PTY (no garbled TUI).
- [ ] Status dot turns `needs_input` within 1 s when Claude Code asks for permission.
- [ ] Missing agents appear under `Not installed`; Install runs and the tile becomes selectable.
- [ ] Restart of the app restores the same groups, seat names, and layout; a Claude Code seat
      resumes its session id.
- [ ] 16 live seats plus an open dock render with no blank pane (WebGL cap respected).
- [ ] Works on Windows (ConPTY), macOS, and Linux.

## Out of scope

Presets editor beyond save/rename/delete, drag-to-reorder seats, dock, notifications.

## Changelog

- 2026-10-19: draft from screenshots.
- 2026-10-19: hooks-first status, session resume, launch budget measures Rune's overhead,
  WebGL cap criterion.
- 2026-10-19: approved.
