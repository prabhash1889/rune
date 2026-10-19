import { defineConfig } from "@playwright/test";

// Two projects:
// - ui: the Vite UI in Chromium, no Rust. Runs everywhere.
// - app: the built Rune binary through tauri-driver (WebDriver). Windows and Linux only.
export default defineConfig({
  testDir: "../../tests/e2e",
  testMatch: "**/*.e2e.ts",
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "github" : "list",
  projects: [
    {
      name: "ui",
      testIgnore: "**/*.app.e2e.ts",
      use: { browserName: "chromium", baseURL: "http://localhost:1420" },
    },
    { name: "app", testMatch: "**/*.app.e2e.ts", timeout: 60_000 },
  ],
  webServer: process.env.RUNE_E2E_APP
    ? undefined
    : { command: "pnpm vite", url: "http://localhost:1420", reuseExistingServer: !process.env.CI },
});
