---
id: 0002
title: Orchestration engine - user's CLIs plan and check, one worktree per run
status: proposed
date: 2026-10-19
---

# 0002. Orchestration engine - user's CLIs plan and check, one worktree per run

## Context

Orchestrate mode (F22, F23, specs [002](../specs/002-sagas-and-planning.md),
[003](../specs/003-runs-and-worktrees.md), [004](../specs/004-check-and-fix.md),
[005](../specs/005-autopilot.md)) turns a goal into
specs, a task graph, per-task plans, handoffs to seats, and checks of the result against the
plan. It is modeled on Traycer ([research](../docs/research.md#traycer)). Three choices are
costly to reverse: which model plans and checks, how runs are isolated, and where saga data
lives. Product rules apply: no Rune model hosting or markup, nothing leaves the device unless
a feature says so, the UI never spawns processes.

## Decision

1. **Planner and checker are the user's own agent CLIs, run headless and read-only.**
   `agents` gets a per-agent headless adapter (`claude -p --output-format json`,
   `codex exec --json --sandbox read-only`, `gemini -p`, ...). Rune sends a prompt with a
   JSON schema and validates the output in Rust (one retry with the parse error). The
   planner reads the repo itself, with cwd = workspace. Each saga picks its planner agent;
   default is the first installed of Claude Code, Codex.
2. **Each saga has an integration branch; every run gets its own worktree and branch.**
   The saga branch `rune/<saga>` is created from the user's current branch and lives in its
   own worktree. A run branches `rune/<saga>/<task>` from the saga branch's current tip, so it
   contains every dependency merged so far. Runs merge into the saga branch, never into the
   user's checkout. The user merges the saga branch into their branch as one explicit step,
   only on a clean checkout. The plan is written to `.rune/plan.md` in the run worktree, and
   `.rune/` is added to the repo's `.git/info/exclude`. Parallel runs never touch each other
   or the user's checkout.
3. **Implementers are normal seats.** A run launches a seat with "implement `.rune/plan.md`"
   as the agent's initial-prompt argument. Fix rounds send findings into the same seat as one
   bracketed paste. The user can watch and take over in Code mode at any time. A seat counts
   as settled only on a CLI hook stop event or an explicit idle screen match, never on output
   silence alone, so Autopilot does not check half-done work.
4. **SQLite is the source of truth** for sagas, specs, tasks, runs, and findings, through
   the existing `store`. Saga tasks are the kanban `Task` rows.
5. **Autopilot is a fixed config chosen before start** (agents per role, plan or skip,
   severities to fix, `max_fix_rounds`, concurrency, auto-merge). Runtime self-configuration
   (like Traycer's Smart YOLO) is a later decision.

## Options considered

| Option | For | Against |
|--------|-----|---------|
| User's CLIs headless (chosen) | No keys, no markup, same subscription, works offline of Rune | Output formats differ per CLI and drift between versions; slower than a direct API call |
| Rune calls model APIs directly | Fast, structured output, one code path | Needs API keys and billing; breaks "bring your own subscription"; sends code from Rune itself |
| Planner as a long-lived interactive seat | User sees planning live | Parsing structured output from a TUI is fragile; blocks a seat |
| Runs in the user's checkout (no worktrees) | No disk cost, simpler | Parallel runs collide; diffs mix with the user's own edits |
| Run worktrees, merged straight into the user's branch | One less branch | Fails or mixes edits on a dirty checkout; dependent tasks only see merged work if the user's checkout moved |
| Saga artifacts as markdown files in the repo | Committable, agents read them directly | Two sources of truth next to SQLite kanban; merge conflicts on shared files |

## Consequences

- Each supported agent needs a headless adapter with recorded fixtures, like status matchers.
  Agents without one can implement runs but cannot plan or check.
- Worktrees cost disk and need cleanup: `Sweep worktrees` removes those of merged and
  discarded runs. Repos without git cannot use Orchestrate (shown as a clear empty state).
- Dependency installs (`node_modules`, build dirs) do not carry into a new worktree. The
  plan prompt tells the agent to set up the worktree; a per-workspace setup command is a
  follow-up if this hurts.
- Markdown export of sagas stays possible later without changing the store.
- Agents without hooks or a reliable idle matcher can implement runs by hand but cannot run
  under Autopilot, because Rune cannot tell when they are done.
- One extra worktree per saga (the integration branch).
