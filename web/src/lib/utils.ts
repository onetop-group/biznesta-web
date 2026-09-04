/** 조건부 클래스 결합 — 외부 의존성 없이 최소한으로 처리합니다. */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}
