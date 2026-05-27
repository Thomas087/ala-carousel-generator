/* ============================================================
   ALA carousel — SLIDER → PNG + PDF exporter
   ------------------------------------------------------------
   Takes a BUILT slider page (carousels/<slug>/index.html, the
   multi-slide output of the building-carousel-slider skill) and
   writes one PNG per slide plus a single multi-page PDF into
   carousels/<slug>/export/.

   Why a dedicated script (vs design_system/export.mjs):
   the slider stacks every slide inside a responsive `.scaler`
   transform and a horizontally-translated `.track`; only one
   slide is on-screen. We must neutralise those transforms or
   every export comes out scaled-down and/or clipped.

   Why we DON'T use Chromium's page.pdf(): its print path
   downsamples the embedded slide images to a few px (blank,
   blurry PDF). Instead we screenshot each slide and embed the
   full-res rasters into a hand-built PDF (zero extra deps —
   only Playwright, already in design_system/node_modules).

   One-time setup (already done in this repo):
     npm install          # playwright
     npx playwright install chromium

   Usage:
     node export-slider.mjs <carousel-dir-or-index.html> [--scale N]
   Examples:
     node export-slider.mjs ../carousels/thailand-cage-free
     node export-slider.mjs ../carousels/thailand-cage-free --scale 1
   --scale is the device pixel ratio (default 2 → 2160×2700 PNGs,
   matching the design system; use 1 for exact 1080×1350).
   ============================================================ */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const CANVAS_W = 1080, CANVAS_H = 1350; // logical slide size (px / pt-at-96dpi base)

// ---- args -------------------------------------------------------------
const args = process.argv.slice(2);
const scaleIdx = args.indexOf('--scale');
const scale = scaleIdx >= 0 ? Number(args[scaleIdx + 1]) : 2;
const target = args.find((a) => !a.startsWith('--') && a !== String(scale));
if (!target) {
  console.error('usage: node export-slider.mjs <carousel-dir-or-index.html> [--scale N]');
  process.exit(1);
}

const abs = path.resolve(process.cwd(), target);
const indexPath = abs.endsWith('.html') ? abs : path.join(abs, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('not found:', indexPath);
  process.exit(1);
}
const slug = path.basename(path.dirname(indexPath));
const outDir = path.join(path.dirname(indexPath), 'export');
fs.mkdirSync(outDir, { recursive: true });

// ---- render -----------------------------------------------------------
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 1500 },
  deviceScaleFactor: scale,
});
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e)));

await page.goto('file://' + indexPath, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

// Prep the page so each .slide paints at its native 1080×1350 on whole pixels.
// We screenshot each .slide element directly (Playwright captures the
// element's own paint), and .slide carries no border-radius/box-shadow — those
// live on the frame — so the crop is clean and square. Rules, in order:
//  • #scaler transform:none — undo fit()'s shrink, else every shot is smaller.
//  • #frameBox natural size + overflow:visible — the frame keeps fit()'s
//    shrunken size and clips the slide unless we restore it; don't reposition
//    it while it still clips (that crops content to the top-left).
//  • body anchored top-left (no centring/padding) — centred, the frame lands
//    at a fractional x and each slide's device rect straddles a column, giving
//    2162px-wide shots; a whole-pixel origin yields exact 2160×2700.
// Do NOT touch .track flex-direction, .slide width/height, or #scaler height —
// any of those collapses the slide's inner flex layout and exports come blank.
await page.addStyleTag({
  content: `#scaler { transform: none !important; }
            #frameBox { width: 1080px !important; height: 1350px !important;
                        overflow: visible !important; }
            body { padding: 0 !important; gap: 0 !important;
                   align-items: flex-start !important; justify-content: flex-start !important; }`,
});

// Wait for every slide image (cut-outs + logo) to finish loading.
await page.evaluate(async () => {
  const imgs = [...document.images];
  await Promise.all(
    imgs.map((img) =>
      img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; })
    )
  );
});
await page.waitForTimeout(250); // let webfonts paint

const slides = await page.$$('.slide');
if (!slides.length) {
  console.error('no .slide elements found — is this a built ALA slider?');
  await browser.close();
  process.exit(1);
}

const jpegBuffers = [];
for (let k = 0; k < slides.length; k++) {
  const n = k + 1;
  const pngPath = path.join(outDir, `slide-${n}.png`);
  await slides[k].screenshot({ path: pngPath });               // lossless PNG deliverable
  jpegBuffers.push(await slides[k].screenshot({ type: 'jpeg', quality: 92 })); // for the PDF
  console.log('exported', path.relative(process.cwd(), pngPath));
}

await browser.close();

// ---- assemble the PDF (one slide per page, full-res JPEG embed) -------
const pdfPath = path.join(outDir, `${slug}.pdf`);
fs.writeFileSync(pdfPath, buildJpegPdf(jpegBuffers, scale));
console.log('exported', path.relative(process.cwd(), pdfPath), `(${jpegBuffers.length} pages)`);

if (pageErrors.length) console.log('page errors:', pageErrors);

/* Minimal PDF writer: each JPEG becomes one page, DCTDecode image XObject
   scaled to fill a CANVAS_W×CANVAS_H-pt page (at 96dpi base → 810×1012.5pt).
   The page is the canvas; the JPEG carries the full scale× pixels. */
function buildJpegPdf(jpegs, dpr) {
  const pw = (CANVAS_W * 72) / 96;
  const ph = (CANVAS_H * 72) / 96;
  const imgW = CANVAS_W * dpr, imgH = CANVAS_H * dpr;

  const objs = [];                       // index 0 unused; objects are 1-based
  const add = (buf) => objs.push(Buffer.isBuffer(buf) ? buf : Buffer.from(buf, 'latin1'));
  objs.push(null); // object 0 (unused)

  // 1: Catalog, 2: Pages — reserve their slots, fill once page nums are known
  const catalogNum = 1, pagesNum = 2;
  objs.push(null, null);

  const pageNums = [];
  jpegs.forEach((jpeg) => {
    const contentStr = `q\n${pw} 0 0 ${ph} 0 0 cm\n/Im0 Do\nQ\n`;
    const contentNum = objs.length;
    add(`${contentNum} 0 obj\n<< /Length ${contentStr.length} >>\nstream\n${contentStr}endstream\nendobj\n`);
    const imgNum = objs.length;
    const head = Buffer.from(
      `${imgNum} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} ` +
      `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
      'latin1'
    );
    add(Buffer.concat([head, jpeg, Buffer.from('\nendstream\nendobj\n', 'latin1')]));
    const pageNum = objs.length;
    pageNums.push(pageNum);
    add(
      `${pageNum} 0 obj\n<< /Type /Page /Parent ${pagesNum} 0 R /MediaBox [0 0 ${pw} ${ph}] ` +
      `/Resources << /XObject << /Im0 ${imgNum} 0 R >> >> /Contents ${contentNum} 0 R >>\nendobj\n`
    );
  });

  objs[catalogNum] = Buffer.from(`${catalogNum} 0 obj\n<< /Type /Catalog /Pages ${pagesNum} 0 R >>\nendobj\n`, 'latin1');
  objs[pagesNum] = Buffer.from(
    `${pagesNum} 0 obj\n<< /Type /Pages /Kids [${pageNums.map((n) => `${n} 0 R`).join(' ')}] /Count ${pageNums.length} >>\nendobj\n`,
    'latin1'
  );

  // serialize with a correct xref table
  let pdf = Buffer.from('%PDF-1.4\n%\xff\xff\xff\xff\n', 'latin1');
  const offsets = [];
  for (let i = 1; i < objs.length; i++) {
    offsets[i] = pdf.length;
    pdf = Buffer.concat([pdf, objs[i]]);
  }
  const xrefPos = pdf.length;
  let xref = `xref\n0 ${objs.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objs.length; i++) {
    xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  xref += `trailer\n<< /Size ${objs.length} /Root ${catalogNum} 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;
  return Buffer.concat([pdf, Buffer.from(xref, 'latin1')]);
}
