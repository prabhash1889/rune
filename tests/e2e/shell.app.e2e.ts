import { type ChildProcess, spawn } from "node:child_process";
import { expect, test } from "@playwright/test";

// Full app through tauri-driver (WebDriver), so it runs on Windows and Linux only.
// RUNE_E2E_APP is the path to a built Rune binary.
const app = process.env.RUNE_E2E_APP;
const driver = "http://127.0.0.1:4444";
const ELEMENT = "element-6066-11e4-a52e-4f735466cecf";

// tauri-driver and native driver output, shown when a WebDriver call fails.
let driverLog = "";

async function webdriver(method: string, path: string, body?: unknown) {
  try {
    const res = await fetch(driver + path, {
      method,
      headers: { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      // The first session on a cold CI runner starts a fresh webview profile: slow.
      signal: AbortSignal.timeout(150_000),
    });
    const json = (await res.json()) as { value: Record<string, unknown> & { message?: string } };
    if (!res.ok) throw new Error(json.value.message);
    return json.value;
  } catch (e) {
    throw new Error(`${method} ${path}: ${e}
--- driver output ---
${driverLog}`);
  }
}

let tauriDriver: ChildProcess;
let session: string;

test.beforeAll(async () => {
  test.skip(!app, "set RUNE_E2E_APP to a built Rune binary");
  tauriDriver = spawn("tauri-driver", [], { stdio: ["ignore", "pipe", "pipe"] });
  const collect = (chunk: Buffer) => {
    driverLog += chunk.toString();
  };
  tauriDriver.stdout?.on("data", collect);
  tauriDriver.stderr?.on("data", collect);
  await expect
    .poll(
      () =>
        fetch(`${driver}/status`).then(
          (r) => r.ok,
          () => false,
        ),
      { timeout: 15_000 },
    )
    .toBe(true);
  const created = await webdriver("POST", "/session", {
    capabilities: { alwaysMatch: { "tauri:options": { application: app } } },
  });
  session = created.sessionId as string;
});

test.afterAll(async () => {
  if (session) await webdriver("DELETE", `/session/${session}`);
  tauriDriver?.kill();
});

test("app window shows the title bar", async () => {
  const titleText = async () => {
    const el = await webdriver("POST", `/session/${session}/element`, {
      using: "css selector",
      value: "header",
    }).catch(() => null);
    if (!el) return "";
    return (await webdriver("GET", `/session/${session}/element/${el[ELEMENT]}/text`)) as unknown;
  };
  await expect.poll(titleText, { timeout: 15_000 }).toContain("rune");
});
