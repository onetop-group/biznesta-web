/* =====================================================================
   core/tenant.js — tenant 식별자 (STEP 3 · P-7)
   ---------------------------------------------------------------------
   · tenant 는 문자열 slug 입니다. UUID 참조 테이블을 두지 않습니다.
   · 사용자가 보내는 자유 문자열이 아니라 **등록된 Adapter/config 가 제공한
     식별자** 여야 합니다. 등록되지 않은 값은 거부합니다.
   · ★ CORE 는 어떤 브랜드명도 하드코딩하지 않습니다.
     아래 어디에도 서비스 이름이 없고, 기본 tenant 도 없습니다.
   ===================================================================== */
'use strict';

const SLUG = new RegExp('^[a-z][a-z0-9_]{1,62}$');
const REGISTRY = new Map();   /* slug → { slug, orderPrefix, registeredAt } */

function err(code, detail) {
  const e = new Error(code + (detail ? ':' + detail : ''));
  e.code = code;
  return e;
}

/* 형식만 검사합니다 (등록 여부는 보지 않음) */
function isWellFormed(slug) { return typeof slug === 'string' && SLUG.test(slug); }

/* Adapter/config 가 부팅 시 자기 tenant 를 등록합니다. */
function register(def) {
  const d = def || {};
  const slug = d.slug == null ? '' : String(d.slug).trim();
  if (!isWellFormed(slug)) throw err('PAY_TENANT_MALFORMED', slug || 'empty');

  const prefix = d.orderPrefix == null ? '' : String(d.orderPrefix).trim().toUpperCase();
  if (!new RegExp('^[A-Z][A-Z0-9]{1,7}$').test(prefix)) throw err('PAY_ORDER_PREFIX_MALFORMED', prefix || 'empty');

  const existing = REGISTRY.get(slug);
  if (existing && existing.orderPrefix !== prefix) throw err('PAY_TENANT_REDEFINED', slug);

  /* 같은 prefix 를 다른 tenant 가 쓰면 주문번호가 섞여 보입니다 */
  for (const [s, v] of REGISTRY) {
    if (s !== slug && v.orderPrefix === prefix) throw err('PAY_ORDER_PREFIX_TAKEN', prefix);
  }

  const row = { slug: slug, orderPrefix: prefix, registeredAt: Date.now() };
  REGISTRY.set(slug, row);
  return row;
}

/* 등록된 tenant 인지 확인하고 정의를 돌려줍니다. */
function assertRegistered(slug) {
  if (!isWellFormed(slug)) throw err('PAY_TENANT_MALFORMED', String(slug));
  const row = REGISTRY.get(slug);
  if (!row) throw err('PAY_TENANT_UNKNOWN', slug);
  return row;
}

function get(slug) { return REGISTRY.get(String(slug)) || null; }
function list() { return Array.from(REGISTRY.values()).map(r => ({ slug: r.slug, orderPrefix: r.orderPrefix })); }
function clear() { REGISTRY.clear(); }

module.exports = { register, assertRegistered, isWellFormed, get, list, clear, SLUG };
