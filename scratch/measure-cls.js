const { chromium } = require('@playwright/test');

async function testResolution(width) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width, height: 1080 } });
  const page = await context.newPage();
  
  await page.goto('http://127.0.0.1:3000');
  await page.waitForTimeout(2000);
  
  const locBox = await page.locator('text="KAKINADA, ANDHRA PRADESH, INDIA"').boundingBox();
  const soundBox = await page.locator('text="AUDIO OFF"').boundingBox();
  
  if (locBox && soundBox) {
    const distance = soundBox.x - (locBox.x + locBox.width);
    console.log(`[${width}px] Gap: ${distance.toFixed(1)}px`);
  } else {
    console.log(`[${width}px] Elements not found.`);
  }
  
  await browser.close();
}

(async () => {
  for (const width of [1366, 1440, 1536, 1920]) {
    await testResolution(width);
  }
})();
