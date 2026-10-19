---
id: T-010
title: Cross-platform and performance pass for spec 001
status: todo
owner:
spec: specs/001-launch-and-grid.md
depends: [T-007, T-008, T-009]
touches: [tests/e2e/perf.e2e.ts, apps/desktop/src-tauri/src/pty/**, apps/desktop/src/features/grid/**, .github/**]
---

## Goal

Every spec 001 criterion passes on Windows and Linux in CI and by hand on macOS.

## Steps

- [ ] Full-app e2e: 16 `fake-agent` seats, echo < 50 ms, resize storm, WebGL cap
- [ ] Manual pass with real Claude Code and Codex on Windows (ConPTY) and macOS; fix what breaks
- [ ] Measure app RAM with 16 seats (budget < 600 MB, agents excluded) and cold start (< 1.5 s)
- [ ] Screenshots at 1280x800 and 2560x1440, 100% and 150% scaling, checked against design.md

## Done when

- [ ] All spec 001 acceptance criteria checked; spec status can move to `shipped`
- [ ] `pnpm check` green
- [ ] Docs updated (see AGENTS.md table)

## Notes

## Outcome
