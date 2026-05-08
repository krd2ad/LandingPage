import { test, expect } from "@playwright/test";

// Desktop viewport so the md:flex nav is visible
test.use({ viewport: { width: 1280, height: 800 } });

const NAV_ITEMS = [
  { href: "#about",      label: "About" },
  { href: "#content",    label: "My Content" },
  { href: "#consulting", label: "Consulting" },
  { href: "#reading",    label: "Reading" },
  { href: "#stocks",     label: "Stocks" },
] as const;

test.describe("Nav header — structure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("index.html");
  });

  test("header is present and sticky", async ({ page }) => {
    const header = page.locator("#site-header");
    await expect(header).toBeVisible();
    const position = await header.evaluate((el) => getComputedStyle(el).position);
    expect(position).toBe("sticky");
  });

  test("all 5 nav links are present with correct labels", async ({ page }) => {
    for (const { href, label } of NAV_ITEMS) {
      await expect(page.locator(`.nav-link[href="${href}"]`)).toContainText(label);
    }
  });

  test("nav links have consistent spacing", async ({ page }) => {
    const nav = page.locator("#main-nav");
    await expect(nav).toBeVisible();

    const links = nav.locator(".nav-link");
    expect(await links.count()).toBe(5);

    const boxes = await Promise.all(
      Array.from({ length: 5 }, (_, i) => links.nth(i).boundingBox())
    );

    // Measure gap between right edge of each link and left edge of the next
    const gaps: number[] = [];
    for (let i = 1; i < boxes.length; i++) {
      const gap = boxes[i]!.x - (boxes[i - 1]!.x + boxes[i - 1]!.width);
      gaps.push(Math.round(gap));
    }

    // All gaps should be within the expected range (gap-6 = 24px)
    for (const gap of gaps) {
      expect(gap).toBeGreaterThanOrEqual(20);
      expect(gap).toBeLessThanOrEqual(28);
    }

    // Gaps should be uniform — max deviation of 2px
    const min = Math.min(...gaps);
    const max = Math.max(...gaps);
    expect(max - min).toBeLessThanOrEqual(2);
  });

  test("header shrinks on scroll", async ({ page }) => {
    const inner = page.locator("#header-inner");

    // Before scroll: expanded padding (py-4)
    const beforeHeight = await inner.evaluate((el) => el.getBoundingClientRect().height);

    await page.evaluate(() => window.scrollTo({ top: 200, behavior: "instant" }));
    await page.waitForTimeout(100);

    // After scroll: compressed padding (py-2)
    const afterHeight = await inner.evaluate((el) => el.getBoundingClientRect().height);
    expect(afterHeight).toBeLessThan(beforeHeight);
  });
});

test.describe("Nav header — scroll targets", () => {
  for (const { href, label } of NAV_ITEMS) {
    const sectionId = href.slice(1);

    test(`"${label}" link: section is not hidden behind sticky header after click`, async ({ page }) => {
      await page.goto("index.html");

      // Start partway down so every click triggers an actual scroll
      await page.evaluate(() => window.scrollTo({ top: 800, behavior: "instant" }));
      await page.waitForTimeout(50);

      await page.locator(`.nav-link[href="${href}"]`).click();
      // Wait for smooth scroll to settle
      await page.waitForFunction(() => {
        return new Promise<boolean>((resolve) => {
          let last = window.scrollY;
          const check = setInterval(() => {
            if (window.scrollY === last) { clearInterval(check); resolve(true); }
            last = window.scrollY;
          }, 50);
        });
      }, { timeout: 2000 });

      const headerBottom = await page.locator("#site-header").evaluate(
        (el) => el.getBoundingClientRect().bottom
      );
      const sectionTop = await page.locator(`#${sectionId}`).evaluate(
        (el) => el.getBoundingClientRect().top
      );

      // Section top must not be hidden behind the header
      expect(sectionTop).toBeGreaterThanOrEqual(headerBottom - 5);
    });
  }
});
