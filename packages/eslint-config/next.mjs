import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname, // 중요!
});

const prettierPlugin = (await import("eslint-plugin-prettier")).default;

const config = [
  // Next의 legacy preset을 flat으로 변환해 포함
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 공통 규칙 덮어쓰기
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          tabWidth: 2,
          endOfLine: "auto",
          semi: true,
          trailingComma: "es5",
          singleQuote: false,
          printWidth: 300,
          useTabs: false,
          bracketSpacing: true,
          bracketSameLine: false,
          arrowParens: "always",
          quoteProps: "as-needed",
          jsxSingleQuote: false,
          proseWrap: "preserve"
        }
      ],
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off"
    }
  }
];

export default config;
