import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Three.js hooks often need empty deps arrays
      'react-hooks/exhaustive-deps': 'warn',
      // Prefer type imports for performance
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      // Allow non-null assertions in Three.js contexts
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // Allow any in shader/Three.js contexts
      '@typescript-eslint/no-explicit-any': 'warn',
      // Unused vars — allow underscore-prefixed
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
]

export default eslintConfig
