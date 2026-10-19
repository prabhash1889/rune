---
id: 002
title: Orchestrate mode - sagas, clarify, specs, tasks, plans
feature: F22
depends: [001]
status: draft
owner: Prabhash
---

# Orchestrate mode - sagas, clarify, specs, tasks, plans

## Why

Running many agents is easy; keeping them on intent is not. Agents fill gaps with guesses,
drift from the plan, and nobody checks the result against what was asked. Orchestrate mode
adds the missing loop on top of the seats Rune already runs. This spec covers the first half:
capture intent, split it into tasks, and plan each one. Running, checking, and Autopilot are
specs [003](003-runs-and-worktrees.md), [004](004-check-and-fix.md), and
[005](005-autopilot.md). Behavior is modeled on Traycer's Epic and Phases modes
([research](../docs/research.md#traycer)); names and look are Rune's. Engine choices:
[ADR-0002](../decisions/0002-orchestration-engine.md).

## Behavior

1. **Mode.** `Orchestrate` is the fourth segment of the title-bar mode switcher
   (`Ctrl/Cmd+4`). Workspaces in the sidebar list their sagas under a `Sagas` row.
2. **New saga.** `+` on `Sagas` (or `N` in the mode) opens a composer: goal text, optional
   attachments (files, folders, images, a git diff vs uncommitted / a branch / a commit), the
   planner agent (installed agents with a headless adapter), and a depth toggle:
   - **Full:** clarify -> specs -> tasks.
   - **Quick:** goal -> a chain of tasks (phases), no specs.
   The planner agent can be changed later from the saga header; the next call uses it with
   the full saga in context.
3. **Clarify.** The planner asks up to 5 questions in saga chat. Each shows suggested answers
   as chips plus free text. `Skip` moves on with stated assumptions recorded in chat.
4. **Specs (Full).** The planner drafts small specs of kinds product, tech, design, api.
   Each opens in a markdown view, editable. `+ Spec` adds one by hand. Editing a spec and
   asking chat to "update tasks" regenerates only affected tasks.
5. **Tasks.** The planner produces tasks with title, body, acceptance criteria, and
   `depends`. They show as an ordered list with dependency hints. The user can add, edit,
   delete, reorder (drag), and merge selected tasks (planner rewrites them as one). Saga chat
   always has every spec and task in context. Selecting tasks or specs and choosing
   `Refer in chat` pins them to the next message.
6. **Plan.** `Plan` on a task asks the planner for: objective, approach, file-by-file
   changes, risks, and test steps. The plan is editable markdown. `Skip plan` marks the task
   to hand off its own text.

States:
- Workspace is not a git repo: Orchestrate shows "Sagas need a git repository" with an
  `Initialize git` action.
- No agent with a headless adapter installed: composer explains which agents can plan and
  links to the launcher's install row.
- Planner call running: chat shows a pending message with elapsed time and `Cancel`.
- Planner output fails to parse twice: error inline in chat with `Retry`, nothing written.
- Saga with no tasks yet: center shows the goal and "Ask the planner to break this down".

## UI

Layout, components (MarkdownView, ChoiceChips), and the saga board in
[docs/design.md](../docs/design.md#orchestrate-mode). The run panel is empty until spec 003.
Keyboard: `Ctrl/Cmd+4` mode, `N` new saga, `P` plan task, `Ctrl/Cmd+Enter` sends in chat.

## Technical notes

- New Rust module `orchestrator`; `agents` gains headless adapters (Claude Code and Codex
  first, each with recorded fixtures and a `fake-agent` script for tests).
- New IPC: `list_sagas`, `create_saga`, `saga_send` (chat, streamed), `cancel_saga_call`,
  `update_spec`, `update_task`, `merge_tasks`, `plan_task`. Events: `saga_updated`.
- Saga tasks are `Task` rows (`saga_id` set). The kanban spec (F09) shows them on the board;
  this spec does not depend on it.
- Planner prompts ship as built-in templates in code. They move into the Prompts library
  when F10 lands. Each call's output is a JSON schema validated in Rust.
- Saga chat is its own message list (`SagaMsg`), driven by headless planner calls. It does
  not need Rune Agent (F14).

## Acceptance criteria

- [ ] Mode switcher shows `Agent | Code | Thread | Orchestrate`; `Ctrl/Cmd+4` opens it; each
      mode keeps its state when switching.
- [ ] Creating a Full saga on a fixture repo (planner = `fake-agent`) produces clarifying
      questions, then specs, then tasks with `depends`, all persisted across an app restart.
- [ ] Quick saga produces a linear chain of tasks with no specs.
- [ ] Editing a spec and asking to update tasks changes only the tasks the planner marks as
      affected.
- [ ] `Plan` stores an editable plan on the task; `Skip plan` marks it.
- [ ] Malformed planner output is retried once, then shown as an inline error with nothing
      written.
- [ ] Non-git workspace shows the empty state.
- [ ] No network call is made by Rune itself (only the agent CLIs talk to their providers).

## Out of scope

Running tasks (003), checks (004), Autopilot (005), sharing sagas with teammates, markdown
export of sagas, agent-to-agent messaging (F16).

## Changelog

- 2026-10-19: draft, modeled on Traycer Epic, Phases, and YOLO modes.
- 2026-10-19: split; runs, checks, and Autopilot moved to specs 003-005. Dropped the
  dependency on F09, F10, F14.
