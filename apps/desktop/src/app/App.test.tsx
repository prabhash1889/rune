import { renderToString } from "react-dom/server";
import { expect, test } from "vitest";
import { App } from "./App";

test("shell renders the title bar and three columns", () => {
  const html = renderToString(<App />);
  expect(html).toContain("<header");
  expect(html).toContain(">rune<");
  for (const region of ["Workspaces", "Seats", "Dock"]) {
    expect(html).toContain(`aria-label="${region}"`);
  }
});
