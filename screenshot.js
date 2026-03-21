/**
 * Quick visual check: captures the running app at localhost:4200
 * and saves it to ScreenShots/ with a timestamp.
 *
 * Usage:  node screenshot.js
 *         node screenshot.js full      ← full-page screenshot
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FULL_PAGE = process.argv.includes('full');
const OUT_DIR   = path.join(__dirname, 'ScreenShots');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const OUT_FILE  = path.join(OUT_DIR, `check-${TIMESTAMP}.png`);

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

  const browser = await chromium.launch();
  const page    = await browser.newPage();

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle' });

  await page.screenshot({ path: OUT_FILE, fullPage: FULL_PAGE });
  await browser.close();

  console.log(`Screenshot saved: ${OUT_FILE}`);
})();
