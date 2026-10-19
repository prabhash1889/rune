# Research: BridgeMind teardown

Reference product we model Rune's behavior on. Collected 2026-10-19. bridgemind.ai blocks
automated fetching, so facts come from third-party listings plus the screenshots in `sample/`
(taken from the founder's livestreams). **Confirmed** = stated by a source.
**Inferred** = read from screenshots, verify before relying on it.

## Product line

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

## Screenshot analysis

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

## Takeaways for Rune

1. The core loop is: pick workspace -> launch N agents -> grid -> glance at status -> type.
   It must feel instant (sub-second launch) and stay smooth at 16 panes.
2. Status (working / idle / needs input / done) and context % are what users scan for.
   Detection quality matters more than any extra feature.
3. The right dock turns the app into a cockpit: tasks, prompts, browser preview, and the
   game-like Realm sit next to the agents without leaving the window.
4. Gamification (levels, XP, campus) is a retention feature, not core. Build it last.

## Sources

- [EveryDev: BridgeMind](https://www.everydev.ai/developers/bridgemind)
- [Product Hunt mirror: BridgeSpace 3](https://www.hunted.space/product/bridgespace-3)
- [StarsEarn: BridgeMind review 2026](https://starsearn.com/guides/bridgemind-review-2026)
- [SanuDesk: BridgeMind comparison](https://sanudesk.com/compare/bridgemind)
- [BridgeMind pricing](https://www.bridgemind.ai/pricing) (via search snippet)
- [BridgeVoice](https://www.bridgemind.ai/bridgevoice) (via search snippet)
- `sample/1.png` - `sample/6.png`
