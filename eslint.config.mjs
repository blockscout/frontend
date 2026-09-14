import { includeIgnoreFile } from '@eslint/compat';
import jsPlugin from '@eslint/js';
import nextJsPlugin from '@next/eslint-plugin-next';
import stylisticPlugin from '@stylistic/eslint-plugin';
import reactQueryPlugin from '@tanstack/eslint-plugin-query';
import boundariesPlugin from 'eslint-plugin-boundaries';
import consistentDefaultExportNamePlugin from 'eslint-plugin-consistent-default-export-name';
import importPlugin from 'eslint-plugin-import';
import importHelpersPlugin from 'eslint-plugin-import-helpers';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import playwrightPlugin from 'eslint-plugin-playwright';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import * as regexpPlugin from 'eslint-plugin-regexp';
import vitestPlugin from 'eslint-plugin-vitest';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tseslint from 'typescript-eslint';

import { strykerDisableRule } from './tools/mutation-testing/eslint/well-formed-disable.mjs';

const SPDX_HEADER = '// SPDX-License-Identifier: LicenseRef-Blockscout';

const spdxLicenseRule = {
  meta: {
    type: 'layout',
    fixable: 'code',
    messages: { missing: `File must start with: ${ SPDX_HEADER }` },
    schema: [],
  },
  create(context) {
    return {
      Program() {
        const src = context.sourceCode.getText();
        if (src.startsWith(SPDX_HEADER + '\n')) {
          return;
        }
        context.report({
          loc: { line: 1, column: 0 },
          messageId: 'missing',
          fix: (fixer) => fixer.replaceTextRange([ 0, 0 ], SPDX_HEADER + '\n\n'),
        });
      },
    };
  },
};

const RESTRICTED_MODULES = {
  paths: [
    { name: 'dayjs', message: 'Please use src/shared/date-and-time/dayjs.ts instead of directly importing dayjs' },
    {
      name: '@chakra-ui/icons',
      message: 'Using @chakra-ui/icons is prohibited. Please use regular svg-icon instead (see examples in "src/sprite/icons/" folder)',
    },
    { name: '@metamask/providers', message: 'Please lazy-load @metamask/providers or use useProvider hook instead' },
    { name: '@metamask/post-message-stream', message: 'Please lazy-load @metamask/post-message-stream or use useProvider hook instead' },
    { name: 'playwright/TestApp', message: 'Please use render() fixture from test() function of playwright/lib module' },
    {
      name: '@chakra-ui/react',
      importNames: [
        'Menu', 'useToast', 'useDisclosure', 'useClipboard', 'Tooltip', 'Skeleton', 'IconButton', 'Button', 'ButtonGroup', 'Link', 'LinkBox', 'LinkOverlay',
        'Dialog', 'DialogRoot', 'DialogContent', 'DialogHeader', 'DialogCloseTrigger', 'DialogBody',
        'Tag', 'Switch', 'Image', 'Popover', 'PopoverTrigger', 'PopoverContent', 'PopoverBody', 'PopoverFooter',
        'DrawerRoot', 'DrawerBody', 'DrawerContent', 'DrawerOverlay', 'DrawerBackdrop', 'DrawerTrigger', 'Drawer',
        'Alert', 'AlertIcon', 'AlertTitle', 'AlertDescription',
        'Select', 'SelectRoot', 'SelectControl', 'SelectContent', 'SelectItem', 'SelectValueText',
        'Heading', 'Badge', 'Tabs', 'Show', 'Hide', 'Checkbox', 'CheckboxGroup',
        'Table', 'TableRoot', 'TableBody', 'TableHeader', 'TableRow', 'TableCell',
        'Menu', 'MenuRoot', 'MenuTrigger', 'MenuContent', 'MenuItem', 'MenuTriggerItem', 'MenuCheckboxItem', 'MenuRadioItem', 'MenuRadioItemGroup',
        'MenuContextTrigger',
        'Rating', 'RatingGroup', 'Textarea', 'Progress', 'ProgressCircle',
        'EmptyState',
      ],
      message: 'Please use corresponding component or hook from "src/toolkit" instead',
    },
    {
      name: 'next/link',
      importNames: [ 'default' ],
      message: 'Please use toolkit/chakra/link component instead',
    },
  ],
  patterns: [
    'src/sprite/icons/*',
  ],
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

/** @see src/ARCH_REDESIGN.md §8 — dependency layers for migrated code */
const ARCH_BOUNDARY_ELEMENTS = [
  { type: 'src-api', pattern: 'src/api/**', mode: 'full' },
  { type: 'src-slices', pattern: 'src/slices/**', mode: 'full' },
  { type: 'src-features', pattern: 'src/features/**', mode: 'full' },
];

/*
 * App config convention (src/config/CONTEXT.md) — the modules the root aggregator assembles.
 * `types/config.ts` and `mocks/config.ts` are companions, not config modules, and stay out.
 */
const APP_CONFIG_MODULE_GLOBS = [
  'src/api/config.ts',
  'src/features/**/config.ts',
  'src/services/*/config.ts',
  'src/shell/*/config.ts',
  'src/slices/*/config.ts',
];
const APP_CONFIG_COMPANION_GLOBS = [ '**/types/config.ts', '**/mocks/config.ts' ];

const APP_CONFIG_ELEMENTS = [
  { type: 'app-config-envs', pattern: 'src/config/utils/envs.ts', mode: 'full' },
  { type: 'app-config-root', pattern: 'src/config/**', mode: 'full' },
  { type: 'app-config-module', pattern: APP_CONFIG_MODULE_GLOBS.map((glob) => glob.replace('**/config.ts', '**/!(types|mocks)/config.ts')), mode: 'full' },
  { type: 'app-config-spec', pattern: 'src/**/config.spec.ts', mode: 'full' },
];

const APP_CONFIG_IMPORT_MESSAGE =
  'Read app config through the root aggregator: `import config from \'src/config\'`. ' +
  'Only another config.ts, src/config/** or a config.spec.ts may import a config module directly.';

const APP_CONFIG_ENVS_MESSAGE =
  'Env values are read only in config modules. Move the getEnvValue / parseEnvJson / getExternalAssetFilePath call into the owning config.ts ' +
  'and read the structured result via src/config.';

const APP_CONFIG_NAMED_EXPORT_MESSAGE =
  'A config module exposes only its default export. Put the value inside the config object (widen the Feature payload) ' +
  'so it is unreachable while the feature is disabled; types and constants go to a sibling role file (types/config.ts, types.ts, consts.ts).';

// app config convention (src/config/CONTEXT.md): the raw runtime env map is read by getEnvValue only
const WINDOW_ENVS_RESTRICTION = {
  object: 'window',
  property: '__envs',
  message: APP_CONFIG_ENVS_MESSAGE,
};

const RESTRICTED_SYNTAX = [
  {
    selector: 'CallExpression[callee.property.name=\'localeCompare\']',
    message: 'Use the shared collator from src/shared/texts/collator.ts (collator.compare) instead of String.prototype.localeCompare.',
  },
  {
    selector: 'NewExpression[callee.object.name=\'Intl\'][callee.property.name=\'Collator\']',
    message: 'Use the shared collator from src/shared/texts/collator.ts instead of constructing Intl.Collator inline.',
  },
];

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  includeIgnoreFile(gitignorePath),

  { files: [ '**/*.{js,mjs,cjs,ts,mts,jsx,tsx}', '**/*.pw.tsx' ] },

  { ignores: [
    'deploy/tools/',
    'public/',
    '.git/',
    // agent worktrees are full checkouts of the repo; linting them doubles the work and can exhaust the heap
    '.claude/worktrees/',
    'next.config.js',
    'tools/code-complexity/dist/',
  ] },

  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },

  {
    settings: {
      react: { version: 'detect' },
      // first matching descriptor wins, so the file-level config elements go before the layer-level ones;
      // the trailing catch-all makes every src file a known element — policies never run from unknown files
      'boundaries/elements': [ ...APP_CONFIG_ELEMENTS, ...ARCH_BOUNDARY_ELEMENTS, { type: 'src-other', pattern: 'src/**', mode: 'full' } ],
      'boundaries/dependency-nodes': [ 'import', 'dynamic-import', 'export' ],
      // without a resolver every import target is "unknown" and no boundaries policy ever matches;
      // `paths` makes the tsconfig-style root-relative specifiers (src/…, playwright/…) resolvable
      'import/resolver': {
        node: {
          extensions: [ '.ts', '.tsx', '.js', '.mjs' ],
          paths: [ __dirname ],
        },
      },
    },
  },

  jsPlugin.configs.recommended,

  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/array-type': [ 'error', {
        'default': 'generic',
        readonly: 'generic',
      } ],
      '@typescript-eslint/consistent-type-imports': [ 'error' ],
      '@typescript-eslint/naming-convention': [ 'error',
        {
          selector: 'default',
          format: [ 'camelCase' ],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'forbid',
        },
        {
          selector: 'import',
          leadingUnderscore: 'allow',
          format: [ 'camelCase', 'PascalCase' ],
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
          selector: 'typeLike',
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
      '@typescript-eslint/no-empty-function': [ 'off' ],
      '@typescript-eslint/no-unused-vars': [ 'error', { caughtErrors: 'none', ignoreRestSiblings: true } ],
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-useless-constructor': [ 'error' ],
      '@typescript-eslint/no-explicit-any': [ 'error', { ignoreRestArgs: true } ],
      '@typescript-eslint/no-unused-expressions': [ 'error', {
        allowShortCircuit: true,
        allowTernary: true,
      } ],
    },
  },
  {
    // disable type-aware linting on JS files
    files: [ '**/*.{js,mjs}' ],
    ...tseslint.configs.disableTypeChecked,
  },

  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
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
      'react/jsx-filename-extension': [ 'error', { allow: 'as-needed', extensions: [ '.tsx' ] } ],
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
    },
  },

  {
    plugins: {
      '@next/next': nextJsPlugin,
    },
    rules: {
      ...nextJsPlugin.configs.recommended.rules,
      ...nextJsPlugin.configs['core-web-vitals'].rules,
    },
  },

  {
    plugins: { '@tanstack/query': reactQueryPlugin },
  },

  {
    ...playwrightPlugin.configs['flat/recommended'],
    files: [ '**/*.pw.tsx' ],
    rules: {
      ...playwrightPlugin.configs['flat/recommended'].rules,
      'playwright/no-standalone-expect': 'off', // this rules does not work correctly with extended test functions
    },
  },

  {
    plugins: { 'react-hooks': reactHooksPlugin },
    ignores: [ '**/*.pw.tsx', 'playwright/**' ],
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },

  {
    files: [ '**/*.spec.{ts,js,jsx,tsx}' ],
    plugins: { vitest: vitestPlugin },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitestPlugin.environments.env.globals,
        fetchMock: true,
      },
    },
  },

  regexpPlugin.configs['flat/recommended'],

  {
    plugins: {
      'import': importPlugin,
    },
    rules: {
      'import/no-duplicates': 'error',
    },
  },

  // I have to disable this rule because of performance issues:
  //    https://github.com/import-js/eslint-plugin-import/issues/3060
  // Examples in our CI:
  //    before: 1m15s - https://github.com/blockscout/frontend/actions/runs/23210591334/job/67457992864
  //    after: 4m27s - https://github.com/blockscout/frontend/actions/runs/25108323146/job/73585871924
  //
  // {
  //   files: [ 'src/**' ],
  //   plugins: {
  //     'import': importPlugin,
  //   },
  //   rules: {
  //     'import/no-cycle': [ 'error', { maxDepth: 10 } ],
  //   },
  // },

  /*
   * ARCH_REDESIGN.md §6 — two hard boundaries enforced as ESLint errors.
   */
  {
    files: [
      'src/**/*.{ts,tsx}',
    ],
    plugins: {
      boundaries: boundariesPlugin,
    },
    rules: {
      'boundaries/element-types': [ 'error', {
        'default': 'allow',
        rules: [
          {
            // by path, not by element type: `src/api/config.ts` is an `app-config-module` element (a file
            // is one element only), and the layer policy still applies to it
            from: { path: 'src/api/**' },
            disallow: { to: { type: [ 'src-slices', 'src-features' ] }, dependency: { kind: 'value' } },
          },
        ],
      } ],
    },
  },

  /*
   * App config convention (src/config/CONTEXT.md): the root aggregator is the only import surface for
   * config modules, and env values are read only inside them. Later policies override earlier ones.
   */
  {
    files: [
      'src/**/*.{ts,tsx}',
    ],
    plugins: {
      boundaries: boundariesPlugin,
    },
    rules: {
      'boundaries/dependencies': [ 'error', {
        'default': 'allow',
        rules: [
          {
            disallow: { to: { type: 'app-config-module' }, dependency: { kind: 'value' } },
            message: APP_CONFIG_IMPORT_MESSAGE,
          },
          {
            from: { type: [ 'app-config-module', 'app-config-root', 'app-config-spec' ] },
            allow: { to: { type: 'app-config-module' } },
          },
          {
            disallow: { to: { type: 'app-config-envs' } },
            message: APP_CONFIG_ENVS_MESSAGE,
          },
          {
            from: { type: [ 'app-config-module', 'app-config-root' ] },
            allow: { to: { type: 'app-config-envs' } },
          },
        ],
      } ],
    },
  },

  {
    plugins: {
      'import-helpers': importHelpersPlugin,
    },
    rules: {
      'import-helpers/order-imports': [
        'error',
        {
          newlinesBetween: 'always',
          groups: [
            'module',
            '/types/',
            [ '/^src/server/' ],
            [ '/^src/api/' ],
            [ '/^src/shell/' ],
            [ '/^src/slices/' ],
            [ '/^src/features/' ],
            [ '/^src/config/', '/^src/services/', '/^src/shared/', '/^src/sprite/' ],
            [ '/^src/toolkit/' ],
            [
              '/^deploy/',
              '/^playwright/',
              '/^vitest/',
            ],
            [ 'parent', 'sibling', 'index' ],
          ],
          alphabetize: { order: 'asc', ignoreCase: true },
        },
      ],
    },
  },

  {
    plugins: {
      'jsx-a11y': jsxA11yPlugin,
    },
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
  },

  {
    plugins: {
      'consistent-default-export-name': consistentDefaultExportNamePlugin,
    },
    files: [
      'src/**/*.tsx',
    ],
    ignores: [
      '**/*.pw.*',
      '**/*.pwstory.*',
      '**/pages/**',
    ],
    rules: {
      'consistent-default-export-name/default-export-match-filename': [ 'error', null ],
    },
  },

  {
    plugins: {
      '@stylistic': stylisticPlugin,
    },
    rules: {
      // replacement for @typescript-eslint
      '@stylistic/indent': [ 'error', 2 ],
      '@stylistic/brace-style': [ 'error', '1tbs' ],
      '@stylistic/member-delimiter-style': [ 'error' ],
      '@stylistic/type-annotation-spacing': 'error',

      // replacement for eslint
      '@stylistic/array-bracket-spacing': [ 'error', 'always' ],
      '@stylistic/arrow-spacing': [ 'error', { before: true, after: true } ],
      '@stylistic/comma-dangle': [ 'error', 'always-multiline' ],
      '@stylistic/comma-spacing': [ 'error' ],
      '@stylistic/comma-style': [ 'error', 'last' ],
      '@stylistic/curly-newline': [ 'error', { multiline: true, minElements: 1 } ],
      '@stylistic/eol-last': 'error',
      '@stylistic/jsx-quotes': [ 'error', 'prefer-double' ],
      '@stylistic/key-spacing': [ 'error', {
        beforeColon: false,
        afterColon: true,
      } ],
      '@stylistic/keyword-spacing': 'error',
      '@stylistic/linebreak-style': [ 'error', 'unix' ],
      '@stylistic/lines-around-comment': [ 'error', {
        beforeBlockComment: true,
        allowBlockStart: true,
      } ],
      '@stylistic/no-mixed-operators': [ 'error', {
        groups: [
          [ '&&', '||' ],
        ],
      } ],
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/no-multiple-empty-lines': [ 'error', {
        max: 1,
        maxEOF: 0,
        maxBOF: 0,
      } ],
      '@stylistic/no-multi-spaces': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/object-curly-spacing': [ 'error', 'always' ],
      '@stylistic/operator-linebreak': [ 'error', 'after' ],
      '@stylistic/quote-props': [ 'error', 'as-needed', {
        keywords: true,
        numbers: true,
      } ],
      '@stylistic/quotes': [ 'error', 'single', {
        allowTemplateLiterals: 'always',
      } ],
      '@stylistic/semi': [ 'error', 'always' ],
      '@stylistic/space-before-function-paren': [ 'error', { anonymous: 'never', named: 'never', asyncArrow: 'never', 'catch': 'always' } ],
      '@stylistic/space-before-blocks': [ 'error', 'always' ],
      '@stylistic/space-in-parens': [ 'error', 'never' ],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': 'off',
      '@stylistic/template-curly-spacing': [ 'error', 'always' ],
      '@stylistic/wrap-iife': [ 'error', 'inside' ],
    },
    ignores: [
      'next-env.d.ts',
    ],
  },

  {
    rules: {
      // disabled in favor of @typescript-eslint and @stylistic
      'no-use-before-define': 'off',
      'no-useless-constructor': 'off',
      'no-unused-vars': 'off',
      'no-empty': [ 'error', { allowEmptyCatch: true } ],
      'no-unused-expressions': 'off',

      // this is checked by typescript compiler
      'no-redeclare': 'off',

      // rules customizations
      eqeqeq: [ 'error' ],
      'id-match': [ 'error', '^[\\w$]+$' ],
      'max-len': [ 'error', 160, 4 ],
      'no-console': 'error',
      'no-implicit-coercion': [ 'error', {
        number: true,
        'boolean': true,
        string: true,
      } ],
      'no-nested-ternary': 'error',
      'no-multi-str': 'error',
      'no-spaced-func': 'error',
      'no-with': 'error',
      'object-shorthand': 'off',
      'one-var': [ 'error', 'never' ],
      'prefer-const': 'error',

      // restricted imports, properties and syntax
      'no-restricted-syntax': [ 'error', ...RESTRICTED_SYNTAX ],
      'no-restricted-imports': [ 'error', RESTRICTED_MODULES ],
      'no-restricted-properties': [ 2,
        {
          object: 'process',
          property: 'env',
          // FIXME: restrict the rule only NEXT_PUBLIC variables
          message: 'Please use src/config/index.ts to import any NEXT_PUBLIC environment variables. For other properties please disable this rule for a while.',
        },
        WINDOW_ENVS_RESTRICTION,
      ],
    },
  },
  {
    files: [
      'src/pages/**',
      'src/server/**',
      'playwright/**',
      'deploy/scripts/**',
      'deploy/tools/**',
      'proxy.ts',
      'instrumentation*.ts',
      '*.config.ts',
      '*.config.js',
    ],
    rules: {
      // for configs allow to consume env variables from process.env directly; the raw browser env map stays off-limits
      'no-restricted-properties': [ 2, WINDOW_ENVS_RESTRICTION ],
    },
  },
  {
    // app config convention (src/config/CONTEXT.md): a config module has no export besides the default
    files: APP_CONFIG_MODULE_GLOBS,
    ignores: APP_CONFIG_COMPANION_GLOBS,
    rules: {
      'no-restricted-syntax': [ 'error',
        ...RESTRICTED_SYNTAX,
        { selector: 'ExportNamedDeclaration', message: APP_CONFIG_NAMED_EXPORT_MESSAGE },
        { selector: 'ExportAllDeclaration', message: APP_CONFIG_NAMED_EXPORT_MESSAGE },
      ],
    },
  },
  {
    files: [
      'src/toolkit/chakra/**',
      'src/toolkit/components/**',
      'src/toolkit/package/**',
    ],
    rules: {
      // for toolkit components allow to import @chakra-ui/react directly
      'no-restricted-imports': 'off',
    },
  },

  {
    plugins: { 'spdx-license': { rules: { header: spdxLicenseRule } } },
    files: [ '**/*.{ts,tsx,js}' ],
    ignores: [
      '**/*.d.ts',
      '**/*.pw.tsx',
      '**/*.spec.{ts,tsx}',
      '**/*.config.{ts,js}',
      '**.config.{ts,js}',
      '**/mocks/**',
      '**/mocks.ts',
      'playwright/**',
      '**/stubs/**',
      '**/stubs.ts',
      'vitest/**',
      'tools/**',
      '.agents/**',
    ],
    rules: {
      'spdx-license/header': 'error',
    },
  },

  {
    plugins: { stryker: { rules: { 'well-formed-disable': strykerDisableRule } } },
    files: [ '**/*.{ts,tsx,mjs,js,cjs}' ],
    rules: {
      'stryker/well-formed-disable': 'error',
    },
  },
);
