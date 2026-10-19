import { expect, test } from "@playwright/test";

test("shell shows the title bar with the mark and three columns", async ({ page }) => {
  await page.goto("/");
  const titleBar = page.getByRole("banner");
  await expect(titleBar).toContainText("rune");
  await expect(titleBar).toHaveCSS("height", "44px");
  await expect(page.getByRole("navigation", { name: "Workspaces" })).toHaveCSS("width", "240px");
  await expect(page.getByRole("main", { name: "Seats" })).toBeVisible();
  await expect(page.getByRole("complementary", { name: "Dock" })).toHaveCSS("width", "420px");
});
