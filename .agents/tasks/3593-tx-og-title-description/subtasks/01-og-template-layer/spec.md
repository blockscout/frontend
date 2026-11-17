# Turn the `og` block into a `default`/`enhanced` template layer

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 1 of #3593 |
| Status | `done` |
| Size | `medium` |
| Sub-branch | — (single commit on `issue-3593`) |
| PM | Ulyana (task author) |
| Designer | — |
| Backend | — |

## Context & goal

`generate()` today treats the `og` block as static data: `opengraph.title` is just the compiled page title,
and `opengraph.description` is `TEMPLATE_MAP[pathname].og?.description` **passed through raw** — never run
through `compileValue`, so it can hold no placeholders. That makes a per-route dynamic OG description
impossible, and `RouteTemplateRecord.og` additionally requires `description` and `image` *together*.

This subtask makes `og` a first-class template layer with the same `default`/`enhanced` mechanics as the
metadata templates, with OG title and OG description resolved independently and falling back to the
metadata values when a route declares no OG template. It is **behavior-preserving**: no route's output
changes. `/tx/[hash]`'s own templates land in subtask 4.

## Functional requirements

- `og.title` and `og.description` each accept `{ 'default'?: string; enhanced?: string }` and are compiled
  with `compileValue` against the same `params` object as the metadata templates.
- `og.image` becomes independent of the other two — a route may declare an image with no templates, or
  templates with no image.
- The ` | Blockscout` postfix is appended to the compiled OG title in **both** the `default` and `enhanced`
  cases, still gated by `config.metadata.promoteBlockscoutInTitle`.
- A route with no `og.title` gets `opengraph.title = title`; with no `og.description`, it gets
  `opengraph.description = description`. An OG template that declares only an `enhanced` variant inherits
  the metadata template's `default`, so a route needing just a richer bot description doesn't restate the
  base text. The description fallback is written **explicitly** even though
  crawlers already do it implicitly when the tag is absent — it documents the intent and makes the
  resolution rule uniform with the title's.
- New param `hash_short` — `shortenString(hash, 8)`, i.e. `0xda...671a`. Set to `undefined` (not `''`) when
  the route has no `hash` query param, so `compileValue`'s truthiness check behaves.
- Every existing route's `title`, `description`, and `og:image` output is byte-identical afterwards. The
  explicit description fallback is the one intended exception: routes that declare no `og.description` now
  emit an `og:description` tag holding the same text crawlers previously inferred from
  `<meta name="description">` — the preview a social client renders is unchanged, but five entries in
  `generate.spec.ts.snap` move from `undefined` to that text. `OG_ROOT_PAGE` routes are untouched (their
  compiled description stays `''`, so the tag is still omitted).

## Data & API

None.

## UI inventory

No visual surface. Files:

- `src/shell/metadata/templates/index.ts` — the `RouteTemplateRecord` interface and `OG_ROOT_PAGE`.
- `src/shell/metadata/generate.ts` — resolution and the new param.
- `src/shell/metadata/generate.spec.ts` + `__snapshots__/generate.spec.ts.snap`.

## Out of scope

- Adding OG templates to `/tx/[hash]` — subtask 4.
- Touching `og:image` for any route.
- `metadata.update()` — client-side updates deliberately don't touch OG tags (bots don't run JS).

## Task breakdown

- [x] 1 `[agent]` Extend `RouteTemplateRecord` in `src/shell/metadata/templates/index.ts`
  — `TemplateValue` lives in `src/shell/metadata/types.ts` and is reused by `compile-value.ts`.
  - inputs:
    - Extract the repeated `{ 'default': string; enhanced?: string }` shape into a named interface and
      reuse it for `metadata.title`, `metadata.description`, `og.title`, `og.description`.
    - New shape: `og?: { title?: <that shape>; description?: <that shape>; image?: string }`.
    - Migrate `OG_ROOT_PAGE` to `{ description: { 'default': config.metadata.og.description }, image: config.metadata.og.imageUrl }`.
      It is referenced by many routes; the value must stay identical.
- [x] 2 `[agent]` Resolve OG title and description independently in `src/shell/metadata/generate.ts`
  - inputs:
    - `const ogTemplates = TEMPLATE_MAP[route.pathname].og;`
    - `opengraph.title = ogTemplates?.title ? compileValue(ogTemplates.title, params) + titlePostfix : title`
    - `opengraph.description = ogTemplates?.description ? compileValue(ogTemplates.description, params) : description`
    - `opengraph.imageUrl = ogTemplates?.image`
    - Do **not** thread bot type into `generate()`; `apiData` presence is the only enhancement signal.
- [x] 3 `[agent]` Add the `hash_short` param in `generate.ts`
  - inputs:
    - Derive from `castToString(route.query?.hash)` the same way `idParam` / `idFormatted` are derived above it.
    - `const hashParam = castToString(route.query?.hash); … hash_short: hashParam ? shortenString(hashParam, 8) : undefined`
    - Import `shortenString` from `src/shared/texts/shorten-string`. `charNumber: 8` is what
      `truncation="constant"` resolves to in the entity components, so titles and interpretation text
      shorten identically.
- [x] 4 `[agent]` Cover the new layer in `src/shell/metadata/generate.spec.ts`
  — new `og template layer` describe, driven by a stand-in `TEMPLATE_MAP` (no route declares OG templates yet).
  - inputs:
    - Test what's actually new, per `.agents/rules/tests-unit.mdc`: a route with `og` templates only
      (title falls back to metadata), a route with both, `enhanced` chosen when all its params are present
      and `default` when one is missing, and `hash_short` compilation.
    - The existing snapshot entries must come out unchanged apart from the `opengraph.description` fallback
      noted in the functional requirements — any rewrite of a `title` or `imageUrl` means the refactor
      changed behavior and is wrong.
    - `OG_ROOT_PAGE` routes keep emitting the same `og:description` and `og:image` as before.

## Open questions

None. (Parent Q1 does not affect this subtask.)
