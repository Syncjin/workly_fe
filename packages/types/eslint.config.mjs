import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const prettierPlugin = (await import("eslint-plugin-prettier")).default;

const config = [
  // TypeScript와 React 기본 설정
  ...compat.extends("@typescript-eslint/recommended", "prettier"),

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
      "prefer-arrow-callback": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "warn"
    }
  },

  // 테스트 파일 설정
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];

export default config;