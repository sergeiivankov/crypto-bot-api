import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import tsdoc from 'eslint-plugin-tsdoc';

export default tseslint.config(
  eslint.configs.recommended,
  stylistic.configs['recommended-flat'],
  ...tseslint.configs.recommended,
  {
    plugins: {
      stylistic,
      tsdoc,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'tsdoc/syntax': 'warn',
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/no-extra-semi': 'error',
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/semi-style': ['error', 'last'],
      '@stylistic/member-delimiter-style': [
        'error',
        {
          multiline: {
            delimiter: 'comma',
            requireLast: true,
          },
          singleline: {
            delimiter: 'comma',
            requireLast: false,
          },
          multilineDetection: 'brackets',
        },
      ],
      '@stylistic/quote-props': ['error', 'as-needed'],
    },
  },
  {
    ignores: [
      'dist/',
      'examples/',
      'lib/',
    ],
  },
);
