import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    // Honor `_`-prefix convention for intentionally-unused identifiers
    // (function parameters, locals, and class members). The TypeScript
    // convention is to prefix unused names with `_`; the default
    // `@typescript-eslint/no-unused-vars` rule does NOT honor this,
    // so we override here. Without this, every contract-preserving
    // stub (`function f(_unused: T)`) fails lint-staged.
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    ignores: [
      '.next/',
      'node_modules/',
      'out/',
      'dist/',
      'visual/test-output/',
      '.lighthouseci/',
      '*.log',
      'next-env.d.ts',
      'capture-*.mjs',
      'audit-capture-*.mjs',
    ],
  },
];

export default eslintConfig;
