# envs-validator — context

Validates the container's `NEXT_PUBLIC_*` environment against a [valibot](https://valibot.dev) schema at
startup.

## Layout

- **`index.ts`** — the CLI the container runs: reads the environment, the placeholder registry and the
  downloaded JSON configs, prints the report, sets the exit code. No rule lives here.
- **`checks.ts`** — the pure core (`runChecks`). Everything the CLI decides is decided here on pre-read
  inputs, which is what the specs exercise.
- **`deprecations.ts`** — variables that only produce a startup warning.
- **`schema.ts`** — the default top-level schema; selected when `NEXT_PUBLIC_MULTICHAIN_ENABLED` is unset or
  `false`.
- **`schema_multichain.ts`** — the multichain variant; selected when `NEXT_PUBLIC_MULTICHAIN_ENABLED=true`.
- **`schemas/`** — the sub-schemas the top-level ones are composed from; `schemas/app.ts` holds the entries
  both top-level schemas share, `schemas/features/<name>.ts` one multi-variable feature each.
- **`utils.ts`** — the env-string parsers, the companion-variable rules and `composeSchemas`.
- **`mocks/`** — typed fixtures shared by the specs. `test-utils.ts` holds `toEnvValue`.

The package is type-checked, linted and tested from the repo root like `src/`. Only the `vite` build is its
own: the Dockerfile ships `dist/index.js`.

## Adding a new variable

1. **Pick the rule's home** — see "Where to put the rule" below. If the variable applies in both modes,
   put it in a sub-schema both top-level files compose (or in `schemas/app.ts`); otherwise update only
   the relevant one.

2. **Write the rule** following the conventions in this file.

3. **Test it in the sibling spec** (`schemas/features/<name>.spec.ts`, `schema.spec.ts`, …): one case
   with an accepted value and one per rejection path asserting the exact message. A JSON-shaped value is a
   typed object passed through `toEnvValue`, which produces the single-quoted form operators use. A
   variable applying in both modes needs a line in both top-level specs.
   - **JSON config URL variable** → register it in `ENVS_WITH_JSON_CONFIG` in `checks.ts`; at validation
     time the variable carries the downloaded file content, not the URL, so the spec feeds it
     `JSON.stringify(content)`.

4. **Run the suite:**
   ```bash
   pnpm test:vitest deploy/tools/envs-validator
   ```
   `docs.spec.ts` fails until the variable has a row in `docs/ENVS.md`.

## Conventions

Follow these when writing or modifying a rule — they're enforced by example across the existing schemas,
not by lint, so they're easy to miss.

### Parse env strings with the helpers in `utils.ts`

Every variable arrives as a string and valibot does not coerce, so a bare `v.boolean()` or `v.number()`
rejects every real value. Use the env parsers (`envBoolean`, `envNumber`, `envPositiveInteger`, `envUrl`,
`envRequiredString`, `envJson`) for top-level variables. *Inside* a JSON value the fields are real JS
types and take plain `v.string()` / `v.number()` / `v.boolean()`, with two exceptions: a field documented
as a decimal *string* (AdButler `width`/`height`) stays on `envNumber`, and a URL field is
`v.pipe(v.string(), v.url())`, which rejects `''` — `envUrl` is for top-level variables only.

The parsers are stricter than the app's tolerance on purpose: a boolean is only `true`/`false` (the app
reads `=== 'true'`, so `1` or `TRUE` would pass validation and silently mean *false*), and a number is a
plain decimal.

`envUrl` accepts the empty string — operators unset a variable with `FOO=`, and the container turns a
missing value into `''` as well. `envBoolean`, `envNumber` and `envJson` reject it, as they always did, and
a companion rule treats `''` as "not provided".

### JSON-shaped values: `envJson(schema)`

A variable carrying JSON (read in app code via `parseEnvJson`) wraps its value schema in `envJson`, which
does the single-quote → double-quote conversion and the parse. Nested problems are reported with a dot
path (`NEXT_PUBLIC_X.0.name: Invalid key …`), so there's no hand-written "invalid schema" message to
maintain.

### Companion variables: `requires` / `requiredIf` on the object

"B only when A" is an object-level rule, not a per-field one — `schemas/features/tac.ts` is the smallest
example; `requires`, `requiredIf` and the general `companionRule` are in `utils.ts`. Two things about them
are not visible from a call site: `when` receives the *parsed* value of A (a flag is `true`/`false`, a
JSON list is an array), and the rule only runs once both variables are individually valid, so a malformed
A yields one error, not two.

A rule may name a variable declared in another schema file. Two things make that work, and both are easy
to miss: the sub-schema must be a `v.looseObject` (a plain `v.object` strips the foreign key before the
rule runs, and the rule then silently passes), and the rule sees that variable's raw string, not a parsed
value. The sub-schema spec passes the sibling key alongside; `schema.spec.ts` covers the composed case.

### Composition: `composeSchemas`

The two top-level schemas are `composeSchemas([...])` of the sub-schemas. Each sub-schema validates the
whole env map independently (that's what makes cross-file rules work); a variable unknown to all of them is
reported once, listing every unknown name. Entries that both top-level schemas need live in `schemas/app.ts`
— don't redeclare them in `schema.ts` or `schema_multichain.ts`.

### Where to put the rule

- **One-variable feature** (single flag or single URL) — declare it inline in `schema.ts`, in
  `singleVariableFeaturesSchema`.
- **Multi-variable feature** (two or more related variables, conditional relationships, nested config) —
  create or extend a dedicated sub-schema under `schemas/features/<name>.ts` and re-export it through
  `schemas/features/index.ts`.

Don't let the top-level schema grow a cluster of related vars.

## Validating a real instance config by hand

The CLI needs the bundle, the placeholder registry and the downloaded JSON configs the container has at
startup:

```bash
cd deploy/tools/envs-validator
pnpm run build
../../scripts/collect_envs.sh ../../../docs/ENVS.md
pnpm exec dotenv -e /path/to/instance.env -- ../../scripts/download_assets.sh ./public/assets/configs
pnpm exec dotenv -e /path/to/instance.env -- pnpm run validate
```

`collect_envs.sh` writes `.env.registry` and `.env` next to the bundle; both are git-ignored.
`download_assets.sh` fetches the JSON configs the instance's URL variables point at into `public/assets/configs/<name>.json`,
as the container's entrypoint does. Without it the CLI stops with `Unable to read file` (e.g.
`featured_networks.json`) on a fresh checkout; re-run it when the instance env changes.
