---
id: 004
title: Orchestrate mode - check a run against its plan, send findings back
feature: F22
depends: [003]
status: draft
owner: Prabhash
---

# Orchestrate mode - check a run against its plan, send findings back

## Why

Checking a diff against an explicit plan and acceptance criteria is what catches drift.
Graded findings let the user send back only what matters. Part of Orchestrate mode with
[002](002-sagas-and-planning.md), [003](003-runs-and-worktrees.md),
[005](005-autopilot.md). Modeled on Traycer's verification
([research](../docs/research.md#traycer)).

## Behavior

1. **Check.** On a `ready` run, `Check` runs the checker agent headless on plan + acceptance
   criteria + diff. The run shows `checking`. Findings list with severity (blocker, major,
   minor, outdated), file:line, and text.
2. **Fix.** Select findings (default: blocker + major), `Send to seat`. They go into the same
   seat as one prompt; the run shows `fixing`, then is checked again when the seat settles.
   The run panel shows the fix round (`round 2`).
3. **Dismiss.** `Dismiss` marks a finding as not applicable; it is not sent and does not
   count toward Autopilot thresholds.
4. A run with no open blocker or major findings shows `passed`; `Accept` is the primary
   action.

States:
- Checker output fails to parse twice: inline error on the run with `Retry`.
- Seat is busy (`working`) when `Send to seat` is pressed: the send waits for it to settle
  and says so.

## UI

Run panel tab `findings (N)`. FindingRow (severity word + color, file:line, body, checkbox)
from [docs/design.md](../docs/design.md#components). Severity colors per design.md, always
with the word. Keyboard: `C` check run, `Enter` toggles a finding, `Ctrl/Cmd+Enter` sends.

## Technical notes

- `orchestrator` gains `checking` and `fixing` run states and `fix_round`.
- New IPC: `check_run`, `send_findings`, `dismiss_finding`. Events: `finding_added`.
- Checker prompt ships as a built-in template (moves to Prompts library with F10). Output is
  a JSON schema validated in Rust.
- Findings are sent with `send_prompt` (bracketed paste, only to a settled seat).

## Acceptance criteria

- [ ] `Check` on a run whose diff misses an acceptance criterion yields at least one blocker or
      major finding (`fake-agent` checker fixture); a correct diff yields none above minor.
- [ ] `Send to seat` delivers the selected findings to that seat only, as one multi-line
      prompt, and the run re-checks after the seat settles.
- [ ] Dismissed findings are not sent and survive a restart.
- [ ] Malformed checker output is retried once, then shown inline with nothing written.

## Out of scope

Review-only workflows over an existing diff, Autopilot (005).

## Changelog

- 2026-10-19: draft, split from the original spec 002.
