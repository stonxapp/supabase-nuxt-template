// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      // Add custom rules here
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      // Vue TypeScript rules
      'vue/require-v-for-key': 'error',
      'vue/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'vue/prefer-import-from-vue': 'error',
    },
  }
)
