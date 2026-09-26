/* =====================================================================
   core/db/schema.js — CORE schema 파일 목록 · 로더 (STEP 3)
   ---------------------------------------------------------------------
   · SQL 은 '파일' 로만 존재합니다. 이 모듈은 어떤 DB 에도 스스로 접속하지 않습니다.
     실행은 호출자가 넘긴 exec 함수가 합니다 (테스트는 pglite 를 넘깁니다).
   · 운영 DB 적용은 STEP 4 이후 · 별도 승인 대상입니다.
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', '..', 'sql', 'core');

const FILES = [
  '01_types.sql',        /* enum · tenant domain · 통화 · 금액 불변식 */
  '02_orders.sql',       /* 주문                                     */
  '03_intents.sql',      /* 결제 시도                                */
  '04_records.sql',      /* 결제/환불 원장                           */
  '05_events.sql',       /* 상태 이력 (append-only)                  */
  '06_requests.sql',     /* 요청 멱등                                */
  '07_transitions.sql',  /* 전이 허용표 + 가드 트리거                 */
  '08_rpc.sql',          /* 쓰기 진입점                              */
  '09_grants.sql',       /* 직접 쓰기 차단 (권한 실검증은 STEP 4 밖)   */
  '10_actor.sql',        /* actor 기록 (system/admin/provider)       */
  '11_exceptions.sql',   /* 운영자 확인 대상 (중복 승인·기록 실패)      */
  '12_refund.sql',       /* 환불 시도 · 관리자 가드 · 환불 확정         */
  '13_operator.sql',     /* 운영자 해소(감사) · 읽기 전용 운영 조회      */
  '14_hooks.sql',        /* 사업별 hook 전달 기록 (돈의 상태와 분리)     */
  '15_auth_context.sql'  /* 인증 컨텍스트 계약 (관리자 판정 위조 차단)    */
];

/* 실제 역할·RLS 가 있는 환경에서만 적용합니다 (pglite 는 단일 superuser 라 강제 불가).
   ★ 아래 파일은 아직 실검증되지 않았습니다 — test/supabase-verify.js 로 검증합니다. */
const RLS_FILES = ['16_rls.sql'];

function read(name) { return fs.readFileSync(path.join(DIR, name), 'utf8'); }
function all() { return FILES.map(f => ({ name: f, sql: read(f) })); }
function combined() { return all().map(f => '-- >>> ' + f.name + '\n' + f.sql).join('\n\n'); }

/* exec(sql) 를 순서대로 호출합니다. 어느 파일에서 실패했는지 알려줍니다. */
async function apply(exec) {
  if (typeof exec !== 'function') throw new Error('PAY_SCHEMA_EXEC_REQUIRED');
  const applied = [];
  for (const f of all()) {
    try {
      await exec(f.sql);
      applied.push(f.name);
    } catch (e) {
      const err = new Error('PAY_SCHEMA_FAILED:' + f.name + ':' + (e && e.message));
      err.code = 'PAY_SCHEMA_FAILED';
      err.file = f.name;
      err.cause = e;
      throw err;
    }
  }
  return applied;
}

module.exports = { DIR, FILES, RLS_FILES, read, all, combined, apply };
