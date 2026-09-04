import type { IconName } from '@/components/ui/Icon';

/**
 * BIZNESTA 시그니처 — BN_PC_08.
 *
 * ⚠️ 지시서 18항의 디자인 등급 SIGNATURE 와는 다른 개념입니다.
 *    여기는 "왜 비즈네스타인가"를 보여주는 제작 방식 페이지입니다.
 *    (승인된 M-10 · 명칭 분리)
 *
 * Phase 3-B 이후 contents 테이블의 고정 문구 블록으로 옮길 수 있습니다.
 * 현재는 코드 수정이 필요한 항목이며, 완료 보고서의 매핑표에 명시합니다.
 */

export const signatureIntro: Array<{ icon: IconName; title: string; body: string[] }> = [
  { icon: 'diamond', title: '전략 기반 설계', body: ['비즈니스 목표에 맞춘', '맞춤 전략 수립'] },
  { icon: 'pencil', title: '브랜드 중심 디자인', body: ['차별화된 브랜드 가치를', '담은 디자인'] },
  { icon: 'gear', title: '탄탄한 기술 구현', body: ['안정적이고 확장 가능한', '기술 시스템'] },
  { icon: 'headset', title: '지속적인 운영 지원', body: ['운영 · 관리 · 마케팅까지', '토탈 케어'] },
];

export const signatureSteps: Array<{ no: string; title: string; body: string[] }> = [
  {
    no: '01',
    title: '전략 컨설팅',
    body: ['고객의 비즈니스를 깊이 이해하고,', '성장 전략을 도출합니다.'],
  },
  {
    no: '02',
    title: '브랜드 & 디자인',
    body: ['브랜드 아이덴티티를 반영한', '차별화된 디자인을 완성합니다.'],
  },
  {
    no: '03',
    title: '개발 & 시스템 구축',
    body: ['안정적이고 확장 가능한 기술로', '최적의 시스템을 구축합니다.'],
  },
  {
    no: '04',
    title: '검수 & 최적화',
    body: ['꼼꼼한 검수와 성능 최적화로', '완성도를 끌어올립니다.'],
  },
  {
    no: '05',
    title: '운영 & 성장 지원',
    body: ['지속적인 운영 지원과 관리로', '비즈니스 성장을 함께합니다.'],
  },
];

export const signatureReasons: string[] = [
  '비즈니스 목표를 함께 고민하는 파트너십',
  '보이는 화면과 운영 화면을 함께 설계',
  '업종과 목적에 맞춘 맞춤 전략',
  '안정적이고 확장 가능한 기술력',
  '제작 후에도 이어지는 운영 지원',
];
