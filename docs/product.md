# Product: Rune

Template: [templates/prd.md](templates/prd.md). Owner: Prabhash. Status: draft.

## Summary

Rune is a native desktop cockpit for AI coding agents. Open a project, launch a lineup of
agents (Claude Code x3, Codex x2, ...) into a terminal grid, hand them tasks from a kanban,
and see at a glance who is working, idle, or waiting on you. It works with the agent CLIs
the user already pays for. Behavior follows BridgeMind (see [research.md](research.md));
name, look, and voice are Rune's own.

## Problem

Developers running several coding agents juggle terminal tabs, lose track of which agent is
blocked, re-type the same prompts, and context-switch to a browser to check results. Nothing
shows the whole swarm in one place.

## Users

- **Primary:** solo developers and indie builders running 2-16 agents in parallel daily.
- **Secondary:** small teams that want shared prompts, tasks, and agent memory.

## Goals

- Launch a multi-agent lineup in under 1 second from click to first prompt.
- 16 live panes stay smooth (60 fps scroll, < 50 ms keystroke echo).
- A user can tell every agent's state in one glance without reading output.
- Zero lock-in: bring your own CLI subscriptions; Rune adds no model markup.

## Non-goals (for now)

- Our own model hosting or model routing.
- A full code editor (the agents edit code; we show diffs and files read-only).
- Benchmarks site, video tools, marketing site.

## Naming

Rune's own identity. Use these names in UI, code, and docs.

| Concept | Rune name |
|---------|-----------|
| The app | Rune |
| Modes (top switcher) | Agent / Code / Thread |
| A project folder | Workspace |
| A batch of agents launched together | Group |
| One agent terminal in the grid | Seat |
| Saved lineup of agents | Preset |
| Seat display names | Elder Futhark runes: Fehu, Uruz, Thurs, Ansuz, Raido, Kenaz, Gebo, Wunjo, Hagal, Naudiz, Isa, Jera, Eihwaz, Perth, Algiz, Sowilo (16) |
| Orchestrator agent | Rune Agent |
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
| F13 | Usage meter | P1 | Provider limit usage (e.g. 7-day %) where the CLI exposes it |
| F14 | Rune Agent | P1 | Agent mode: chat with an orchestrator that dispatches and monitors seats |
| F15 | Thread mode | P1 | Conversation-first view of one seat's session (inferred, confirm) |
| F16 | Rune MCP | P1 | Local MCP server: shared memory, task routing for all seats |
| F17 | Rune Voice | P2 | Push-to-talk dictation into the focused seat; local Whisper or cloud |
| F18 | Realm | P2 | 3D campus: floor per workspace, desk per seat, XP and levels |
| F19 | Routines | P2 | Scheduled or triggered agent runs |
| F20 | Rune Remote | P2 | Phone app; paired, end-to-end encrypted relay, scoped permissions |
| F21 | Accounts and plans | P3 | Sign-in, subscription tiers, credits for metered features |

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

## Changelog

- 2026-10-19: first draft from research.
