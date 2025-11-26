import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/**', 'build/**', 'coverage/**', '.turbo/**', '*.config.mjs', '*.config.ts'] },

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
    plugins: { import: importPlugin },
    rules: {
      // import 정렬 정도만
      'import/order': ['error', {
        groups: ['builtin','external','internal','parent','sibling','index','object','type'],
        'newlines-between': 'always',
      }],
    },
  },
];
