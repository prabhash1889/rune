---
id: 005
title: Autopilot - run a saga's task graph unattended
feature: F23
depends: [004]
status: draft
owner: Prabhash
---

# Autopilot - run a saga's task graph unattended

## Why

Once plan, run, check, and fix work by hand, the user mostly clicks the same buttons in
order. Autopilot does that for a whole saga, in parallel, with hard stops so it never burns a
subscription unseen. Modeled on Traycer's YOLO mode
([research](../docs/research.md#traycer)); builds on specs 002-004.

## Behavior

1. **Config.** `Autopilot` opens a config sheet before start: implementer agent (one, or per
   task), planner and checker agents, plan or skip, severities to fix, max fix rounds
   (1-5, default 3), concurrency (1-8, default 3), auto-merge into the saga branch on/off.
   Only agents that can signal "settled" (hooks or idle matcher) are offered as implementers.
2. **Loop.** Rune starts every task whose dependencies are merged into `rune/<saga>`, up to
   the concurrency, and loops plan -> run -> check -> fix -> accept -> merge.
3. **Pause.** It pauses the saga, with the reason shown and an OS notification, when: a seat
   needs input, a run fails or its process exits, the fix cap is hit with findings left, a
   merge conflicts, or a planner/checker call errors (rate limit). Running seats are left
   alone; nothing new starts.
4. **Resume.** `Resume` continues from where it stopped, also after an app restart. Config is
   editable for tasks not yet started.
5. **Done.** When every task is merged, the saga shows `done` and offers `Merge saga`. Autopilot
   never merges into the user's branch itself.

## UI

Autopilot button and paused-reason line per
[docs/design.md](../docs/design.md#orchestrate-mode). While running, the button shows
`Pause` and the saga Badge shows `autopilot`.

## Technical notes

- Scheduler loop in `orchestrator`, driven only by stored state, so a restart resumes.
- New IPC: `autopilot_start`, `autopilot_pause`, `autopilot_resume`. Events:
  `autopilot_paused`.

## Acceptance criteria

- [ ] A 3-task saga (A, B depend on nothing, C depends on A and B) with concurrency 2: A and B
      start together, C starts only after both merge, from a tip containing both.
- [ ] Pauses within 1 s of a seat reaching `needs_input`, shows the reason, notifies, and
      `Resume` continues; the same holds after quitting and reopening the app.
- [ ] Stops fixing after `max_fix_rounds` and pauses with findings left open.
- [ ] A planner or checker error (fixture rate-limit output) pauses with that reason.
- [ ] The user's checkout is never modified by Autopilot.

## Out of scope

Runtime self-configuring Autopilot (Traycer's Smart YOLO style), scheduled starts (F19).

## Changelog

- 2026-10-19: draft, split from the original spec 002.
