---
id: T-006
title: Terminal grid UI
status: todo
owner:
spec: specs/001-launch-and-grid.md
depends: [T-003]
touches: [apps/desktop/src/features/grid/**, apps/desktop/src/ui/StatusDot*, apps/desktop/src/ui/Tooltip*, apps/desktop/src/ui/Menu*, tests/e2e/grid.e2e.ts]
---

## Goal

Seats render as xterm panes in the auto layouts from design.md, with focus, maximize, add,
and close, and every PTY resizes with its pane.

## Steps

- [ ] Layout engine as a pure function (count, area) -> rects, incl. the wide bottom row and
      the 280x160 minimum with scrolling; unit tests for 1-16
- [ ] xterm per seat on the `seat_output` channel; input to `write_seat`
- [ ] WebGL renderer only for visible seats, DOM otherwise; context loss falls back to DOM
- [ ] Seat header (28px) per design.md: status dot, icon, rune name, `Context N%` slot, hover
      actions; focus border + glow; maximize toggle `Ctrl/Cmd+Enter`
- [ ] Resize on window, sidebar, and dock changes -> `resize_seat` (debounced, no garbled TUI)
- [ ] Close confirms when the seat is `working`
- [ ] Exited seat shows the exit code and `Restart` inline
- [ ] Playwright UI tests + screenshots at 1280x800 and 2560x1440

## Done when

- [ ] 16 seats with the dock open: no blank pane, 60 fps scroll in the running app
- [ ] `pnpm check` green
- [ ] Docs updated (see AGENTS.md table)

## Notes

Status values come from T-008; until then the dot shows `starting` and `exited` only.

## Outcome
