---
name: add-new-page
description: Scaffold a new page (index / detail / general) and optionally wire it to API data. Use when adding any new route to the app.
---

# Add a new page

This skill scaffolds the **page layout** from a per-type template and wires the page into every system that
must know about it (navigation, metadata, server guard, route types, analytics, sitemap).

**Two phases.** The **scaffold** phase (Steps 0–9) produces layout skeletons with clearly-marked `TODO`s. The
optional **data-wiring** phase (Step 10, procedure in `wiring.md`) then connects those skeletons to real API
resources and renders the data plainly — Step 0 decides whether it runs now or is deferred. Filtering,
sorting, search, socket live-updates, mocks, tests, and design polish are out of scope in both phases. If
wiring is deferred, the freshly-scaffolded page keeps its intentional `TODO`s and will not fully pass
`lint`/`tsc` until its data is wired — that is expected.

**TODO tags.** Every deferred piece of work is marked with a stage-tagged TODO so later stages can find their
worklist mechanically: **`TODO (api-data):`** — resolved by the data-wiring phase (`wiring.md`); grep for the
tag to find every spot. **`TODO (design):`** — content/representation decisions left for the design stage
(icons, field hints, uncertain value formatting); the wiring phase leaves these behind, never resolves them.
Keep the tags when scaffolding, and use them for any new deferred work you mark.

**Rule of thumb: never guess.** Whenever information is missing or required to proceed, **pause and ask the
user, or confirm your findings**, before writing files.

## Templates

Templates live in `.agents/skills/add-new-page/templates/`. Copy the set matching the page type, then
substitute the placeholders and delete any optional blocks you don't need:

| Placeholder | Meaning | Example |
|---|---|---|
| `__PageName__` | PascalCase component name | `Validators`, `ValidatorDetails` |
| `__area__` | `features` (config-gated) or `slices` (core) | `features` |
| `__featureName__` | folder name + `config.features` key | `validators` |
| `__pageDir__` | `index` (root page) or `details` (detail page) | `index` |
| `__route__` | the route path | `/validators` |
| `__pathname__` | the typed pathname (route, or with `[param]`) | `/validators/[id]` |
| `__title__` | `<PageTitle>` text | `Validators` |
| `__entityParam__` | dynamic-route param name (detail pages) | `id`, `hash` |
| `__gsspName__` | `getServerSideProps` export name in `main.ts` | `validators` |

Template sets:
- `templates/general/{Page,GeneralInfo}.tsx.tmpl` (`Page` = non-tabbed general page; `GeneralInfo` = a general-content body, used as a tab panel)
- `templates/detail/{Page,Details}.tsx.tmpl`
- `templates/index/{Page,Content,Table,TableItem,List,ListItem}.tsx.tmpl`
- `templates/tabs/PageWithTabs.tsx.tmpl` (tabbed page shell — `PageTitle` + `RoutedTabs`)
- `templates/route.tsx.tmpl` (shared route wrapper; has a commented dynamic-route variant)

A **page shell** is one of: a non-tabbed `Page.tsx.tmpl` (embeds a single content body) or the tabbed
`PageWithTabs.tsx.tmpl` (renders `RoutedTabs`). A **content body** is `Details` (detail), `Content` +
`Table`/`List`/items (index), or `GeneralInfo` (general). Tabbed pages combine one shell with one body per tab.

**Naming the destination files.** Drop the `.tmpl` extension and name each component file after the
component it exports — i.e. the `__PageName__`-prefixed name used in the template's `const` / `import`
statements. The base `Page.tsx.tmpl` is special: it becomes just `__PageName__.tsx` (no "Page" suffix). The
route wrapper is named after the route, not the component.

| Template | Destination (for `__PageName__` = `Validators`) |
|---|---|
| `general/Page.tsx.tmpl` | `__PageName__.tsx` → `Validators.tsx` |
| `detail/Page.tsx.tmpl` | `__PageName__.tsx` → `Validators.tsx` |
| `detail/Details.tsx.tmpl` | `__PageName__Details.tsx` → `ValidatorsDetails.tsx` |
| `index/Page.tsx.tmpl` | `__PageName__.tsx` → `Validators.tsx` |
| `index/Content.tsx.tmpl` | `__PageName__Content.tsx` → `ValidatorsContent.tsx` |
| `index/Table.tsx.tmpl` | `__PageName__Table.tsx` → `ValidatorsTable.tsx` |
| `index/TableItem.tsx.tmpl` | `__PageName__TableItem.tsx` → `ValidatorsTableItem.tsx` |
| `index/List.tsx.tmpl` | `__PageName__List.tsx` → `ValidatorsList.tsx` |
| `index/ListItem.tsx.tmpl` | `__PageName__ListItem.tsx` → `ValidatorsListItem.tsx` |
| `general/GeneralInfo.tsx.tmpl` | `__PageName__GeneralInfo.tsx` → `ValidatorsGeneralInfo.tsx` |
| `tabs/PageWithTabs.tsx.tmpl` | `__PageName__.tsx` → `Validators.tsx` |
| `route.tsx.tmpl` | `src/pages/__route__.tsx` → `src/pages/validators.tsx` |

**Tabbed pages — folders & per-tab names.** The page shell sits directly in the page dir; **each tab's body
components live in their own kebab-case sub-folder** under it (mirrors
`src/slices/tx/pages/details/{info,logs,state,…}`). Name a tab's components after the tab so same-type tabs
don't collide: replace the `__PageName__` base with `__PageName__<TabName>` (PascalCase tab name), and rename
the body's sub-components/imports to match. E.g. an `index`-type tab "Active" on page `Validators` → folder
`active/` holding `ValidatorsActive` (from `Content`), `ValidatorsActiveTable`, `ValidatorsActiveTableItem`,
`ValidatorsActiveList`, `ValidatorsActiveListItem`. A `detail`-type tab "Details" → folder `info/` holding
`ValidatorsDetails` (from `Details`). A `general`-type tab "Stats" → folder `stats/` holding `ValidatorsStats`
(from `GeneralInfo`).

**Details-tab rule:** a `details`-type tab either **comes first** (id `'index'`, title `Details`) **or doesn't
exist at all** — never place it after another tab.

## Step 0 — Agree on the shape (REQUIRED before writing anything)

Propose each of the following and **wait for the user's explicit approval**. Ask whenever an answer is not
obvious from the conversation or the codebase.

1. **Layout** — does the page have **tabs**? Decide this first; ask if it isn't obvious from the conversation.
   - **No tabs** → pick the single content type: `index` (list + table views), `detail` (label/value grid),
     or `general` (title + content).
   - **Tabs** → list the tabs **in order**; for each, give a **name** (the tab title) and a **content type**
     (`details` / `index` / `general info`). That's enough at this stage. **A `details` tab, if present, must
     be the first tab**.
2. **Route & path params** — the exact path. If it's **dynamic** (`/foo/[param]`), confirm the param
   name(s) and what each represents (`__entityParam__`, `__pathname__`).
3. **Gated or core?** — apply the architecture rule's test: *"Can this exist on a vanilla EVM chain with no
   feature flag?"* If yes → **core slice** (`__area__` = `slices`, no feature config/sitemap). If no →
   **config-gated feature** (`__area__` = `features`).
4. **Title** and **navigation placement** — the `<PageTitle>` text, the nav label, and which nav group it
   belongs to.
5. **Metadata** — **suggest** a default page title and description; let the user confirm or refine. Default
   only — do **not** add `enhanced` variants.
6. **Data — wire data now, or layout only?** If now, collect for **each content body** (per tab if tabbed):
   the API **service + endpoint path** that feeds it — given by the user, **never hunted for** (the
   `service:name` key if the resource is already declared) — and the **live instance** to sample data from
   (a `tools/dev-server/registry.json` alias or a full URL; a new endpoint may exist only on staging). If
   the endpoint isn't deployed anywhere yet, wiring is deferred — layout only. For each resource that
   doesn't exist yet, also run the **Step 0 interview of the `add-api-resource` skill** here (it adds the
   types-package-state question, among others) — after this step, no question should remain for the middle
   of the work.

Proceed only once these are settled.

## Step 1 — Feature & env variable (config-gated pages only)

Skip this step entirely for core slice pages.

The route's server guard (Step 3) depends on the feature flag, so the feature and its env variable must exist
**before** the route file. If the feature and its config already exist, proceed to the next step.

- **Invoke the `add-env-var` skill** to create the guarding env variable(s), the feature
  `src/features/__featureName__/config.ts`, and its registration in `src/config/features.ts`. That skill
  interviews the user about the new feature and its variable(s) — **all env-var questions happen there, not
  here.**
- `add-env-var` covers `docs/ENVS.md`, `config.ts`, `features.ts`, the validator schema, and CSP/assets. It
  does **not** create the server guard — that lives in Step 3.

## Step 2 — Scaffold the page component(s) (layout only)

Create the component folder, mirroring `src/slices/block/pages/{index,details}`. `__pageDir__` is `details`
for an entity/detail page (typically a dynamic route), otherwise `index`:

- `src/__area__/__featureName__/pages/__pageDir__/`

The **content bodies** are the same regardless of tabs — reference these exemplars while filling in real layout:

- **general** (`GeneralInfo.tsx`, or inline in a non-tabbed `general/Page.tsx`) — a content slot. Exemplar
  `src/features/gas-tracker/pages/index/GasTracker.tsx`.
- **detail** (`Details.tsx`) — a `DetailedInfo.Container` grid of `ItemLabel`/`ItemValue` rows wrapped in
  `Skeleton`. Exemplars `src/slices/block/pages/details/BlockDetails.tsx`; grid `src/shared/detailed-info/DetailedInfo.tsx`.
- **index** (`Content.tsx` + `Table`/`TableItem` + `List`/`ListItem`) — `Content.tsx` is `DataList` + dual
  view (`<Box hideFrom="lg">` mobile `List`, `<Box hideBelow="lg">` desktop `Table`); `Table`/`List` render
  one row per item via dedicated `TableItem`/`ListItem` components (mirroring `BlocksTableItem`/`BlocksListItem`).
  Exemplars `src/slices/block/pages/index/{BlocksContent,BlocksTable,BlocksTableItem,BlocksList,BlocksListItem}.tsx`;
  `src/shared/lists/DataList.tsx`.
  Replace the `DataList` placeholders with the page's entity (don't leave the generic "items"):
  set `emptyText` to a plural no-data sentence (`"There are no blocks."`) and `emptyStateProps={{ term: '<entity>' }}` to 
  the singular form (`'block'`).

Then branch on the Step 0 layout decision:

### A. No tabs

Use the single page shell that embeds its one content body directly:

- **general** → `general/Page.tsx.tmpl` (content inline; no separate body needed).
- **detail** → `detail/Page.tsx.tmpl` (reads the route param, renders `PageTitle` + `Details`) + `detail/Details.tsx.tmpl`.
- **index** → `index/Page.tsx.tmpl` (renders `PageTitle` + `Content`) + `index/{Content,Table,TableItem,List,ListItem}.tsx.tmpl`.

### B. With tabs

1. **Page shell** — copy `tabs/PageWithTabs.tsx.tmpl` (→ `__PageName__.tsx`, directly in the page dir). It
   renders `PageTitle` + `RoutedTabs`. Fill the `tabs` array with one `{ id, title, component }` entry per
   tab; the first tab's id is conventionally `'index'`. If a `details` tab exists it is the **first** entry
   (`id: 'index'`, title `Details`).
2. **One body per tab** — for each tab, create a kebab-case **sub-folder** under the page dir and scaffold a
   body there from the content template matching its type (`Details` / index `Content` + sub-components /
   `GeneralInfo`), **named after the tab** (`__PageName__<TabName>`, see the folders & naming rule above).
   Wire the renamed components into the shell's `tabs` array and imports.

Leave the `// TODO (api-data): …` markers in place — data fetching belongs to the wiring phase (Step 10).

## Step 3 — Route file + server guard

The guard and the route belong together: the route's `getServerSideProps` references the guard.

1. **Server guard** (config-gated pages) — in `src/server/getServerSideProps/guards.ts` add:
   ```ts
   export const __gsspName__: Guard = (chainConfig: typeof config) => async() => {
     if (!chainConfig.features.__featureName__.isEnabled) {
       return { notFound: true };
     }
   };
   ```
   For a **core slice** page, check `chainConfig.slices.__featureName__.isEnabled` instead. Then register the
   factory in `src/server/getServerSideProps/main.ts`:
   ```ts
   export const __gsspName__ = factory([ guards.__gsspName__ ]);
   ```
   An **un-gated** page needs no new guard — reuse `base` (or `notMultichain` for non-multichain pages) as
   `__gsspName__` and skip the guard creation.

2. **Route file** — create `src/pages/__route__.tsx` from `templates/route.tsx.tmpl`. For a dynamic route use
   the commented dynamic-route variant in the template (threads `query` through `PageNextJs`; exemplar
   `src/pages/tx/[hash].tsx`).

## Step 4 — Generate route types

Run **`pnpm run routes:generate`** (runs `nextjs-routes`) to regenerate `src/shared/router/nextjs-routes.d.ts`.
`__pathname__` only type-checks after this, so do it before the steps below.

## Step 5 — Navigation

In `src/shell/navigation/useNavItems.tsx` add a `NavItem` to the group agreed in Step 0:
```ts
const __featureName__: NavItem | null = config.features.__featureName__.isEnabled ? {
  text: '__title__',
  nextRoute: { pathname: '__route__' as const },
  // TODO (design): set nav icon
  isActive: pathname.startsWith('__route__'),
} : null;
```
For a core slice page drop the `config.features.*` guard (or gate on `config.slices.*`). **Do not invent an
icon** — leave the `// TODO (design): set nav icon` comment and omit the `icon` field so the user assigns the correct
sprite later. Then insert the item into the appropriate group array.

## Step 6 — Metadata

In `src/shell/metadata/templates/index.ts` add an entry keyed by `__pathname__`, using the user-approved
title/description (`default` only, no `enhanced`):
```ts
'__pathname__': {
  metadata: {
    title: { 'default': '…' },
    description: { 'default': '…' },
  },
  // og below — INDEX pages only
  og: OG_ROOT_PAGE,
},
```
**`og: OG_ROOT_PAGE` is for `index` pages only.** Detail and general pages **omit the `og` field entirely**
(matches existing detail entries such as `/block/[height_or_hash]`).

## Step 7 — Page-type analytics

In `src/services/mixpanel/get-page-type.ts` add an entry to `PAGE_TYPE_DICT` (a
`Record<Route['pathname'], string>`). **Suggest** a human-readable name; let the user adjust:
```ts
'__pathname__': '__title__',
```

## Step 8 — Sitemap (static routes only)

**If the route is dynamic, skip this step** — dynamic routes are required API data and therefore are out of the
scope of this workflow.

For a **static, config-gated** route, add a `case` to the `transform` switch in
`deploy/tools/sitemap-generator/next-sitemap.config.js` so it's excluded when the feature is off:
```js
case '__route__':
  if (process.env.NEXT_PUBLIC_<FEATURE>_ENABLED !== 'true') {
    return null;
  }
  break;
```

## Step 9 — Check TypeScript compiles

Run `pnpm run lint:tsc` (`tsc -p ./tsconfig.json`) to confirm the new files type-check. The scaffold uses the
`unknown` item type and never reads properties off it, so TypeScript should pass as-is. **ESLint is expected
to fail** on the scaffold's intentional `TODO`s (unused `item` props, single-value `const`s) until the data
is wired (Step 10, or deferred follow-up work) — don't gate on it at this stage.

## Step 10 — Wire data (if agreed in Step 0)

If Step 0 settled on wiring data now, read **`wiring.md`** (next to this file) and follow it: it declares the
resources via the `add-api-resource` skill, adds minimal loading stubs, wires `useApiQuery` /
`useQueryWithPages` (+ pagination controls for paginated lists), and renders every payload field plainly.
After it, both `tsc` and ESLint must pass.

**Direct entry** — for a page scaffolded earlier (its `TODO (api-data):` markers are still in place), skip
Steps 1–9: run only the *Data* item of the Step 0 interview, then start at `wiring.md`.
