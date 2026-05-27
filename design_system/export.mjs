/* ============================================================
   ALA carousel — HTML → PNG exporter
   ------------------------------------------------------------
   Renders every template in ./templates to a 1080×1350 PNG in
   ./exports, cropped exactly to the .ala-slide element.

   One-time setup:
     npm install playwright
     npx playwright install chromium

   Usage:
     node export.mjs              # -> design_system/exports/*.png
     node export.mjs /some/dir    # custom output directory
   ============================================================ */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tplDir = path.join(__dirname, 'templates');
const outDir = process.argv[2] || path.join(__dirname, 'exports');
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(tplDir).filter((f) => f.endsWith('.html'));

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 }); // 2× for crisp output

for (const f of files) {
  await page.goto('file://' + path.join(tplDir, f), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250); // let webfonts paint
  const slide = await page.$('.ala-slide');
  const out = path.join(outDir, f.replace('.html', '.png'));
  await slide.screenshot({ path: out });
  console.log('exported', path.basename(out));
}

await browser.close();
