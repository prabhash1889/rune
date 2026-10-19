---
id: 003
title: Orchestrate mode - runs in worktrees, accept, merge
feature: F22
depends: [001, 002]
status: draft
owner: Prabhash
---

# Orchestrate mode - runs in worktrees, accept, merge

## Why

A planned task is only useful once an agent implements it without trampling the user's
checkout or other agents. Each run gets its own worktree; finished work collects on one saga
branch the user merges once. Part of Orchestrate mode with [002](002-sagas-and-planning.md),
[004](004-check-and-fix.md), [005](005-autopilot.md). Engine:
[ADR-0002](../decisions/0002-orchestration-engine.md).

## Behavior

1. **Run.** `Run with <agent>` on a task creates the saga branch `rune/<saga>` (first run
   only, from the user's current branch), then a worktree and branch `rune/<saga>/<task>`
   from the saga branch's tip. It launches a seat there in a group named after the saga, with
   the plan (or the task text, if the plan was skipped) as the agent's first prompt. The task
   row shows the run's status and seat rune name. `Open seat` jumps to Code mode with the seat
   focused. Tasks whose dependencies are not merged cannot run (button disabled with a
   tooltip naming them).
2. **Settled.** When the seat settles (hook stop event or matched idle, see architecture
   Status), the run moves to `ready` and the `diff` tab shows `git diff base_sha` plus
   untracked files.
3. **Accept.** `Accept` commits the worktree on its branch with the task title as message.
4. **Merge run.** `Merge` merges the run branch into `rune/<saga>`. On conflict Rune keeps
   the branch, shows `Conflict - resolve in a seat`, and offers to open a seat in the saga
   worktree.
5. **Merge saga.** `Merge saga` (saga menu) merges `rune/<saga>` into the branch the saga
   started from. Only on a clean checkout; otherwise it says why and changes nothing.
6. **Discard.** `Discard` deletes the run's worktree and branch after confirm.
7. **Sweep.** `Sweep worktrees` in the saga menu removes worktrees of merged and discarded
   runs, and the saga worktree once the saga is merged, and shows the space freed.

States:
- Seat process exits non-zero: run `failed`, with the exit code and `Restart seat`.
- Base branch moved since the saga started: `Merge saga` still works; the saga header shows
  `base moved N commits`.
- Disk: the run panel shows each worktree's size.

## UI

Run panel below the task list, tabs `plan | diff` (findings tab added by 004). DiffView
(read-only, unified) from [docs/design.md](../docs/design.md#components). Keyboard: `R` run
task, `A` accept, `M` merge.

## Technical notes

- New Rust module `git`; `orchestrator` gains the run state machine
  (`running | ready | failed | merged | discarded`; `checking`, `fixing`, `passed` come in
  004).
- New IPC: `start_run`, `accept_run`, `merge_run`, `merge_saga`, `discard_run`,
  `sweep_worktrees`. Events: `run_status`.
- New worktrees get no `node_modules` or build output. The run prompt tells the agent to set
  the worktree up first. A per-workspace setup command is a follow-up if this hurts.

## Acceptance criteria

- [ ] `Run` creates `rune/<saga>` once and a worktree on `rune/<saga>/<task>`, launches a seat
      with that cwd, and the user's own checkout is unchanged (`git status` clean, same HEAD).
- [ ] Two independent tasks run in parallel in separate worktrees without touching each other.
- [ ] A task depending on A starts from a tip that contains A's merged commit.
- [ ] The run becomes `ready` only on a settled seat, not on 3 s of output silence.
- [ ] `Merge` lands a clean run on `rune/<saga>`; a conflicting run leaves the branch and
      shows the conflict state.
- [ ] `Merge saga` merges on a clean checkout and refuses with a reason on a dirty one.
- [ ] `Sweep worktrees` removes merged and discarded worktrees only.

## Out of scope

Checks and fixes (004), Autopilot (005), PR creation on GitHub, per-workspace setup commands.

## Changelog

- 2026-10-19: draft, split from the original spec 002; adds the saga integration branch.
