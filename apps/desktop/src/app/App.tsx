import { TitleBar } from "./TitleBar";

// Empty three-column shell: sidebar 240px, center, dock 420px (docs/design.md, Layout).
export function App() {
  return (
    <div className="flex h-full flex-col">
      <TitleBar />
      <div className="grid min-h-0 flex-1 grid-cols-[240px_minmax(0,1fr)_420px]">
        <nav aria-label="Workspaces" className="border-r border-border bg-surface px-3 pt-4">
          <h2 className="px-1 text-11 font-medium uppercase tracking-[0.06em] text-text-3">
            Workspaces
          </h2>
        </nav>
        <main aria-label="Seats" className="min-w-0 bg-bg p-2" />
        <aside aria-label="Dock" className="border-l border-border bg-surface" />
      </div>
    </div>
  );
}
