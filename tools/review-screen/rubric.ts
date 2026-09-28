import type { EntryType } from '@typesafe-ai/sdk';

export interface Rule {
  readonly id: string;
  readonly cites: string;
  readonly glob: string;
  readonly question: string;
  readonly examples: EntryType;
  readonly not_for: EntryType;
}

export const MIN_RULES = 8;
export const MAX_RULES = 10;

export const RULES: ReadonlyArray<Rule> = [
  {
    id: 'explanatory-comment',
    cites: '.agents/rules/code-quality.md',
    glob: '**/*.{ts,tsx}',
    question: 'Does the changed code add a comment that describes what the code does instead of why the obvious approach fails?',
    examples: [
      'a comment that restates the line below it ("memoize the filtered list")',
      'a JSDoc block that repeats the function name, its parameter names or its types',
      'diff narration: what the change replaced ("replaces the old useEffect", "previously this used X")',
      'commented-out code',
      'a TODO with no issue link and no concrete follow-up',
      'a section banner ("// helpers", "// types")',
    ],
    not_for: [
      'a comment explaining a quirk, workaround or invariant the code cannot show, optionally with an issue link',
      'the reason on an eslint-disable, on a double cast, or on a raw color value',
      'a `TODO (design):` or `TODO (api-data):` scaffold marker',
      'an SPDX license header',
      'a comment that was already present and is only moved or reindented',
    ],
  },
  {
    id: 'magic-number',
    cites: '.agents/rules/code-quality.md',
    glob: 'src/**/*.{ts,tsx}',
    question: 'Does the changed code use a bare literal for a limit, threshold, interval, size or key whose meaning a reader would still have to ask about?',
    examples: [
      'items.slice(0, 4) where 4 is a product limit',
      'setTimeout(handler, 5000) or refetchInterval: 2_000 instead of SECOND / MINUTE from src/toolkit/utils/consts',
      'if (list.length > 20) with no name for 20',
      'a local unit constant such as MS_IN_SECOND = 1_000',
      'a repeated string discriminator or storage key spelled out at several call sites',
    ],
    not_for: [
      '1 as the first page, 0 as the first index, -1 from indexOf',
      'a URL, a route path, a file name, a label string',
      'CSS-style props: margin, padding, gap, width, font weight, color, border radius, z-index',
      'values inside a *.spec.ts / *.spec.tsx / *.pw.tsx file or a mock',
      'a literal assigned to an UPPER_SNAKE_CASE constant above the component or function',
      'a constant that only restates the value it names (FIRST_PAGE = 1)',
    ],
  },
  {
    id: 'inline-empty-default',
    cites: '.agents/rules/code-quality.md',
    glob: 'src/**/*.{ts,tsx}',
    question: 'Does the changed code create an empty array or object literal inline as a fallback or default value inside a component or hook body?',
    examples: [
      'const items = data?.items ?? [];',
      'const filters = props.filters || {};',
      'function List({ items = [] }: Props)',
      'useQuery({ ... , placeholderData: [] })',
    ],
    not_for: [
      'a module-level constant such as const EMPTY_ITEMS: Array<Item> = []; used as the fallback',
      'useState([]) or useState({}) initial values',
      'an empty literal used once as a local accumulator (reduce, push) and never passed on',
      'code outside a React component or hook: utils, config modules, server code, tests',
    ],
  },
  {
    id: 'derived-array-without-memo',
    cites: '.agents/rules/code-quality.md',
    glob: 'src/**/*.tsx',
    question: 'Does the changed code pass a .filter(), .map() or .reduce() result computed during render as a prop or hook dependency without useMemo?',
    examples: [
      'const filtered = items.filter(isActive); return <List items={ filtered }/>;',
      '<Select options={ tokens.map(toOption) }/>',
      'useEffect(() => { ... }, [ items.map(getId) ]);',
    ],
    not_for: [
      '.map() used directly in JSX to render children',
      'a derived array used only inside the same render body and never passed to a child or a hook',
      'a derived array already wrapped in useMemo or computed in a custom hook that memoizes it',
      'derived arrays computed outside a component or hook',
    ],
  },
  {
    id: 'route-string-concat',
    cites: '.agents/rules/code-quality.md',
    glob: 'src/**/*.{ts,tsx}',
    question: 'Does the changed code build a link to an application page from a string literal, concatenation or template instead of the route utilities?',
    examples: [
      'href={ `/tx/${ hash }` }',
      'router.push(\'/address/\' + address)',
      '<Link href="/blocks">',
    ],
    not_for: [
      'route({ pathname: \'/tx/[hash]\', query: { hash } }) from src/shared/router/routes',
      'a URL to an external site or to another Blockscout instance',
      'an API path template in src/api/resources or a fetch URL',
      'a pathname compared or matched in server code (middleware, rewrites, CSP)',
      'a URL inside a *.spec.ts / *.spec.tsx / *.pw.tsx file or a mock',
    ],
  },
  {
    id: 'raw-style-value',
    cites: '.agents/rules/design-system.md',
    glob: 'src/**/*.tsx',
    question: 'Does the changed JSX set a style prop to a raw CSS value where the design system defines a token for that property?',
    examples: [
      'color="#1a1a1a", bg="rgb(0, 0, 0)", borderColor="hsl(...)"',
      'fontSize="14px" or lineHeight="20px" instead of textStyle="sm"',
      'borderRadius="12px" instead of borderRadius="md"',
      'fontWeight={ 600 } instead of fontWeight="semibold"',
      'zIndex={ 1000 } instead of zIndex="modal"',
      'boxShadow="0 2px 4px rgba(...)" instead of boxShadow="size.md"',
    ],
    not_for: [
      'a token reference: text.secondary, blue.50, github, textStyle="heading.md", borderRadius="lg"',
      'width, height, padding, margin, gap or position values, which have no token table',
      'a raw color value with a comment explaining the third-party embed that requires it',
      'files under src/toolkit/theme/ that define the tokens',
      'CSS overrides for a third-party widget that does not read the theme',
    ],
  },
  {
    id: 'inline-date-format',
    cites: '.agents/rules/code-quality.md',
    glob: 'src/**/*.tsx',
    question: 'Does the changed code format a date or timestamp for display without the shared Time or TimeWithTooltip component?',
    examples: [
      'dayjs(timestamp).format(\'lll\') rendered straight into JSX',
      'new Date(timestamp).toLocaleString() or toLocaleDateString() in a component',
      'dayjs(timestamp).fromNow() as a component\'s own text',
    ],
    not_for: [
      '<Time timestamp={ ... }/> or <TimeWithTooltip timestamp={ ... }/> from src/shared/date-and-time',
      'dayjs used for arithmetic, comparison or parsing, with no formatted string shown to the user',
      'the source of the Time components themselves under src/shared/date-and-time/',
      'a chart axis or tooltip formatter, a CSV export cell, or a <time dateTime> attribute',
    ],
  },
  {
    id: 'compound-part-spacing',
    cites: '.agents/rules/design-system.md',
    glob: 'src/**/*.tsx',
    question: 'Does the changed JSX set padding or margin on an internal part of a compound component from src/toolkit/chakra?',
    examples: [
      '<DialogHeader px={ 6 }> or <DialogBody pt={ 0 }>',
      '<MenuItem py={ 2 }> or <MenuContent p={ 4 }>',
      '<TabsTrigger px={ 3 }> or <PopoverContent p={ 2 }>',
    ],
    not_for: [
      'spacing on the root of a compound component (DialogRoot, MenuRoot, TabsRoot) or on its trigger',
      'spacing on a layout primitive: Box, Flex, Grid, Stack, HStack, VStack',
      'spacing on a plain child placed inside a compound part',
      'the toolkit files under src/toolkit/ that define the compound components',
    ],
  },
  {
    id: 'rule-without-mechanism',
    cites: '.agents/skills/review-changes/prose-smells.md',
    glob: '.agents/**/*.md',
    question: 'Does the changed instruction text state something an agent must ensure without giving the command, file or probe that establishes it?',
    examples: [
      '"check whether a PR already exists" with no gh command',
      '"make sure the tests pass" with no test command named',
      '"verify the component matches the mockup" with no Figma node or fixture named',
      '"confirm the endpoint is available" with no URL, skill or curl given',
    ],
    not_for: [
      'a statement that points at the skill, file or section that holds the mechanism',
      'a fact, a definition, a rationale or a description of context',
      'a step that names the command, the file to read, or the ordered checks to run',
      'a `[human]` step that a developer does by hand',
      'a spec or ticket file under .agents/tasks/',
    ],
  },
  {
    id: 'code-restating-doc',
    cites: '.agents/rules/docs.md',
    glob: '{**/CONTEXT.md,docs/**/*.md,**/README.md}',
    question: 'Does the changed documentation text describe what the code does in a way a reader gets by opening the file?',
    examples: [
      'a walk-through of control flow: "X runs Y, then Z parses the result and maps it onto W"',
      'a list of a function\'s parameters, props or return type',
      'a restated package.json script or --help output',
      'a directory listing that the file system already gives',
      'a description of what the change replaced',
    ],
    not_for: [
      'navigation: which directory or file to open for what',
      'a constraint an editor must keep true, and what breaks if they do not',
      'a gotcha: the surprise and its consequence, not the mechanism',
      'local vocabulary a term means only in this area',
      'a pointer or link to an ADR, a rule file or another doc',
      'a README of a published package that documents a public API for its consumers',
    ],
  },
];
