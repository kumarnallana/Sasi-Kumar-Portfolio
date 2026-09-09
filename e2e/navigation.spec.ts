import { expect, test, type Page } from "@playwright/test";

const stations = [
  ["OPS", "operations"],
  ["PRINCIPLES", "principles"],
  ["SYSTEMS", "systems"],
  ["SIGNALS", "signals"],
  ["PROFILE", "profile"],
  ["COMMS", "comms"],
] as const;

test.use({
  viewport: { width: 1440, height: 900 },
  video: "retain-on-failure",
  launchOptions: { args: ["--disable-logging"] },
});
test.describe.configure({ timeout: 60_000 });

async function openPortfolio(page: Page) {
  await page.goto("/");
  // The server-rendered prompt can precede hydration; reduced motion skips it.
  await page.waitForFunction(() => document.documentElement.classList.contains("lenis")
    || (matchMedia("(prefers-reduced-motion: reduce)").matches
      && !document.body.innerText.includes("TAP / PRESS ANY KEY TO SKIP")));
  await page.keyboard.press("Enter");
  await expect(page.getByText("TAP / PRESS ANY KEY TO SKIP")).toBeHidden();
  await page.evaluate(() => document.fonts.ready);
}

async function targetDistance(page: Page, id: string) {
  return page.locator(`#${id}`).evaluate((element) => {
    const top = element.getBoundingClientRect().top + window.scrollY;
    const limit = document.documentElement.scrollHeight - window.innerHeight;
    return Math.abs(window.scrollY - Math.min(top, limit));
  });
}

async function expectDestination(page: Page, id: string) {
  // Recorded WebGL scenes may render slowly on software-only CI machines.
  await expect.poll(() => targetDistance(page, id), { timeout: 10000, message: `Reach #${id}` }).toBeLessThanOrEqual(3);
  const positions: number[] = [];
  for (let sample = 0; sample < 9; sample++) {
    positions.push(await page.evaluate(() => window.scrollY));
    await page.waitForTimeout(100);
  }
  expect(Math.max(...positions) - Math.min(...positions)).toBeLessThanOrEqual(3);
}

test("every station reaches its target and stays there without a second movement", async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await openPortfolio(page);
  for (const [label, id] of stations) {
    await test.step(label, async () => {
      await page.getByRole("button", { name: label, exact: true }).click();
      await expectDestination(page, id);
    });
  }
  expect(errors).toEqual([]);
});

test("latest request wins, including when it interrupts a proximity snap", async ({ page }) => {
  await openPortfolio(page);
  // Stop near OPS to start the existing magnetic snap, then supersede it.
  await page.evaluate(() => {
    const top = document.getElementById("operations")!.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top - 200, behavior: "instant" });
  });
  await page.waitForTimeout(250);
  for (const label of ["OPS", "SYSTEMS", "COMMS"]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await page.waitForTimeout(120);
  }
  await expectDestination(page, "comms");
});

test("navigation survives gaps between animation frames", async ({ page }) => {
  // Model a slow renderer without slowing settle timers. This exposes a snap
  // taking over between programmatic animation updates on low-frame-rate devices.
  await page.addInitScript(() => {
    const request = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => request(() => {
      window.setTimeout(() => callback(performance.now()), 200);
    });
  });
  await openPortfolio(page);
  await page.getByRole("button", { name: "SYSTEMS", exact: true }).click();
  await expectDestination(page, "systems");
});

test("keyboard navigation still works after resizing", async ({ page }) => {
  await openPortfolio(page);
  const ops = page.getByRole("button", { name: "OPS", exact: true });
  await ops.focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "PRINCIPLES", exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(ops).toBeFocused();
  await page.keyboard.press("Enter");
  await expectDestination(page, "operations");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.getByRole("button", { name: "PROFILE", exact: true }).press("Space");
  await expectDestination(page, "profile");
});

test("mobile navigation and rotation preserve the existing overflow baseline", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPortfolio(page);
  const overflow = () => page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - innerWidth));
  const before = await overflow();
  // Known existing Signals tile overflow is outside this scroll-only fix.
  expect(before).toBeLessThanOrEqual(17);
  await page.getByRole("button", { name: "SYSTEMS", exact: true }).click();
  await expectDestination(page, "systems");
  expect(await overflow()).toBeLessThanOrEqual(before);
  await page.setViewportSize({ width: 844, height: 390 });
  await page.getByRole("button", { name: "PROFILE", exact: true }).click();
  await expectDestination(page, "profile");
});

test("reduced motion jumps immediately and remains stable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openPortfolio(page);
  // Measure in the activation task, without an animation-duration assumption.
  const distance = await page.getByRole("button", { name: "SYSTEMS", exact: true }).evaluate((button) => {
    (button as HTMLButtonElement).click();
    return Math.abs(document.getElementById("systems")!.getBoundingClientRect().top);
  });
  expect(distance).toBeLessThanOrEqual(3);
  await expectDestination(page, "systems");
});

test("body-locked overlay suppresses snapping and navigation recovers after close", async ({ page }) => {
  await openPortfolio(page);
  // Queue a proximity snap before the overlay locks the body.
  await page.evaluate(() => window.scrollTo({ top: 100, behavior: "instant" }));
  await page.getByRole("button", { name: /explore the stack story/i }).click();
  const dialog = page.getByRole("dialog", { name: /system layers/i });
  await expect(dialog).toBeVisible();
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 250);
  await page.waitForTimeout(1000);
  expect(Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThanOrEqual(3);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: "SYSTEMS", exact: true }).click();
  await expectDestination(page, "systems");
});

test("wheel scrolling can stop mid-section and remains natural", async ({ page }) => {
  await openPortfolio(page);
  await page.getByRole("button", { name: "SYSTEMS", exact: true }).click();
  await expectDestination(page, "systems");
  await page.mouse.move(600, 450);
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(1500);
  const middle = await page.evaluate(() => scrollY);
  expect(await targetDistance(page, "systems")).toBeGreaterThan(600);
  for (let tick = 0; tick < 3; tick++) {
    await page.mouse.wheel(0, 20);
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(middle + 30);
});
