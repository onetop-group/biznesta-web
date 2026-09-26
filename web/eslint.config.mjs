import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // PAYMENT CORE 사본. 우리 소스가 아니고 여기서 고치면 안 된다
    // (원본을 고치고 npm run vendor:sync). 원본은 CommonJS 라 규칙이 다르다.
    "vendor/**",
  ]),
]);

export default eslintConfig;
