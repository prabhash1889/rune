# Research: reference products

Two reference products. BridgeMind shapes the cockpit (grid, launcher, dock). Traycer shapes
Orchestrate mode. Neither's name, copy, or art is reused.

## BridgeMind

Reference product we model Rune's cockpit on. Collected 2026-10-19. bridgemind.ai blocks
automated fetching, so facts come from third-party listings plus the screenshots in `sample/`
(taken from the founder's livestreams). **Confirmed** = stated by a source.
**Inferred** = read from screenshots, verify before relying on it.

### Product line

| BridgeMind name | What it is | Rune equivalent |
|-----------------|-----------|-----------------|
| BridgeMind app ("Agent Super App") | Native desktop app, macOS/Windows/Linux. Runs agents on routines, a vibe-coding workspace, coding threads. Bring your own subscription or API key. | Rune |
| BridgeSpace | The agentic dev environment inside the app: prompt agents and watch them in a split grid. Up to 16 parallel terminals, kanban that dispatches agents, built-in browser and IDE. Name now folded into the app. | Code mode |
| Bridge Agent | Orchestrator that coordinates the swarm. | Rune Agent |
| BridgeMCP | MCP server: shared agent memory, task routing, auth. One endpoint for Cursor, Claude Code, Windsurf, Codex. | Rune MCP |
| BridgeVoice | Speech-to-text into any app. Local Whisper or cloud, 99+ languages. Tauri 2 + Rust. | Rune Voice |
| BridgeVerse | 3D campus: a room per workspace, a desk per agent. | Realm |
| BridgeCode | Agent-first desktop IDE (announced, not shipped). | Out of scope |
| BridgeBench | Public model benchmark site. Separate product. | Out of scope |

**Supported agents (confirmed + screenshot 2):** Claude Code, Codex, Cursor Agent, Gemini CLI,
GitHub Copilot, Grok Build, Droid, OpenCode, DeepSeek harness, Kimi Code, Antigravity,
Muse Code, plain Terminal.

**Pricing (confirmed, official page via search):** Basic $20/mo, Pro $50/mo (adds Voice and
Verse), Ultra $100/mo; 20% off annual. Metered features use monthly credits (5k-25k). Agent
usage goes through the user's own provider account, not credits.

**Stack (confirmed):** Tauri 2 + Rust (Voice page). Screenshot 5 mentions a
"bridgemind-one-rust (Tauri + React)" repo, so the desktop app is Tauri + React.

### Screenshot analysis

All screenshots: dark UI, near-black background, rounded panels with 1px borders,
generous radius (~12px), small 13px UI text, monospace in terminals. The window is macOS
with a custom title bar.

**1.png - Code mode, 3x2 grid + browser dock.**
- Top bar: logo + name, sidebar toggle, centered segmented control `Agent | Code | Thread`,
  right side: layout icon, provider usage meter (`7d 87%` = 7-day Claude limit used),
  account status dot, notification bell with count badge, right-dock toggle.
- Left sidebar: `Workspaces` header with `+`. Workspaces are project folders. Expanded
  workspace shows launch groups (`Claude Code 6` = group of 6 sessions). Active row highlighted.
- Pane header: status dot, agent icon, seat name (human first names), `...` menu,
  maximize, `+` add pane, close. Focused pane has a brighter border.
- Each pane is a real TTY running the agent CLI (Claude Code TUI visible).
- Right dock tabs: `Dashboard`, `Tasks`, `Prompts`, then browser tabs (`+` new tab, expand).
  Browser has back/forward, URL bar, reload, and device-size toggles (desktop/tablet/phone).

**2.png - New session launcher (modal over the grid area).**
- Header: workspace chip + `New session`, close.
- `PRESET`: saved lineups as cards (name, composition like `Claude Code x3 - Codex x3`,
  seat count) and a `New preset` card.
- `AGENT`: 3-column grid of agent tiles with brand icons; selected tile has accent border
  and dot. `Not installed yet:` row with `Install` buttons for missing CLIs.
- `HOW MANY`: segmented 1-6 `session(s)`.
- `WILL LAUNCH`: list preview of what will open.
- Footer: summary (`1 session in vibecodingsimulator`), `Cancel`, primary `Launch Claude Code`.
- Sidebar row hover shows pin and `+` (new session in that workspace).

**3.png - Multiple groups per workspace, 3 panes + browser.** Sidebar nests several
`Claude Code` groups under each workspace with counts. Dashboard tab shows a count badge.
Bracketed paste preview `[Pasted text #1 +195 lines]` comes from the agent CLI itself.

**4.png - Single pane maximized.** Pane header adds `Context 14%` (agent context window
usage, parsed from the CLI). Content is a full Claude Code transcript. Also documents the
mobile remote design: 8-char pairing code + 6-digit confirm, encrypted relay that cannot
read traffic, scoped permissions (`read`, `control`, `manage`, `approve`), desktop is the
authority and can revoke a phone at any time.

**5.png - 4x2 grid, 8 seats.** Every header shows `Context N%`. Status dots: green = working,
grey = idle. Shows the grid stays readable at 8 panes.

**6.png - 4+4+1 layout with 3D campus in the dock.**
- Grid supports mixed layouts: two rows of 4 narrow panes plus one wide pane.
- Dock tab `BridgeVerse`: level badge + XP bar (`270/500`), `Next`, `Board`, `Floors`,
  `Map`, view toggles, `Start` button. Stat pills: `7 working`, `7 done`, `21 idle`.
  Floor tabs per workspace with agent counts. Isometric 3D office: agents are avatars at
  desks with name tags and state (`Idle`, `Working`), a `You` avatar, an assistant NPC
  with `Click to talk`, and a bottom prompt `Talk to <workspace> assistant (E)`.

### Takeaways for Rune

1. The core loop is: pick workspace -> launch N agents -> grid -> glance at status -> type.
   It must feel instant (sub-second launch) and stay smooth at 16 panes.
2. Status (working / idle / needs input / done) and context % are what users scan for.
   Detection quality matters more than any extra feature.
3. The right dock turns the app into a cockpit: tasks, prompts, browser preview, and the
   game-like Realm sit next to the agents without leaving the window.
4. Gamification (levels, XP, campus) is a retention feature, not core. Build it last.

### Sources

- [EveryDev: BridgeMind](https://www.everydev.ai/developers/bridgemind)
- [Product Hunt mirror: BridgeSpace 3](https://www.hunted.space/product/bridgespace-3)
- [StarsEarn: BridgeMind review 2026](https://starsearn.com/guides/bridgemind-review-2026)
- [SanuDesk: BridgeMind comparison](https://sanudesk.com/compare/bridgemind)
- [BridgeMind pricing](https://www.bridgemind.ai/pricing) (via search snippet)
- [BridgeVoice](https://www.bridgemind.ai/bridgevoice) (via search snippet)
- `sample/1.png` - `sample/6.png`

## Traycer

Planning and orchestration layer for coding agents ("plan, hand off, verify"). Started as a
VS Code extension; now also a standalone workspace that runs agents side by side. Collected
2026-10-19 from traycer.ai and docs.traycer.ai. All facts **confirmed** by those pages unless
marked.

### Concepts

| Traycer name | What it is | Rune equivalent |
|--------------|-----------|-----------------|
| Epic Mode | Captures intent as small specs and tickets so it survives to implementation. All artifacts in an epic are in the chat's context. | Saga |
| Spec (PRD, Tech Doc, Design Spec, API Spec) | "Mini-specs", one per aspect, living documents | Spec (kinds: product, tech, design, api) |
| Ticket | Independently implementable unit, acceptance criteria, Todo / In Progress / Done | Task (shared with the kanban) |
| Phases Mode | Goal -> clarifying questions -> sequential phases -> plan per phase -> handoff -> verify -> next phase | A saga without specs whose tasks form a chain |
| Plan | Per phase: objectives, file changes with exact edits, architecture and approach | Plan on a run |
| Handoff | Sends a plan or ticket to the user's coding agent | Run (task -> seat in a worktree) |
| Execution | Record of one handoff: plan, verification comments, resulting commit, status | Run |
| Verification | Compares the implementation with the plan; comments graded Critical, Major, Minor, Outdated | Check, Findings (blocker, major, minor, outdated) |
| YOLO for Phases | Fixed config upfront: skip plan?, execution agent per handoff, templates, severities to verify | Autopilot |
| Smart YOLO | Orchestrator picks agent, template, plan or not, severities, timeouts, auto-commit per task at runtime | Autopilot, P2 follow-up |
| Templates / Built-in skills | Reusable prompts for plan, review, debug, explain, ticket breakdown | Prompts library (F10) |
| Agent-2-Agent communication | Agents ask each other questions and request reviews across chats | Rune MCP (F16) |
| Sweep worktrees | Cleanup of per-task git worktrees (from homepage UI) | Sweep worktrees action |

### Workflow details

- **Inputs:** goal text plus attachments: files, folders, images, git diffs (uncommitted,
  vs `main`, vs a branch, vs a commit).
- **Clarify:** asks pointed questions on goals, user flows, architecture, integration,
  performance, security before writing anything.
- **Phase management:** select several phases to refer to in chat or merge with AI; insert
  phases anywhere; drag to reorder.
- **Epic selection:** `Select` specs and tickets, then `Refer in Chat`, `Execute in Phases`,
  or `Handoff To` an agent. Each handoff appears as an execution in the epic view, live.
- **Context carry-over:** later phases see earlier decisions and adapt their plans.
- **YOLO stops:** pauses when an execution fails, on rate limits, or when the machine sleeps;
  the user resumes manually. Config is editable only for phases not started. No iteration
  cap is documented.
- **Agents:** Claude Code, Codex, Cursor, OpenCode, Gemini, local and custom agents. Bring
  your own subscription; Traycer's own planning model is metered by credits.

### Current app surface (traycer.ai homepage)

The homepage now sells a standalone workspace more than the VS Code flow above. Mapped to
Rune features in `docs/product.md`:

| Traycer | Rune |
|---------|------|
| Desktop app (macOS/Windows/Linux) and mobile app | Rune, Rune Remote (F20) |
| Panels: Agents + Artifacts, Terminals, Browsers, Git Diff, Pull Requests, File Tree | Grid (F03), Browser (F11), Files and diff (F24), Pull requests (F25) |
| Built-in skills: `/plan`, `/execute`, `/review`, `/debate`, ticket breakdown | Prompts library (F10), Orchestrate (F22) |
| Fan one task out to several agents | Run the same task with several agents (not planned yet) |
| Agent-to-agent questions, reviews, handoffs | Rune MCP (F16) |
| Memory, decision history, specs per task | Rune MCP (F16), sagas (F22) |
| Switch model mid-chat | Saga planner agent is editable (F22) |
| Multiplayer workspaces, cross-device sync (paid "Sync" plan) | Sync and team workspaces (F28) |
| Remote hosts | Remote hosts (F27) |
| Automations (coming soon) | Routines (F19) |
| Sweep worktrees, Usage view | Sweep (F22), Usage meter (F13) |
| Cloud sandboxes, Traycer Credits | Non-goal |

Pricing: Free (any agent, planning, unlimited sessions, remote hosts, mobile, agent-to-agent),
Sync $16/user/month yearly, pay-as-you-go credits and sandboxes, Enterprise.

### Takeaways for Rune

1. The value is the loop, not any one step: intent -> small specs -> tasks -> plan -> handoff
   -> check against plan -> fix -> next. Rune already has the seats; it adds the loop.
2. Checking a diff against an explicit plan is what catches drift. Severity grading lets the
   user (or Autopilot) send only what matters back to the agent.
3. Rune differs on purpose: planning and checking run on the user's own agent CLIs (no Rune
   model, no credits), and every run gets its own git worktree so tasks run in parallel.
4. Autopilot needs hard stops (loop cap, failure, needs-input) or it burns subscriptions.

### Sources

- [traycer.ai](https://traycer.ai/)
- [Traycer docs: Phases](https://docs.traycer.ai/tasks/phases)
- [Traycer docs: Epic](https://docs.traycer.ai/tasks/epic)
- [Traycer docs: YOLO mode](https://docs.traycer.ai/tasks/yolo-mode)
