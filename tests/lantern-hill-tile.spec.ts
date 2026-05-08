import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("index.html");
});

test("Lantern Hill tile is visible", async ({ page }) => {
  const tile = page.locator("section").filter({ hasText: "Lantern Hill Advisory" }).first();
  await expect(tile).toBeVisible();
});

test("Lantern Hill logo loads", async ({ page }) => {
  const logo = page.locator('img[alt="Lantern Hill Advisory lantern mark"]');
  await expect(logo).toBeVisible();
  const naturalWidth = await logo.evaluate((img: HTMLImageElement) => img.naturalWidth);
  expect(naturalWidth).toBeGreaterThan(0);
});

test("Lantern Hill tile has correct heading and description", async ({ page }) => {
  const tile = page.locator("section").filter({ hasText: "Lantern Hill Advisory" }).first();
  await expect(tile.locator("h2")).toHaveText("Lantern Hill Advisory");
  await expect(tile).toContainText("Practical AI and technology advisory");
});

test("Visit button links to lanternhilladvisory.com", async ({ page }) => {
  const link = page.locator('a[href="https://lanternhilladvisory.com"]');
  await expect(link).toBeVisible();
  await expect(link).toHaveText(/Visit Lantern Hill Advisory/);
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", "noopener noreferrer");
});

test("tile appears above the reading challenge section", async ({ page }) => {
  const tile = page.locator("section").filter({ hasText: "Lantern Hill Advisory" }).first();
  const readingSection = page.locator("#reading-challenge-widget");

  const tileBox = await tile.boundingBox();
  const readingBox = await readingSection.boundingBox();

  expect(tileBox!.y).toBeLessThan(readingBox!.y);
});
