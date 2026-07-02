# Data-wiring phase (Step 10 of `add-new-page`)

Wires the scaffolded page components to real API data and displays it **plainly** — this is a
data pass, not a design pass. Entered from Step 10 of `SKILL.md`, or directly for a page that
was scaffolded earlier (its `TODO (api-data):` markers are still in place); on direct entry
run the *Data* item of the Step 0 interview first.

**The worklist is the tag.** Grep the page's directories for `TODO (api-data):` — every hit
(page shell, `Content`, `Table`/`TableItem`, `List`/`ListItem`, `Details`, `GeneralInfo`) is
a spot this phase must resolve (the done-condition is checked in Step W5). `TODO (design):`
markers are the next stage's worklist — leave them in place, and add new ones for any
representation decision you defer (Step W4).

**In scope:** resource declaration (via the `add-api-resource` skill), minimal loading stubs,
`useApiQuery` / `useQueryWithPages` wiring, pagination controls, plain rendering of every
payload field.
**Out of scope:** filters, sorting, search, socket live-updates, mocks, tests, and design
polish — unless the task explicitly names them.

## Step W1 — Declare missing resources

For each content body's resource that doesn't exist yet in `src/api/resources/services/**`,
**invoke the `add-api-resource` skill** — its Step 0 answers were already collected in the
page interview, so don't re-ask. It hands back the `service:name` key, payload type,
paginated flag, and a sample response body.

For resources that already exist, still fetch a sample body (recipe: *Resolving a resource's
real request URL* in `src/api/CONTEXT.md`) if you don't have one — Steps W2 and W4 need it
for stub values and the field inventory.

## Step W2 — Loading stubs

The loading UI renders skeleton rows over placeholder data (`isPlaceholderData` → the
`isLoading` props the scaffold already threads through), so each resource needs a **minimal
stub** in the owning slice/feature `stubs.ts` (or `stubs/`):

- Type it with the payload type; for a paginated list, the stub is a **single item**
  (exemplar: `BLOCK_ITEM: schemas['Block']` in `src/slices/block/stubs/list.ts`).
- Copy/adapt realistic values from the sample body — don't invent shapes.
- Reuse existing shared stub fragments where they fit (e.g. `ADDRESS_PARAMS`).

Mocks and tests are **not** produced here.

## Step W3 — Wire the queries (by content type)

Replace the scaffold's placeholder `items` / `data` / `isLoading` / `isError` consts, and
replace the `unknown` item/data types with the payload (item) type **everywhere it appears** —
the page shell *and* the `Table`/`TableItem`/`List`/`ListItem` (or `Details`) components each
carry their own `unknown` marker.

- **index, paginated resource** — in the page shell, `useQueryWithPages({ resourceName,
  options: { placeholderData: generateListStub<'service:name'>(ITEM_STUB, 50,
  { next_page_params: { … } }) } })`; take the `next_page_params` keys from the sample body.
  Thread the query down to the content body; pass `isPlaceholderData` as `isLoading` and
  `query.pagination.page` where row indexes need it. Add an `ActionBar` with `Pagination`,
  gated on `pagination.isVisible`. Exemplar: `src/slices/address/pages/index/Accounts.tsx`
  (minimal, socket-free); for a tabbed page with one query per tab (each gated with
  `enabled: tab === '…'`), see `src/slices/block/pages/index/Blocks.tsx`.
- **index, non-paginated resource** — `useApiQuery('service:name', { queryOptions: {
  placeholderData: <array-of-stub-items payload> } })`; no `ActionBar`/`Pagination`.
- **detail** — in the page shell, `useApiQuery('service:name', { pathParams: { …: __entityParam__ },
  queryOptions: { enabled: Boolean(__entityParam__), placeholderData: STUB } })`; pass
  `data` and `isPlaceholderData` (as `isLoading`) into the `Details` body. The minimal
  pattern is the `query` at the top of `src/slices/token/hooks/useTokenQuery.ts` — 
  ignore `initialData`.
- **general** — `useApiQuery` + stub, same shape as detail minus `pathParams`.

## Step W4 — Render every field, plainly

Inventory the payload fields from the type + sample body and render **all of them** in the
scaffolded body — `DetailedInfo` rows in `Details` for detail pages; for index pages the
columns in `Table`, the cells in `TableItem`, **and** the label/value pairs in `ListItem`
(desktop and mobile views must show the same fields); free layout in `GeneralInfo` for
general:

- Use the obvious shared component **only when the field is unambiguous** — an address
  object/hash → `AddressEntity`, a tx hash → `TxEntity`, a block → `BlockEntity`, a
  timestamp → the shared time-format helpers.
- Everything else is **plain text**: numbers/strings as-is; nested objects either split into
  sub-fields or JSON-stringified. **Never invent formatting** (no rounding, units, or
  truncation decisions) — tag each plain-text field with
  `// TODO (design): <field> representation` instead, and **list all tagged fields to the
  user at the end** so the design pass has a worklist.
- Replace the scaffold's generic `DataList` placeholders with the real entity: plural
  sentence in `emptyText`, singular `emptyStateProps.term`.

## Step W5 — Verify

No `TODO (api-data):` marker may remain in the page's directories (grep to confirm). 
Both `pnpm run lint:tsc` **and** ESLint must now pass — the scaffold's intentional lint 
failures are resolved by wiring; don't leave suppressions behind. Then suggest the user 
run the dev server against the instance chosen in the interview (see `tools/dev-server/`) 
to eyeball the page with real data.
