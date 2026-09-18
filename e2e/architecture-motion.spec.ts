import { test, expect } from '@playwright/test';

test.describe('Project Architecture Motion', () => {
  test.use({
    viewport: { width: 1440, height: 900 },
    colorScheme: 'dark',
    hasTouch: false,
  });

  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  test('asserts autonomous tracer motion, visibility pause, and return resume', async ({ page }) => {
    // 1. Navigate to the page
    await page.goto('/');

    // Wait for the hydration to finish
    await page.waitForLoadState('networkidle');
    
    // 2. Find the first architecture element
    const architectureRoot = page.locator('[data-arch-root]').first();
    
    // Scroll it into view
    await architectureRoot.scrollIntoViewIfNeeded();

    // 3. Verify assembly and playback start
    await expect(architectureRoot).toHaveAttribute('data-assembled', 'true', { timeout: 5000 });
    await expect(architectureRoot).toHaveAttribute('data-playback', 'playing', { timeout: 2000 });

    // 4. Sample tracer motion over a few seconds
    let tracerChanged = false;
    let phaseAdvanced = false;
    let becameVisible = false;

    let previousPhase = await architectureRoot.getAttribute('data-phase');
    let previousPath = '';
    
    // Sample every 500ms for up to 5 seconds
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(500);

      const currentPhase = await architectureRoot.getAttribute('data-phase');
      if (currentPhase !== previousPhase && previousPhase !== null) {
        phaseAdvanced = true;
      }
      previousPhase = currentPhase;

      // Extract all tracers in the architecture
      const tracers = await architectureRoot.locator('[data-arch-tracer]').all();
      
      for (const tracer of tracers) {
        const opacity = await tracer.evaluate(node => window.getComputedStyle(node).opacity);
        const path = await tracer.getAttribute('d');
        
        if (parseFloat(opacity) > 0) {
          becameVisible = true;
          if (path && previousPath && path !== previousPath) {
            tracerChanged = true;
          }
          if (path) {
            previousPath = path;
          }
        }
      }

      if (tracerChanged && phaseAdvanced && becameVisible) {
        break;
      }
    }

    expect(becameVisible).toBe(true);
    expect(tracerChanged).toBe(true);
    expect(phaseAdvanced).toBe(true);

    // 5. Visibility Regression Test - Scroll away
    // Scroll back to the top of the page, completely hiding the architecture
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500); // Allow intersection observer to fire
    
    await expect(architectureRoot).toHaveAttribute('data-playback', 'paused', { timeout: 2000 });

    // 6. Return and Resume
    await architectureRoot.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    await expect(architectureRoot).toHaveAttribute('data-playback', 'playing', { timeout: 2000 });
    await expect(architectureRoot).toHaveAttribute('data-assembled', 'true', { timeout: 1000 }); // Must stay true
  });
});
