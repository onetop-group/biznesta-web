/* =====================================================================
   biznesta/token.js — 상품 접근 토큰
   ---------------------------------------------------------------------
   왜 이런 모양인가

     · 주문번호로 상품에 접근할 수 없어야 합니다. 주문번호는 영수증·메일·
       고객센터 대화에 그대로 노출되고, 형식도 공개돼 있어 추측이 쉽습니다.
     · 그래서 접근 권한은 '주문과 무관한 난수' 로만 열립니다.
       256비트(32바이트)입니다. 초당 10억 번 찍어도 우주가 끝날 때까지
       하나를 못 맞춥니다.
     · DB 에는 **sha256 해시만** 저장합니다. 원문은 여기서 만들어져
       링크에 실려 나가고 끝입니다. DB 가 통째로 새도 남의 상품은 안 열립니다.
     · 해시는 **서버에서** 계산해 DB 에 넘깁니다. 원문이 DB 연결을 타고
       가지 않으므로 쿼리 로그·slow query log 에도 남지 않습니다.

   ★ 이 파일의 반환값 중 token(원문)은 로그로 찍지 마십시오.
     한 번 흘리면 그 링크는 영구히 유효합니다(회수 전까지).
   ===================================================================== */
'use strict';

const crypto = require('crypto');

const TOKEN_BYTES = 32;                       /* 256 bit */
const HASH_RE = new RegExp('^[0-9a-f]{64}$');

/* 토큰 원문 → sha256 hex */
function hashToken(token) {
  if (typeof token !== 'string' || !token) throw Object.assign(new Error('BIZ_TOKEN_REQUIRED'), { code: 'BIZ_TOKEN_REQUIRED' });
  return crypto.createHash('sha256').update(token, 'utf8').digest('hex');
}

/* 새 토큰 한 장. { token: 원문, tokenHash: DB 에 갈 값 } */
function createAccessToken() {
  const token = crypto.randomBytes(TOKEN_BYTES).toString('base64url');
  return { token: token, tokenHash: hashToken(token) };
}

function isHash(v) { return typeof v === 'string' && HASH_RE.test(v); }

/* 로그·오류 메시지에 토큰이 섞이지 않았는지 보는 보조 도구 */
function looksLikeToken(v) {
  return typeof v === 'string' && new RegExp('^[A-Za-z0-9_-]{40,}$').test(v);
}

module.exports = { TOKEN_BYTES, createAccessToken, hashToken, isHash, looksLikeToken };
