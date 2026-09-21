/**
 * Subsets Pretendard Variable down to the glyphs this site actually uses.
 *
 * Source of characters: every string in src/** (data files, components,
 * metadata) plus printable ASCII and common punctuation, so copy that is
 * later supplied by Admin still needs a re-run only when new Hangul appears.
 *
 *   node scripts/build-font.mjs
 *
 * Input : fonts-src/PretendardVariable.woff2   (full weight axis 45-920)
 * Output: public/fonts/pretendard-subset.woff2
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import subsetFont from 'subset-font';

const SRC_FONT = 'fonts-src/PretendardVariable.woff2';
const OUT_FONT = 'public/fonts/pretendard-subset.woff2';
const SCAN_DIRS = ['src'];
const SCAN_EXT = new Set(['.ts', '.tsx', '.css', '.json', '.md']);

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (SCAN_EXT.has(extname(p))) acc.push(p);
  }
  return acc;
}

const chars = new Set();
// printable ASCII + typographic punctuation that layouts rely on
for (let c = 0x20; c <= 0x7e; c++) chars.add(String.fromCharCode(c));
for (const c of '···—–…“”‘’「」『』〈〉《》→←↑↓·※©®℃㎡±×÷≤≥∙•○●◎△▲▽▼□■☆★') chars.add(c);

for (const dir of SCAN_DIRS) {
  for (const file of walk(dir)) {
    for (const c of readFileSync(file, 'utf8')) {
      const code = c.codePointAt(0);
      // Hangul syllables, Jamo, CJK punctuation, Latin-1 supplement
      if (
        (code >= 0xac00 && code <= 0xd7a3) ||
        (code >= 0x1100 && code <= 0x11ff) ||
        (code >= 0x3130 && code <= 0x318f) ||
        (code >= 0x3000 && code <= 0x303f) ||
        (code >= 0x00a0 && code <= 0x024f)
      ) {
        chars.add(c);
      }
    }
  }
}

const text = [...chars].join('');
const input = readFileSync(SRC_FONT);
const out = await subsetFont(input, text, { targetFormat: 'woff2', variationAxes: { wght: { min: 300, max: 900 } } });

mkdirSync('public/fonts', { recursive: true });
writeFileSync(OUT_FONT, out);

console.log(
  `glyphs kept: ${chars.size}  |  ${(input.length / 1024).toFixed(0)}KB -> ${(out.length / 1024).toFixed(0)}KB`
);
