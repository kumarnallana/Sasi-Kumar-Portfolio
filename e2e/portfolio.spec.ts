import { test, expect } from "@playwright/test";

test.describe("Portfolio E2E Tests - Active & Exit Flows", () => {
  test("1. Clean Console & No Critical Warnings on Load", async ({ page }) => {
    const criticalLogs: string[] = [];

    page.on("console", (msg) => {
      const text = msg.text();
      // Catch any unhandled errors or missing target bugs
      if (
        text.includes("Target not found") ||
        text.includes("GSAP target") ||
        text.includes("Uncaught") ||
        msg.type() === "error"
      ) {
        criticalLogs.push(`[${msg.type()}] ${text}`);
      }
    });

    page.on("pageerror", (err) => {
      criticalLogs.push(`[PageError] ${err.message}`);
    });

    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Skip boot sequence if active
    await page.keyboard.press("Space");
    await page.waitForTimeout(600);

    expect(criticalLogs, `Errors found in console: ${criticalLogs.join("\n")}`).toEqual([]);
  });

  test("2. Boot Sequence Active & Dismiss Flow", async ({ page }) => {
    await page.goto("/");
    // Click to skip boot
    await page.mouse.click(200, 200);
    await page.waitForTimeout(700);

    // Verify Hero is visible and active
    const heroTitle = page.locator("h1");
    await expect(heroTitle).toContainText("SASI KUMAR");
  });

  test("3. Stack Story Modal - Active & Exit Flows", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Space"); // skip boot
    await page.waitForTimeout(500);

    const exploreBtn = page.getByRole("button", { name: /explore the stack story/i });
    await expect(exploreBtn).toBeVisible();
    await exploreBtn.click();

    // Verify modal is active
    const modal = page.getByRole("dialog", { name: /system layers/i });
    await expect(modal).toBeVisible();

    // Test Exit Flow 1: Keyboard ESC key
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible({ timeout: 2500 });

    // Test Exit Flow 2: Button exit
    await exploreBtn.click();
    await expect(modal).toBeVisible();

    const exitBtn = page.getByRole("button", { name: /close stack story/i });
    await expect(exitBtn).toBeVisible();
    await exitBtn.click();
    await expect(modal).not.toBeVisible({ timeout: 2500 });
  });

  test("4. Blueprint Diagram Modal - Active & Exit Flows", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Space");
    await page.waitForTimeout(500);

    // Navigate or scroll to systems section
    const systemsSection = page.locator("#systems");
    await systemsSection.scrollIntoViewIfNeeded();

    const maxBtn = systemsSection.getByRole("button", { name: /maximize diagram/i }).first();
    await expect(maxBtn).toBeVisible();
    await maxBtn.click();

    // Verify modal is active
    const closeBtn = page.getByRole("button", { name: /close diagram/i });
    await expect(closeBtn).toBeVisible();

    // Test Exit Flow 1: Close button
    await closeBtn.click();
    await expect(closeBtn).not.toBeVisible();

    // Test Exit Flow 2: Keyboard ESC
    await maxBtn.click();
    await expect(closeBtn).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(closeBtn).not.toBeVisible();
  });

  test("5. Reconstruction Build History Modal - Active & Exit Flows", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Space");
    await page.waitForTimeout(500);

    const reconTrigger = page.getByRole("button", { name: /reconstruct build history/i }).first();
    if (await reconTrigger.isVisible()) {
      await reconTrigger.click();

      const reconModalHeader = page.getByText(/RECONSTRUCTION/i).first();
      await expect(reconModalHeader).toBeVisible();

      // Test Exit via ESC key
      await page.keyboard.press("Escape");
      await expect(reconModalHeader).not.toBeVisible();
    }
  });

  test("6. Nyx Cat Interactive Field - Context Menu Active & Exit Flow", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Space");
    await page.waitForTimeout(500);

    const commsSection = page.locator("#comms");
    await commsSection.scrollIntoViewIfNeeded();

    // Dispatch contextmenu event on the container
    const catContainer = page.getByTestId("nyx-box");
    await expect(catContainer).toBeVisible();
    await catContainer.dispatchEvent("contextmenu", { clientX: 250, clientY: 250 });

    // Menu should appear
    const cmdHeader = page.getByText("NYX · COMMANDS");
    await expect(cmdHeader).toBeVisible();

    // Exit via ESC
    await page.keyboard.press("Escape");
    await expect(cmdHeader).not.toBeVisible();
  });

  test("7. Depth Navigation Station Jumps", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Space");
    await page.waitForTimeout(500);

    // Jump to Profile
    const profileBtn = page.getByRole("button", { name: "PROFILE" }).first();
    if (await profileBtn.isVisible()) {
      await profileBtn.click();
      await page.waitForTimeout(800);
      const profileSection = page.locator("#profile");
      await expect(profileSection).toBeInViewport();
    }
  });
});
