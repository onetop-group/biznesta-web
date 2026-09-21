/**
 * BIZNESTA 개인정보처리방침 — 본문 데이터.
 *
 * 작성 기준: **코드와 DB 가 실제로 수집하는 것만** 적는다.
 *   · 수집 항목      src/lib/inquiry.ts · src/lib/inquiry-db.ts
 *   · 저장 위치      supabase/migrations/0001_inquiries.sql (public.inquiries)
 *   · 처리 경로      src/app/actions/inquiry.ts (Server Action)
 *
 * 실제로 하지 않는 것은 쓰지 않는다. 현재 이 사이트에는 다음이 **없다**:
 *   Google Analytics · Vercel Analytics · Meta Pixel · Naver Analytics ·
 *   광고 추적 · 쿠키 사용 · localStorage · 외부 임베드 · 회원가입 · 결제.
 *
 * 사용자가 확정해야 하는 값은 TBD 로 두고 임의로 만들지 않는다.
 * TBD 가 하나라도 남아 있으면 Production 공개 전에 채워야 한다.
 */

import {
  BRAND, BUSINESS_ADDRESS, BUSINESS_NUMBER, CEO_NAME, COMPANY_NAME,
  CONSULT_EMAIL, CONSULT_PHONE, ECOMMERCE_REGISTRATION_NUMBER,
} from './business';

export const TBD = '확정 후 안내 예정';

export const LAST_UPDATED = '2026-09-21 (초안)';

export type Row = { label: string; value: string };
export type Section = {
  title: string;
  body?: string[];
  list?: string[];
  rows?: Row[];
  /** 사용자 확정이 필요한 절 */
  pending?: boolean;
};

export const PRIVACY: Section[] = [
  {
    title: '수집하는 개인정보 항목',
    body: [
      '비즈네스타는 홈페이지의 상담 신청 폼을 통해서만 개인정보를 수집합니다. 회원가입 절차가 없으며, 상담 신청 외에 개인정보를 수집하는 기능은 운영하지 않습니다.',
    ],
    list: [
      '필수: 이름, 연락처, 문의 유형, 문의 내용, 개인정보 수집·이용 동의 여부',
      '선택: 이메일 주소 (PC 화면의 상담 폼에서만 입력받습니다)',
      '자동 기록: 상담을 신청한 화면 경로와 유입 지점(어떤 안내 화면에서 상담으로 이동했는지), PC/모바일 구분, 접수 일시',
    ],
  },
  {
    title: '개인정보의 이용 목적',
    list: [
      '상담 신청 내용 확인 및 회신',
      '문의하신 내용에 맞는 제작·운영 방식 안내',
      '상담 진행 상황 관리',
    ],
    body: [
      '수집한 정보는 위 목적 외의 용도로 이용하지 않으며, 광고 발송이나 마케팅 목적으로 이용하지 않습니다.',
    ],
  },
  {
    title: '보유 및 이용 기간',
    body: [
      '상담 신청 정보는 상담 목적이 달성된 뒤 보유 기간이 지나면 파기합니다. 구체적인 보유 기간은 아래와 같이 확정 예정입니다.',
      '현재 시스템에는 자동 삭제 기능이 적용되어 있지 않으며, 보유 기간 확정 후 삭제 절차를 함께 적용할 예정입니다.',
    ],
    rows: [{ label: '상담 신청 정보 보유 기간', value: TBD }],
    pending: true,
  },
  {
    title: '개인정보의 제3자 제공',
    body: [
      '비즈네스타는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 법령에 따라 제출 의무가 발생하는 경우에만 관련 법령이 정한 절차에 따릅니다.',
    ],
  },
  {
    title: '개인정보 처리의 위탁',
    body: [
      '서비스 운영을 위해 아래 사업자의 인프라를 이용합니다. 이들 사업자는 비즈네스타의 지시에 따라 데이터를 저장·전송하는 역할만 수행합니다.',
    ],
    rows: [
      { label: 'Supabase Inc.', value: '상담 신청 내용 데이터베이스 보관' },
      { label: 'Vercel Inc.', value: '홈페이지 호스팅 및 요청 처리' },
    ],
  },
  {
    title: '쿠키 및 자동 수집 장치',
    body: [
      '이 홈페이지는 광고 식별자나 행태정보 수집을 위한 쿠키를 사용하지 않습니다. Google Analytics, Meta Pixel 등 외부 분석·광고 추적 도구를 설치하지 않았습니다.',
      '다만 서비스 제공에 필요한 범위에서 호스팅 사업자의 서버 접속 기록이 생성될 수 있습니다.',
    ],
  },
  {
    title: '이용자의 권리',
    body: [
      '이용자는 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. 요청은 아래 연락처로 접수하며, 확인 절차를 거쳐 지체 없이 처리합니다.',
    ],
  },
  {
    title: '개인정보의 파기',
    body: [
      '보유 기간이 지나거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자적 파일 형태의 정보는 복구할 수 없는 방법으로 삭제합니다.',
    ],
  },
  {
    title: '개인정보 보호를 위한 조치',
    list: [
      '상담 신청 데이터는 접근 권한이 제한된 데이터베이스에 저장합니다.',
      '홈페이지에서 사용하는 공개 키로는 상담 내용을 조회·수정·삭제할 수 없으며, 신규 접수만 가능합니다.',
      '개인정보 수집·이용에 동의하지 않은 신청은 저장되지 않습니다.',
    ],
  },
  {
    title: '사업자 및 개인정보 보호책임자',
    body: [
      `${BRAND}는 ${COMPANY_NAME}가 운영하는 브랜드입니다. 이 사이트의 서비스 제공 주체는 아래 사업자입니다.`,
    ],
    rows: [
      { label: '브랜드', value: BRAND },
      { label: '상호', value: COMPANY_NAME },
      { label: '대표자', value: CEO_NAME },
      { label: '사업자등록번호', value: BUSINESS_NUMBER },
      { label: '통신판매업 신고번호', value: ECOMMERCE_REGISTRATION_NUMBER },
      { label: '사업장 소재지', value: BUSINESS_ADDRESS },
      /* 2026-09-21 — 개인사업자라 보호책임자는 대표자 본인(사용자 확정). 연락처는
         바로 아래 「문의 연락처」 의 공통 고객센터 · 이메일이다. */
      { label: '개인정보 보호책임자', value: CEO_NAME },
      { label: '문의 연락처', value: `${CONSULT_EMAIL} / ${CONSULT_PHONE}` },
    ],
  },
  {
    title: '방침의 변경',
    body: [
      '이 방침의 내용이 변경되는 경우 변경 사항과 적용 일자를 이 페이지에 게시합니다.',
    ],
  },
];
