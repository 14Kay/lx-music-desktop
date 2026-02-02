const baseRule = {
  'no-new': 'off',
  camelcase: 'off',
  'no-return-assign': 'off',
  'space-before-function-paren': ['error', 'never'],
  'no-var': 'error',
  'no-fallthrough': 'off',
  eqeqeq: 'off',
  'require-atomic-updates': ['error', { allowProperties: true }],
  'no-multiple-empty-lines': [1, { max: 2 }],
  'comma-dangle': [2, 'always-multiline'],
  'standard/no-callback-literal': 'off',
  'prefer-const': 'off',
  'no-labels': 'off',
  'node/no-callback-literal': 'off',
  'multiline-ternary': 'off',
}
const typescriptRule = {
  ...baseRule,
  '@typescript-eslint/strict-boolean-expressions': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/space-before-function-paren': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-floating-promises': 'off',
  '@typescript-eslint/restrict-template-expressions': [1, {
    allowBoolean: true,
    allowAny: true,
  }],
  '@typescript-eslint/restrict-plus-operands': [1, {
    allowBoolean: true,
    allowAny: true,
  }],
  '@typescript-eslint/no-misused-promises': [
    'error',
    {
      checksVoidReturn: {
        arguments: false,
        attributes: false,
      },
    },
  ],
  '@typescript-eslint/naming-convention': 'off',
  '@typescript-eslint/return-await': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/comma-dangle': 'off',
  '@typescript-eslint/no-unsafe-argument': 'off',
}
const vueRule = {
  ...typescriptRule,
  'vue/multi-word-component-names': 'off',
  'vue/max-attributes-per-line': 'off',
  'vue/singleline-html-element-content-newline': 'off',
  'vue/use-v-on-exact': 'off',
}

exports.base = {
  extends: ['standard'],
  rules: baseRule,
  parser: '@babel/eslint-parser',
}

exports.html = {
  files: ['*.html'],
  plugins: ['html'],
}

exports.typescript = {
  files: ['*.ts'],
  rules: typescriptRule,
  parser: '@typescript-eslint/parser',
  extends: [
    'standard-with-typescript',
  ],
}

exports.vue = {
  files: ['*.vue'],
  // 🔴 核心修复 1：最外层必须是 vue-eslint-parser
  parser: 'vue-eslint-parser',

  parserOptions: {
    // 🔴 核心修复 2：TS 解析器必须放在 parserOptions 里
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true
    },
    extraFileExtensions: ['.vue'],
  },

  extends: [
    'plugin:vue/vue3-recommended',
    // 'standard-with-typescript' // ⚠️ 建议先注释掉这个，因为它包含了很多过时规则
    'plugin:@typescript-eslint/recommended' // 改用这个更稳定的推荐配置
  ],R

  rules: {
    // 这里放你的自定义规则
    // ...vueRule, 

    // 🔴 核心修复 3：手动关闭找不到的规则（或者直接删掉这些配置）
    '@typescript-eslint/type-annotation-spacing': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',

    // Vue 特有规则
    'vue/multi-word-component-names': 'off',
  }
}