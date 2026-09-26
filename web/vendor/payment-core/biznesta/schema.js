/* =====================================================================
   biznesta/schema.js — BIZNESTA STORE schema 파일 목록 · 로더
   ---------------------------------------------------------------------
   core/db/schema.js 와 같은 방식입니다. 스스로 어떤 DB 에도 접속하지 않고,
   호출자가 넘긴 exec(sql) 로만 적용합니다.

   FILES     표 + 쓰기 진입점 — 역할이 없는 환경(pglite)에서도 적용됩니다.
   RLS_FILES 권한 · RLS — anon/authenticated/is_admin() 이 있는 환경 전용.
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'sql');

const FILES = ['30_store.sql', '32_products_ops.sql'];
const RLS_FILES = ['31_rls.sql', '33_products_rls.sql'];

function read(name) { return fs.readFileSync(path.join(DIR, name), 'utf8'); }
function all(list) { return (list || FILES).map(f => ({ name: f, sql: read(f) })); }

async function apply(exec, list) {
  if (typeof exec !== 'function') throw new Error('BIZ_SCHEMA_EXEC_REQUIRED');
  const applied = [];
  for (const f of all(list)) {
    try {
      await exec(f.sql);
      applied.push(f.name);
    } catch (e) {
      const err = new Error('BIZ_SCHEMA_FAILED:' + f.name + ':' + (e && e.message));
      err.code = 'BIZ_SCHEMA_FAILED';
      err.file = f.name;
      err.cause = e;
      throw err;
    }
  }
  return applied;
}

/* 이 도메인이 쓰는 이름 — rollback · 스냅샷 도구가 씁니다 */
const PREFIX = 'biz_';
const TABLES = ['biz_products', 'biz_buyers', 'biz_entitlements'];
const FUNCTIONS = ['biz_set_updated_at', 'biz_products_ref_immutable', 'biz_buyer_upsert', 'biz_entitlement_grant',
  'biz_entitlement_revoke', 'biz_entitlement_by_token'];

module.exports = { DIR, FILES, RLS_FILES, PREFIX, TABLES, FUNCTIONS, read, all, apply };
