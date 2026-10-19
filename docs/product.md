# Product: Rune

Template: [templates/prd.md](templates/prd.md). Owner: Prabhash. Status: draft.

## Summary

Rune is a native desktop cockpit for AI coding agents. Open a project, launch a lineup of
agents (Claude Code x3, Codex x2, ...) into a terminal grid, hand them tasks from a kanban,
and see at a glance who is working, idle, or waiting on you. It works with the agent CLIs
the user already pays for. Orchestrate mode turns a goal into specs, a task graph, and
verified changes: Rune plans with one agent, hands tasks to seats running in parallel git
worktrees, and checks each result against its plan. Behavior follows BridgeMind for the
cockpit and Traycer for orchestration (see [research.md](research.md)); name, look, and voice
are Rune's own.

## Problem

Developers running several coding agents juggle terminal tabs, lose track of which agent is
blocked, re-type the same prompts, and context-switch to a browser to check results. Nothing
shows the whole swarm in one place.

## Users

- **Primary:** solo developers and indie builders running 2-16 agents in parallel daily.
- **Secondary:** small teams that want shared prompts, tasks, and agent memory.

## Goals

- Launching a lineup feels instant: Rune adds < 100 ms on top of the agent CLIs' own startup.
- 16 live panes stay smooth (60 fps scroll, < 50 ms keystroke echo).
- A user can tell every agent's state in one glance without reading output.
- A goal becomes checked, mergeable changes from parallel seats with the user only approving.
- Zero lock-in: bring your own CLI subscriptions; Rune adds no model markup.

## Non-goals (for now)

- Our own model hosting or model routing.
- A full code editor (the agents edit code; we show diffs and files read-only).
- Benchmarks site, video tools, marketing site.
- Cloud sandboxes or running models for the user (Traycer sells both as add-ons).
- An editor extension; Rune is the desktop app.

## Naming

Rune's own identity. Use these names in UI, code, and docs.

| Concept | Rune name |
|---------|-----------|
| The app | Rune |
| Modes (top switcher) | Agent / Code / Thread / Orchestrate |
| A project folder | Workspace |
| A batch of agents launched together | Group |
| One agent terminal in the grid | Seat |
| Saved lineup of agents | Preset |
| Seat display names | Elder Futhark runes: Fehu, Uruz, Thurs, Ansuz, Raido, Kenaz, Gebo, Wunjo, Hagal, Naudiz, Isa, Jera, Eihwaz, Perth, Algiz, Sowilo (16) |
| Orchestrator agent | Rune Agent |
| A planned body of work in Orchestrate mode | Saga |
| A focused document in a saga (kinds: product, tech, design, api) | Spec |
| A unit of work in a saga (same entity as a kanban card) | Task |
| One handoff of a task to a seat, in its own worktree | Run |
| Review of a run's diff against its plan | Check |
| One issue raised by a check (blocker, major, minor, outdated) | Finding |
| Unattended execution of a saga's tasks | Autopilot |
| MCP server | Rune MCP |
| Dictation | Rune Voice |
| 3D campus | Realm |
| Phone companion | Rune Remote |
| Scheduled runs | Routines |

## Features

Priority: **P0** = MVP, **P1** = launch, **P2** = after launch, **P3** = later.
Each feature gets a spec in `specs/` before work starts.

| Id | Feature | Pri | Notes |
|----|---------|-----|-------|
| F01 | Workspaces sidebar | P0 | Add folder, rename, pin, collapse; groups nested with seat counts |
| F02 | Session launcher | P0 | Presets, agent picker, count 1-16, install missing CLIs, preview, launch |
| F03 | Terminal grid | P0 | Real PTYs; auto layouts 1-16 incl. mixed rows; focus, maximize, add, close, drag to reorder |
| F04 | Agent registry | P0 | Detect installed CLIs, versions, install commands, launch args per agent |
| F05 | Seat status | P0 | working / idle / needs-input / done / error from output; context %; status dots |
| F06 | Notifications | P0 | Bell + OS notification when a seat needs input or finishes |
| F07 | Window chrome | P0 | Custom title bar, mode switcher, sidebar and dock toggles, command palette |
| F08 | Right dock | P1 | Tabbed: Dashboard, Tasks, Prompts, browser tabs, Realm |
| F09 | Tasks kanban | P1 | Columns, cards, drag a card onto a seat to dispatch it |
| F10 | Prompts library | P1 | Saved prompts, variables, send to one or many seats |
| F11 | Browser tabs | P1 | Embedded browser, URL bar, device sizes, localhost preview |
| F12 | Dashboard | P1 | Counts per state, recent completions, usage |
| F13 | Usage meter | P1 | Provider limit usage (e.g. 7-day %). Likely needs the CLI's credentials and a provider call: ADR before spec |
| F14 | Rune Agent | P1 | Agent mode: free-form chat with an orchestrator that dispatches and monitors seats. May reuse saga chat from F22 |
| F15 | Thread mode | P1 | Conversation-first view of one seat's session (inferred, confirm) |
| F16 | Rune MCP | P1 | Local MCP server for all seats: shared memory and decision history, task routing, agent-to-agent questions and review requests |
| F17 | Rune Voice | P2 | Push-to-talk dictation into the focused seat; local Whisper or cloud |
| F18 | Realm | P2 | 3D campus: floor per workspace, desk per seat, XP and levels |
| F19 | Routines | P2 | Scheduled or triggered agent runs |
| F20 | Rune Remote | P2 | Phone app; paired, end-to-end encrypted relay, scoped permissions |
| F21 | Accounts and plans | P3 | Sign-in, subscription tiers, credits for metered features |
| F22 | Orchestrate mode | P1 | Sagas: clarify intent, specs, task graph, per-task plan, handoff to a seat in its own worktree, check against plan, send findings back, merge. Modeled on Traycer |
| F23 | Autopilot | P1 | Run a saga's task graph unattended: parallel seats, check and fix loops with a cap, pause on failure or needs-input |
| F24 | Files and diff panel | P1 | Read-only file tree and working-tree diff for a seat's cwd (BridgeMind's built-in IDE, Traycer's File Tree / Git Diff panels) |
| F25 | Pull requests | P2 | Open a PR from a saga branch through the user's `gh`; show PR status on the saga |
| F26 | Review-only check | P2 | Run a check (F22) on any diff or branch without a run |
| F27 | Remote hosts | P3 | Seats and runs on another machine over SSH. ADR first |
| F28 | Sync and team workspaces | P3 | Sagas, tasks, prompts shared across devices and teammates. Needs a server: ADR first |

## Roadmap

Build order. A spec is written and approved before its milestone starts; milestones on the
same line can run in parallel. Status reflects this file's changelog date.

| Milestone | Features | Specs | Status |
|-----------|----------|-------|--------|
| M0 Foundation | scaffold, `fake-agent` test CLI | - | tasks T-001, T-002 |
| M1 Cockpit core | F02, F03, F05, plus the parts of F01, F04 the launcher needs | 001 | approved, tasks T-003-T-010 |
| M1b Cockpit chrome | rest of F01, F04, F06, F07 | not written | - |
| M2 Orchestrate by hand | F22 | 002 -> 003 -> 004 | draft |
| M3 Dock (parallel to M2) | F08, F09, F10, F12, F24 | not written | - |
| M4 Autopilot and agents | F23, F14, F15, F16 | 005; rest not written | 005 draft |
| M5 Browser and usage | F11 (Tauri multi-webview spike first), F13 (ADR first) | not written | - |
| Later | F17-F21, F25-F28 | not written | - |

## Success metrics

- Time from app open to first agent prompt (target < 3 s on a warm start).
- Seats per active user per day (target median >= 4).
- Status accuracy: needs-input detected within 1 s, < 1% false "idle".
- Week-4 retention of users who launched >= 3 seats in week 1.

## Open questions

- What exactly is Thread mode in the reference product? Confirm from more footage.
- Agent mode: does Rune Agent drive seats through the PTY, through MCP, or both?
- Realm art direction: isometric 3D (like reference) or our own 2.5D style?
- Do we ship accounts at launch, or stay free and local until P3?
- Agent mode and Orchestrate mode overlap (both dispatch to seats). Merge them once both
  exist, or keep Agent mode as the free-form chat and Orchestrate as the structured flow?
- Should sagas also export to markdown in the repo so they can be committed and shared?

## Changelog

- 2026-10-19: first draft from research.
- 2026-10-19: add Orchestrate mode (F22) and Autopilot (F23), modeled on Traycer.
- 2026-10-19: plan review: add Roadmap, F24-F28 from current BridgeMind/Traycer surface,
  launch goal measures Rune's overhead, F13 needs an ADR, F16 covers memory and
  agent-to-agent.
