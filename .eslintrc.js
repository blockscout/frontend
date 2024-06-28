const RESTRICTED_MODULES = {
  paths: [
    { name: 'dayjs', message: 'Please use lib/date/dayjs.ts instead of directly importing dayjs' },
    { name: '@chakra-ui/icons', message: 'Using @chakra-ui/icons is prohibited. Please use regular svg-icon instead (see examples in "icons/" folder)' },
    { name: '@metamask/providers', message: 'Please lazy-load @metamask/providers or use useProvider hook instead' },
    { name: '@metamask/post-message-stream', message: 'Please lazy-load @metamask/post-message-stream or use useProvider hook instead' },
    { name: 'playwright/TestApp', message: 'Please use render() fixture from test() function of playwright/lib module' },
    {
      name: '@chakra-ui/react',
      importNames: [ 'Popover', 'Menu', 'useToast' ],
      message: 'Please use corresponding component or hook from ui/shared/chakra component instead',
    },
    {
      name: 'lodash',
      message: 'Please use `import [package] from \'lodash/[package]\'` instead.',
    },
  ],
  patterns: [
    'icons/*',
    '!lodash/*',
  ],
};

module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  'extends': [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:regexp/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:playwright/playwright-test',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  plugins: [
    'es5',
    'react',
    'regexp',
    '@typescript-eslint',
    'react-hooks',
    'jsx-a11y',
    'eslint-plugin-import-helpers',
    'jest',
    'eslint-plugin-no-cyrillic-string',
    '@tanstack/query',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/array-type': [ 'error', {
      'default': 'generic',
      readonly: 'generic',
    } ],
    '@typescript-eslint/brace-style': [ 'error', '1tbs' ],
    '@typescript-eslint/consistent-type-imports': [ 'error' ],
    '@typescript-eslint/indent': [ 'error', 2 ],
    '@typescript-eslint/member-delimiter-style': [ 'error' ],
    '@typescript-eslint/naming-convention': [ 'error',
      {
        selector: 'default',
        format: [ 'camelCase' ],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'forbid',
      },
      {
        selector: 'class',
        format: [ 'PascalCase' ],
      },
      {
        selector: 'enum',
        format: [ 'PascalCase', 'UPPER_CASE' ],
      },
      {
        selector: 'enumMember',
        format: [ 'camelCase', 'PascalCase', 'UPPER_CASE' ],
      },
      {
        selector: 'function',
        format: [ 'camelCase', 'PascalCase' ],
      },
      {
        selector: 'interface',
        format: [ 'PascalCase' ],
      },
      {
        selector: 'method',
        format: [ 'camelCase', 'snake_case', 'UPPER_CASE' ],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'parameter',
        format: [ 'camelCase', 'PascalCase' ],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'property',
        format: null,
      },
      {
        selector: 'typeAlias',
        format: [ 'PascalCase' ],
      },
      {
        selector: 'typeParameter',
        format: [ 'PascalCase', 'UPPER_CASE' ],
      },
      {
        selector: 'variable',
        format: [ 'camelCase', 'PascalCase', 'UPPER_CASE' ],
        leadingUnderscore: 'allow',
      },
    ],
    '@typescript-eslint/no-duplicate-imports': [ 'error' ],
    '@typescript-eslint/no-empty-function': [ 'off' ],
    '@typescript-eslint/no-unused-vars': [ 'error', { ignoreRestSiblings: true } ],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-useless-constructor': [ 'error' ],
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/no-explicit-any': [ 'error', { ignoreRestArgs: true } ],

    // disabled in favor of @typescript-eslint
    'brace-style': 'off',
    camelcase: 'off',
    indent: 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    'no-useless-constructor': 'off',

    'array-bracket-spacing': [ 'error', 'always' ],
    'arrow-spacing': [ 'error', { before: true, after: true } ],
    'comma-dangle': [ 'error', 'always-multiline' ],
    'comma-spacing': [ 'error' ],
    'comma-style': [ 'error', 'last' ],
    curly: [ 'error', 'all' ],
    'eol-last': 'error',
    eqeqeq: [ 'error', 'allow-null' ],
    'id-match': [ 'error', '^[\\w$]+$' ],
    'jsx-quotes': [ 'error', 'prefer-double' ],
    'key-spacing': [ 'error', {
      beforeColon: false,
      afterColon: true,
    } ],
    'keyword-spacing': 'error',
    'linebreak-style': [ 'error', 'unix' ],
    'lines-around-comment': [ 'error', {
      beforeBlockComment: true,
      allowBlockStart: true,
    } ],
    'max-len': [ 'error', 160, 4 ],
    'no-console': 'error',
    'no-empty': [ 'error', { allowEmptyCatch: true } ],
    'no-implicit-coercion': [ 'error', {
      number: true,
      'boolean': true,
      string: true,
    } ],
    'no-mixed-operators': [ 'error', {
      groups: [
        [ '&&', '||' ],
      ],
    } ],
    'no-mixed-spaces-and-tabs': 'error',
    'no-multiple-empty-lines': [ 'error', {
      max: 1,
      maxEOF: 0,
      maxBOF: 0,
    } ],
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-nested-ternary': 'error',
    'no-trailing-spaces': 'error',
    'no-spaced-func': 'error',
    'no-with': 'error',
    'object-curly-spacing': [ 'error', 'always' ],
    'object-shorthand': 'off',
    'one-var': [ 'error', 'never' ],
    'operator-linebreak': [ 'error', 'after' ],
    'prefer-const': 'error',
    'quote-props': [ 'error', 'as-needed', {
      keywords: true,
      numbers: true,
    } ],
    quotes: [ 'error', 'single', {
      allowTemplateLiterals: true,
    } ],
    'space-before-function-paren': [ 'error', 'never' ],
    'space-before-blocks': [ 'error', 'always' ],
    'space-in-parens': [ 'error', 'never' ],
    'space-infix-ops': 'error',
    'space-unary-ops': 'off',
    'template-curly-spacing': [ 'error', 'always' ],
    'wrap-iife': [ 'error', 'inside' ],
    semi: [ 'error', 'always' ],

    'import-helpers/order-imports': [
      'error',
      {
        newlinesBetween: 'always',
        groups: [
          'module',
          '/types/',
          [
            '/^nextjs/',
          ],
          [
            '/^configs/',
            '/^data/',
            '/^deploy/',
            '/^icons/',
            '/^jest/',
            '/^lib/',
            '/^mocks/',
            '/^pages/',
            '/^playwright/',
            '/^stubs/',
            '/^theme/',
            '/^ui/',
          ],
          [ 'parent', 'sibling', 'index' ],
        ],
        alphabetize: { order: 'asc', ignoreCase: true },
      },
    ],

    'no-restricted-imports': [ 'error', RESTRICTED_MODULES ],
    'no-restricted-properties': [ 2, {
      object: 'process',
      property: 'env',
      // FIXME: restrict the rule only NEXT_PUBLIC variables
      message: 'Please use configs/app/index.ts to import any NEXT_PUBLIC environment variables. For other properties please disable this rule for a while.',
    } ],

    'react/jsx-key': 'error',
    'react/jsx-no-bind': [ 'error', {
      ignoreRefs: true,
    } ],
    'react/jsx-curly-brace-presence': [ 'error', {
      props: 'never',
      children: 'never',
    } ],
    'react/jsx-curly-spacing': [ 'error', {
      when: 'always',
      children: true,
      spacing: {
        objectLiterals: 'never',
      },
    } ],
    'react/jsx-equals-spacing': [ 'error', 'never' ],
    'react/jsx-fragments': [ 'error', 'syntax' ],
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-target-blank': 'off',
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-tag-spacing': [ 'error', {
      afterOpening: 'never',
      beforeSelfClosing: 'never',
      closingSlash: 'never',
    } ],
    'react/jsx-wrap-multilines': [ 'error', {
      declaration: 'parens-new-line',
      assignment: 'parens-new-line',
      'return': 'parens-new-line',
      arrow: 'parens-new-line',
      condition: 'parens-new-line',
      logical: 'parens-new-line',
      prop: 'parens-new-line',
    } ],
    'react/no-access-state-in-setstate': 'error',
    'react/no-deprecated': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-find-dom-node': 'off',
    'react/no-redundant-should-component-update': 'error',
    'react/no-render-return-value': 'error',
    'react/no-string-refs': 'off',
    'react/no-unknown-property': 'error',
    'react/no-unused-state': 'error',
    'react/require-optimization': [ 'error' ],
    'react/void-dom-elements-no-children': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    'regexp/confusing-quantifier': 'error',
    'regexp/control-character-escape': 'error',
    'regexp/negation': 'error',
    'regexp/no-dupe-disjunctions': 'error',
    'regexp/no-empty-alternative': 'error',
    'regexp/no-empty-capturing-group': 'error',
    'regexp/no-lazy-ends': 'error',
    'regexp/no-obscure-range': [ 'error', {
      allowed: [ 'alphanumeric' ],
    } ],
    'regexp/no-optional-assertion': 'error',
    'regexp/no-unused-capturing-group': [ 'error', {
      fixable: true,
    } ],
    'regexp/no-useless-character-class': 'error',
    'regexp/no-useless-dollar-replacements': 'error',

    'no-cyrillic-string/no-cyrillic-string': 'error',
  },
  overrides: [
    {
      files: [ '*.js', '*.jsx' ],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: [
        '*.config.ts',
        '*.config.js',
        'playwright/**',
        'deploy/tools/**',
        'middleware.ts',
        'nextjs/**',
        'instrumentation*.ts',
      ],
      rules: {
        // for configs allow to consume env variables from process.env directly
        'no-restricted-properties': [ 0 ],
      },
    },
  ],
};
