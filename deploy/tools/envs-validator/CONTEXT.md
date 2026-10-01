# envs-validator — context

Validates the container's `NEXT_PUBLIC_*` environment against a [yup](https://github.com/jquense/yup) schema at
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
- **`schemas/`** — the sub-schemas the top-level ones are concatenated from; `schemas/features/<name>.ts`
  per multi-variable feature.
- **`mocks/`** — typed fixtures shared by the specs. `test-utils.ts` holds `toEnvValue`.

The package is type-checked, linted and tested from the repo root like `src/`. Only the `vite` build is its
own: the Dockerfile ships `dist/index.js`.

## Adding a new variable

1. **Pick the rule's home** — see "Where to put the rule" below. If the
   variable applies in both modes, mirror the rule in `schema.ts` and
   `schema_multichain.ts`; otherwise update only the relevant one.

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

Follow these when writing or modifying a rule — they're enforced by example
across the existing schemas, not by lint, so they're easy to miss.

### Use `urlTest`, not `yup.string().url()`

Yup's built-in URL validator is intentionally disabled in this project
(`url(): never;` declared at the top of `schema.ts`). For any URL-shaped
value, attach the custom `urlTest` from `utils.ts`:

```ts
NEXT_PUBLIC_SOMETHING_URL: yup.string().test(urlTest),
```

### JSON-shaped values: `.transform(replaceQuotes).json()`

A variable that carries a JSON object or array (read in app code via
`parseEnvJson`) must apply two transforms before any shape rules:

```ts
yup.object<MyType>().transform(replaceQuotes).json().shape({ … })
```

`replaceQuotes` converts single quotes to double quotes so operators can
paste `'{"a":1}'` into a shell or `.env` file without escaping. `.json()`
then parses the resulting string. Omitting either step makes the
operator-facing single-quote syntax fail validation.

### Companion variables: `.when(...)` with a guard

When variable B is only meaningful if variable A is set, gate B on A and
forbid B in the otherwise-branch. The exact "forbid" test depends on the
value type:

```ts
// Scalar B — assert it is undefined when A is unset.
NEXT_PUBLIC_B: yup.string().when('NEXT_PUBLIC_A', {
  is: (value: string) => Boolean(value),
  then: (schema) => schema.test(urlTest),
  otherwise: (schema) => schema.test(
    'not-exist',
    'NEXT_PUBLIC_B can only be used with NEXT_PUBLIC_A',
    value => value === undefined,
  ),
}),

// Array or string-length B — use max(-1) so even an empty value fails.
NEXT_PUBLIC_B: yup.array().when('NEXT_PUBLIC_A', {
  is: true,
  then: (schema) => schema,
  otherwise: (schema) => schema.max(-1, 'NEXT_PUBLIC_B cannot be used without NEXT_PUBLIC_A'),
}),
```

`max(-1)` is used because an empty array still satisfies `=== undefined`
checks. See `tacSchema`, `beaconChainSchema`, and `marketplaceSchema` for
working examples.

A `.when` may name a variable declared in another schema file; it only resolves once the files are
concatenated, so the sub-schema spec passes the sibling key alongside and `schema.spec.ts` covers the
composed case.

### Deeply-nested JSON: `yup.mixed().test('shape', …)`

For JSON values with non-trivial nested shapes, don't inline `.shape({…})`
at the top level — yup's nested-object error messages are unhelpful.
Instead wrap the rule in `yup.mixed().test('shape', …)` and build the
real schema inside the test function:

```ts
NEXT_PUBLIC_FOO: yup.mixed().test(
  'shape',
  'Invalid schema for NEXT_PUBLIC_FOO, it should have …',
  (data) => {
    const isUndefined = data === undefined;
    const valueSchema = yup.object<Foo>().transform(replaceQuotes).json().shape({
      name: yup.string().required(),
      url_template: yup.string().required(),
    });
    return isUndefined || valueSchema.isValidSync(data);
  },
),
```

This gives one clear, schema-author-controlled error message instead of
the auto-derived one. Existing examples: `NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG`,
`NEXT_PUBLIC_ADDRESS_USERNAME_TAG`, the marketplace essential-dapps config.

### Where to put the rule

- **One-variable feature** (single flag or single URL) — declare it inline
  in `schema.ts` under the run-time block.
- **Multi-variable feature** (two or more related variables, conditional
  relationships, nested config) — create or extend a dedicated sub-schema
  under `schemas/features/<name>.ts` and re-export it through
  `schemas/features/index.ts`.

There's an explicit comment in `schema.ts` codifying this split; don't
let the top-level schema grow a cluster of related vars.

## Validating a real instance config by hand

The CLI needs the bundle and the placeholder registry the container has at startup:

```bash
cd deploy/tools/envs-validator
pnpm run build
../../scripts/collect_envs.sh ../../../docs/ENVS.md
pnpm exec dotenv -e /path/to/instance.env -- pnpm run validate
```

`collect_envs.sh` writes `.env.registry` and `.env` next to the bundle; both are git-ignored.
