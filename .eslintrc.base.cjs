// .eslintrc.base.cjs

// 1. 定义基础规则变量
const baseRule = {
  'no-new': 'off',
  camelcase: 'off',
  'no-return-assign': 'off',
  'space-before-function-paren': 'off',
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

// 2. 定义 TS 规则变量（包含修复补丁）
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
  '@typescript-eslint/no-confusing-void-expression': [
    'error',
    {
      ignoreArrowShorthand: true,
      ignoreVoidOperator: true,
    },
  ],
  '@typescript-eslint/consistent-type-assertions': [
    'error',
    {
      assertionStyle: 'as',
      objectLiteralTypeAssertions: 'allow',
    },
  ],
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

  // === 关键修复：关闭新版 TS-ESLint 已移除的格式化规则 ===
  '@typescript-eslint/block-spacing': 'off',
  '@typescript-eslint/comma-spacing': 'off',
  '@typescript-eslint/brace-style': 'off',
  '@typescript-eslint/func-call-spacing': 'off',
  '@typescript-eslint/indent': 'off',
  '@typescript-eslint/keyword-spacing': 'off',
  '@typescript-eslint/member-delimiter-style': 'off',
  '@typescript-eslint/no-extra-parens': 'off',
  '@typescript-eslint/semi': 'off',
  '@typescript-eslint/space-before-blocks': 'off',
  '@typescript-eslint/space-infix-ops': 'off',
  '@typescript-eslint/type-annotation-spacing': 'off',
  '@typescript-eslint/quotes': 'off',
  '@typescript-eslint/object-curly-spacing': 'off',
  '@typescript-eslint/lines-between-class-members': 'off',
}

// 3. 定义 Vue 规则变量
const vueRule = {
  ...typescriptRule,
  'vue/multi-word-component-names': 'off',
  'vue/max-attributes-per-line': 'off',
  'vue/singleline-html-element-content-newline': 'off',
  'vue/use-v-on-exact': 'off',
  'vue/require-component-is': 'off',
  'vue/html-closing-bracket-newline': ['error', {
    singleline: 'never',
    multiline: 'never',
  }],
  'vue/first-attribute-linebreak': ['error', {
    singleline: 'ignore',
    multiline: 'ignore',
  }],
}

// 4. 导出配置
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
  // === 关键修复：指定 tsconfig 路径，防止 Oops 崩溃 ===
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
}

exports.vue = {
  files: ['*.vue'],
  rules: vueRule,
  parser: 'vue-eslint-parser', // 必须是这个
  extends: [
    'plugin:vue/base',
    'plugin:vue/vue3-recommended',
    'plugin:vue-pug/vue3-recommended',
    'standard-with-typescript',
  ],
  parserOptions: {
    // 关键点 1: 指向专门的 eslint tsconfig
    project: ['./tsconfig.eslint.json'],
    tsconfigRootDir: __dirname,
    // 关键点 2: 显式告诉 parser 处理 vue 扩展名
    extraFileExtensions: ['.vue'],
    parser: {
      js: '@typescript-eslint/parser',
      ts: '@typescript-eslint/parser',
    },
  },
}
