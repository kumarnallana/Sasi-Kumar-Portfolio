import { test, expect } from "@playwright/test";

test.describe("Portfolio E2E Tests - Active & Exit Flows", () => {
  test("1. Clean Console & No Critical Warnings on Load", async ({ page }) => {
    const criticalLogs: string[] = [];

    page.on("console", (msg) => {
      const text = msg.text();
      const source = msg.location().url;
      const expectedTelemetryBlock =
        source.startsWith("https://va.vercel-scripts.com/") &&
        text.includes("ERR_NETWORK_ACCESS_DENIED");
      const expectedGitHubOutage =
        source.includes("/api/github/graphql") &&
        text.includes("503 (Service Unavailable)");

      if (expectedTelemetryBlock || expectedGitHubOutage) return;

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

  test("2a. Hero recruiter actions reach projects, resume, and contact", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Space");

    const resume = page.getByRole("link", { name: "RESUME ↗", exact: true });
    await expect(resume).toHaveAttribute("href", "/resume/Nallana_SasiKumar_FullStack_Resume.pdf");
    const resumeResponse = await page.request.get("/resume/Nallana_SasiKumar_FullStack_Resume.pdf");
    expect(resumeResponse.ok()).toBeTruthy();

    await page.getByRole("link", { name: "VIEW PROJECTS" }).click();
    await expect(page.locator("#systems")).toBeInViewport();
    await page.getByRole("link", { name: "CONTACT", exact: true }).click();
    await expect(page.locator("#comms")).toBeInViewport();
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

  test("4. Inline Project Architecture - Responsive Visibility", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Space");
    await page.waitForTimeout(500);

    // Navigate or scroll to systems section
    const systemsSection = page.locator("#systems");
    await systemsSection.scrollIntoViewIfNeeded();

    const architecture = systemsSection.getByText("SYS.ARCHITECTURE", { exact: true }).first();
    await expect(architecture).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(architecture).toBeHidden();
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

test.describe("GitHub portfolio states", () => {
  const livePayload = {
    publicReposCount: 1,
    totalStars: 7,
    totalCommitContributions: 12,
    totalPullRequestContributions: 2,
    pinnedRepositories: [
      {
        name: "verified-repository",
        description: "Deterministic live-state fixture.",
        url: "https://github.com/kumarnallana/verified-repository",
        stargazerCount: 7,
        primaryLanguage: { name: "TypeScript", color: "#3178c6" },
        updatedAt: "2026-09-14T00:00:00.000Z",
      },
    ],
    recentRepositories: [],
  };

  test("loading settles into live data without fake zero values", async ({ page }) => {
    await page.route("**/api/github/graphql", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(livePayload) });
    });

    await page.goto("/");
    await page.keyboard.press("Space");
    const signals = page.locator("#signals");
    await expect(signals.getByRole("status", { name: "Loading GitHub repositories" })).toBeVisible();
    await expect(signals.getByText("verified-repository")).toBeVisible();
    await expect(signals.getByText("7★").first()).toBeVisible();
  });

  test("successful empty data is presented as an empty state", async ({ page }) => {
    await page.route("**/api/github/graphql", (route) => route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ...livePayload, publicReposCount: 0, totalStars: 0, pinnedRepositories: [] }),
    }));

    await page.goto("/");
    await page.keyboard.press("Space");
    await expect(page.locator("#signals").getByText("NO PUBLIC REPOSITORY ACTIVITY")).toBeVisible();
  });

  test("an outage stays truthful and a later response recovers automatically", async ({ page }) => {
    let requests = 0;
    await page.route("**/api/github/graphql", (route) => {
      requests += 1;
      if (requests === 1) {
        return route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ available: false }) });
      }
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(livePayload) });
    });

    await page.goto("/");
    await page.keyboard.press("Space");
    const signals = page.locator("#signals");
    await expect(signals.getByText("verified-repository")).toBeVisible({ timeout: 7000 });
    expect(requests).toBeGreaterThan(1);
  });

  test("a sustained outage shows unavailable values and preserves the page", async ({ page }) => {
    await page.route("**/api/github/graphql", (route) => route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ available: false }),
    }));

    await page.goto("/");
    await page.keyboard.press("Space");
    const signals = page.locator("#signals");
    await expect(signals.getByText("LIVE GITHUB SIGNAL TEMPORARILY UNAVAILABLE")).toBeVisible({ timeout: 10000 });
    await expect(signals.getByLabel("Total stars unavailable")).toHaveText("—");
    await expect(page.getByRole("heading", { name: /contact/i })).toBeAttached();
  });
});
