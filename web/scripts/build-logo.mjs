/**
 * BIZNESTA 로고 파생본 생성 스크립트
 * ------------------------------------------------------------------
 * 입력 : ../비즈네스타 로고.png  (제공받은 공식 로고)
 * 출력 : public/brand/logo-navy.png   — 배경 투명, 원본 색 그대로
 *        public/brand/logo-white.png  — 배경 투명 + 네이비 글자만 흰색으로 반전
 *
 * ⚠️ 로고의 형태 · 자간 · 비율 · 골드 N 은 일절 변형하지 않습니다.
 *    하는 일은 세 가지뿐입니다.
 *      1) 흰 배경 픽셀을 투명하게
 *      2) (white 버전만) 어두운 네이비 글자를 흰색으로 치환 — 골드는 유지
 *      3) 투명해진 바깥 여백을 잘라내기 (마크는 그대로, 빈 공간만 제거)
 *
 * 향후 SVG 원본을 받으면 이 스크립트와 PNG 는 폐기하고
 * src/components/ui/Logo.tsx 의 LOGO_SOURCES 경로만 교체하면 됩니다.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SOURCE = path.resolve(here, '../../비즈네스타 로고.png');
const OUT_DIR = path.resolve(here, '../public/brand');

/** 흰 배경으로 간주할 밝기 기준 */
const WHITE_MIN = 232;
/** 골드로 간주할 조건 — 붉은기가 파란기보다 뚜렷하게 강한 픽셀 */
const GOLD_R_OVER_B = 26;

async function build() {
  await mkdir(OUT_DIR, { recursive: true });

  const image = sharp(SOURCE).ensureAlpha();
  const { width, height } = await image.metadata();
  const { data } = await image.raw().toBuffer({ resolveWithObject: true });

  const navy = Buffer.from(data);
  const white = Buffer.from(data);

  let transparent = 0;
  let inverted = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r >= WHITE_MIN && g >= WHITE_MIN && b >= WHITE_MIN) {
      navy[i + 3] = 0;
      white[i + 3] = 0;
      transparent += 1;
      continue;
    }

    /* 경계 픽셀은 밝기에 비례해 알파를 낮춰 계단현상을 막습니다 */
    const luminance = (r + g + b) / 3;
    if (luminance > 200) {
      const alpha = Math.round(((WHITE_MIN - luminance) / (WHITE_MIN - 200)) * 255);
      navy[i + 3] = alpha;
      white[i + 3] = alpha;
    }

    /* white 버전: 골드가 아닌 어두운 글자만 흰색으로 */
    const isGold = r - b >= GOLD_R_OVER_B && r > 90;
    if (!isGold) {
      white[i] = 255;
      white[i + 1] = 255;
      white[i + 2] = 255;
      inverted += 1;
    }
  }

  const raw = { raw: { width, height, channels: 4 } };

  const navyOut = await sharp(navy, raw)
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toBuffer({ resolveWithObject: true });

  const whiteOut = await sharp(white, raw)
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toBuffer({ resolveWithObject: true });

  await sharp(navyOut.data).toFile(path.join(OUT_DIR, 'logo-navy.png'));
  await sharp(whiteOut.data).toFile(path.join(OUT_DIR, 'logo-white.png'));

  console.log(`원본            : ${width}x${height}`);
  console.log(`투명 처리 픽셀  : ${transparent.toLocaleString()}`);
  console.log(`흰색 치환 픽셀  : ${inverted.toLocaleString()}  (골드 N 유지)`);
  console.log(`여백 제거 후    : ${navyOut.info.width}x${navyOut.info.height}`);
  console.log(`출력            : public/brand/logo-navy.png · logo-white.png`);
}

build().catch((error) => {
  console.error('로고 생성 실패:', error.message);
  process.exit(1);
});
