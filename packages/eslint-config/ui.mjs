import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/**', 'build/**', 'coverage/**', '.turbo/**'] },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
    },
    plugins: { react, 'react-hooks': reactHooks, import: importPlugin },
    settings: { react: { version: 'detect' } },
    rules: {
      'import/order': ['error', {
        groups: ['builtin','external','internal','parent','sibling','index','object','type'],
        'newlines-between': 'always',
      }],

      // React 라이브러리 기본
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-console': 'warn',
    },
  },
];
