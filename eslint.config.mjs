import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import prettier from '@vue/eslint-config-prettier'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/.*/**', '**/._*'],
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  prettier,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-deprecated-v-on-native-modifier': 'off',
      'no-console': ['error', { allow: ['error'] }],
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-namespace': 'off',
    },
  },
]
