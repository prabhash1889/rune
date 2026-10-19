---
id: T-001
title: Scaffold the desktop app and toolchain
status: todo
owner:
spec: "-"
depends: []
touches: [apps/desktop/**, package.json, pnpm-workspace.yaml, biome.json, .github/**, AGENTS.md, .gitignore]
---

## Goal

An empty Rune window builds and runs on macOS, Windows, and Linux, with every command in the
AGENTS.md table working and green in CI. Blocked on ADR-0001 being `accepted`.

## Steps

- [ ] pnpm workspace at repo root; Tauri 2 + React + TS + Vite app in `apps/desktop/`
- [ ] Folder layout from AGENTS.md (Code organization); `tauri-specta` bindings into `src/ipc/`
- [ ] Tailwind v4 + `ui/tokens.css` from docs/design.md; Geist + Geist Mono bundled locally
- [ ] Biome, `tsc`, clippy, rustfmt, Vitest, `cargo test`, Playwright wired to the scripts
- [ ] `pnpm check` runs lint + typecheck + unit tests for TS and Rust
- [ ] GitHub Actions: `pnpm check` + `tauri build` on macos, windows, ubuntu
- [ ] Custom title bar (drag region) with the mark and empty three-column shell
- [ ] One e2e smoke test in `tests/e2e/` that opens the app and sees the title bar
- [ ] Update AGENTS.md Commands table with the real commands

## Done when

- [ ] `pnpm dev` opens the window on Windows (primary dev machine)
- [ ] `pnpm check` green locally and in CI on all three OSes
- [ ] Docs updated (see AGENTS.md table)

## Notes

## Outcome
