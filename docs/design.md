# Design system

The bar: a dense, calm, dark cockpit that looks expensive. Every pixel deliberate.
Layout and density follow the reference (see `sample/`); color, type, mark, and voice are Rune's.

## Identity

- **Name:** Rune. Lowercase in the wordmark (`rune`), title case in prose.
- **Mark:** a single angular glyph built from three strokes on a 4px grid, readable at 16px.
  Original artwork, monochrome by default, accent glow only on hover/active.
- **Signature:** the "rune glow" - a soft accent outer glow (`--glow`) used only on the focused
  seat, the primary button, and the active mode. Scarcity is what makes it feel premium.
- **Voice:** short, plain, confident. "Launch 3 seats", not "Let's get your agents started!"
- **Realm avatars and art are original.** Never imitate the reference product's characters.

## Tokens

Defined once as CSS variables in `apps/desktop/src/ui/tokens.css`, mapped into Tailwind.
Components use tokens only. Dark is the default; a light theme ships in P2.

### Color (dark)

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#09090B` | window background |
| `--surface` | `#111114` | sidebar, panes, dock |
| `--surface-2` | `#18181C` | raised: menus, cards, inputs |
| `--surface-3` | `#202026` | hover rows, selected chips |
| `--border` | `#26262C` | 1px panel borders |
| `--border-strong` | `#3A3A42` | focused pane, inputs on focus |
| `--text` | `#EDEDF0` | primary text |
| `--text-2` | `#A1A1AA` | secondary |
| `--text-3` | `#6B6B74` | hints, placeholders, section labels |
| `--accent` | `#7C9CFF` | primary actions, selection, links |
| `--accent-fg` | `#0B0B10` | text on accent |
| `--glow` | `0 0 0 1px #7C9CFF66, 0 0 24px #7C9CFF33` | rune glow |
| `--ok` | `#4ADE80` | working |
| `--idle` | `#71717A` | idle |
| `--warn` | `#FBBF24` | needs input |
| `--done` | `#60A5FA` | done |
| `--err` | `#F87171` | error, exited |

Terminal palette: a dedicated 16-color ANSI set tuned for `--surface`, defined next to tokens.

### Type

| Token | Value |
|-------|-------|
| UI font | `Geist`, fallback system-ui |
| Mono font | `Geist Mono`, fallback `JetBrains Mono`, monospace |
| Sizes | 11 (labels, caps +0.06em), 12 (meta), 13 (UI default), 14 (titles), 16, 20 |
| Weights | 400, 500 (UI emphasis), 600 (titles only) |
| Terminal | 12.5px mono, line-height 1.35, user-adjustable |

### Space, radius, motion

- Spacing scale (px): 2, 4, 6, 8, 12, 16, 20, 24, 32. Panel gutter: 8.
- Radius: 6 (chips, buttons), 10 (cards, inputs), 12 (panes, panels, modals).
- Motion: 120 ms ease-out for hover/press, 180 ms for panels, 240 ms spring for grid
  re-layout. Respect `prefers-reduced-motion`. Never animate terminal content.

## Layout

```
+--------------------------------------------------------------------------------+
| [mark] rune [=] [ Agent | Code | Thread | Orchestrate ]  [grid][7d][o][bell][=]|  44px title bar
+-----------+-------------------------------------------------+------------------+
| Workspaces|  +----seat----+ +----seat----+ +----seat----+   | Dash Tasks ...   |
|  proj-a   |  | o * Fehu ..| | o * Uruz ..| | o * Thurs .|   |                  |
|   > Group |  |            | |            | |            |   |   dock (tabs)    |
|  proj-b   |  +------------+ +------------+ +------------+   |                  |
| 240px     |  8px gutters, panes radius 12                   | 420px, resizable |
+-----------+-------------------------------------------------+------------------+
```

- Sidebar 240px (collapsible to 0), dock 420px default (resizable 320-50%), both toggle from
  the title bar. Title bar is a drag region; buttons are not.
- **Seat header (28px):** status dot, agent icon 14px, rune name (500 weight), `Context N%`
  (`--text-3`), then right-aligned `...`, maximize, add, close (icons 14px, visible on hover
  or focus, always visible on the focused seat).
- **Grid auto layouts:** 1 -> 1x1, 2 -> 2x1, 3 -> 3x1, 4 -> 2x2, 5-6 -> 3x2, 7-8 -> 4x2,
  9 -> 3x3, 10-12 -> 4x3, 13-16 -> 4x4. Odd counts may use a wide bottom row (as in
  `sample/6.png`). Panes never go below 280x160; beyond that the grid scrolls.
- Section labels in dialogs: 11px caps, `--text-3`, 24px above content.
- **Mode switcher:** SegmentedControl centered in the title bar, 28px tall, segments sized to
  their label (13px, 500 weight), active segment `--surface-3` with `--glow`.
  `Ctrl/Cmd+1..4` switch modes. A mode keeps its own state when you leave it. A mode not
  built yet stays visible but disabled (`--text-3`, no hover), with a `Coming soon` tooltip;
  its shortcut does nothing.

### Orchestrate mode

```
+--------------------------------------------------------------------------------+
| [mark] rune [=] [ Agent | Code | Thread | Orchestrate ]  [grid][7d][o][bell][=]|
+-----------+-------------------------------------------------+------------------+
| Workspaces|  Auth rewrite      active      [Autopilot >]    | Saga chat        |
|  proj-a   |  Goal: one line, editable                       |                  |
|   Sagas   |  SPECS  product  tech  api         [+ Spec]     |  Rune Agent      |
|   > Auth  |  TASKS                             [+ Task]     |  messages,       |
|   Billing |  o 1 Session store   merged   Fehu   0 0 1      |  clarifying      |
|  proj-b   |  o 2 Login API       checking Uruz   1 2 0      |  questions as    |
|           |  o 3 Login UI  <- 2  ready                      |  answer chips    |
|           |  RUN Login API  rune/auth/login-api [Open seat] |                  |
|           |   plan | diff | findings (3)                    |  [ ask...     ]  |
+-----------+-------------------------------------------------+------------------+
```

- Sidebar lists sagas under each workspace (below groups), with a status dot.
- Center is the saga board: header (title, status Badge, saga branch `rune/<saga>` in mono
  `--text-3`, Autopilot button, `...` menu with `Merge saga` and `Sweep worktrees`), goal, spec chips,
  then the task graph as an ordered list with dependency hints (`<- 2`). Each task row:
  StatusDot for its latest run, title, run status, seat rune name, finding counts by
  severity. Selecting a task opens its run panel below (tabs: plan, diff, findings).
- Right column reuses the dock slot (420px, same resize rules) for saga chat. Clarifying
  questions render as chips the user can click instead of typing.
- `Open seat` switches to Code mode with that seat focused. Run seats live in a group named
  after the saga, so they also show in the grid.
- Specs and plans open in a read/write markdown view in the center (textarea + preview).
  Not a code editor.
- Severity colors: blocker `--err`, major `--warn`, minor `--done`, outdated `--idle`.
  Always paired with the word, never color alone.
- Autopilot running: the button shows `Pause`, the saga Badge shows `autopilot`, and a
  paused saga shows its reason inline (`Paused: Uruz needs input`).

## Components

Build in `ui/` before using in features. Each has default, hover, active, focus-visible,
disabled states.

Button (primary, secondary, ghost, icon), SegmentedControl, Tabs (dock style, with badge and
close), SidebarRow (with count, nested, hover actions), Tile (selectable, used for agents and
presets), Dialog, Menu, Tooltip, Toast, Badge, StatusDot, Kbd, Input, CommandPalette,
MarkdownView (read/write), DiffView (read-only, unified), FindingRow (severity, file:line,
body, checkbox), ChoiceChips (clarifying answers).

## Quality checklist (every UI PR)

- Aligns to the 4px grid; no off-by-one borders between adjacent panels.
- Long names truncate with ellipsis, never wrap or overflow; tooltips show full text.
- Keyboard: everything reachable; visible focus ring; shortcuts listed in the palette.
- Checked at 1280x800 and 2560x1440, at 100% and 150% scaling, on Windows and macOS.
- Contrast: text >= 4.5:1, icons >= 3:1 against their surface.
