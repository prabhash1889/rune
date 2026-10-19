import { getCurrentWindow } from "@tauri-apps/api/window";
import type { ReactNode } from "react";
import { Mark } from "../ui/Mark";

// macOS keeps its native traffic lights (tauri.macos.conf.json); other OSes get ours.
const isMac = typeof navigator !== "undefined" && navigator.userAgent.includes("Mac");

export function TitleBar() {
  return (
    <header
      data-tauri-drag-region
      className="flex h-11 shrink-0 items-center border-b border-border bg-bg"
    >
      <div
        data-tauri-drag-region
        className={`flex items-center gap-2 text-text ${isMac ? "pl-20" : "pl-4"}`}
      >
        <Mark />
        <span data-tauri-drag-region className="text-14 font-semibold tracking-tight">
          rune
        </span>
      </div>
      <div data-tauri-drag-region className="flex-1 self-stretch" />
      {!isMac && <WindowControls />}
    </header>
  );
}

function WindowControls() {
  return (
    <div className="flex self-stretch">
      <ControlButton label="Minimize" onClick={() => getCurrentWindow().minimize()}>
        <path d="M1 5.5H9" />
      </ControlButton>
      <ControlButton label="Maximize" onClick={() => getCurrentWindow().toggleMaximize()}>
        <rect x="1.5" y="1.5" width="7" height="7" />
      </ControlButton>
      <ControlButton label="Close" onClick={() => getCurrentWindow().close()} danger>
        <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" />
      </ControlButton>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  danger = false,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex w-11 items-center justify-center text-text-2 transition-colors duration-[var(--dur-press)] ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-border-strong ${
        danger ? "hover:bg-err hover:text-accent-fg" : "hover:bg-surface-3 hover:text-text"
      }`}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        {children}
      </svg>
    </button>
  );
}
