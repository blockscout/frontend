# envs-validator — context

Validates the container's `NEXT_PUBLIC_*` environment against a [yup](https://github.com/jquense/yup) schema at
startup.

## Schemas

- **`schema.ts`** — the default top-level schema; selected when
  `NEXT_PUBLIC_MULTICHAIN_ENABLED` is unset or `false`.
- **`schema_multichain.ts`** — the multichain variant; selected when
  `NEXT_PUBLIC_MULTICHAIN_ENABLED=true`.

## Adding a new variable

1. **Pick the rule's home** — see "Where to put the rule" below. If the
   variable applies in both modes, mirror the rule in `schema.ts` and
   `schema_multichain.ts`; otherwise update only the relevant one.

2. **Write the rule** following the conventions in this file.

3. **Add it to a test preset under `test/`:**
   - Default: append to `test/.env.base`. Most variables belong here.
   - If the variable has alternative configurations that depend on other
     variables (e.g. provider-specific add-ons for
     `NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER`), use `test/.env.alt` to cover
     the second shape.
   - For larger, self-contained scenarios (ads, rollups, chain variants,
     marketplace, …) it can make sense to add to or create a dedicated
     `test/.env.<scenario>` preset. This is a judgement call, not a rule.
   - **Multichain-only variable** → `test/.env.multichain` (validated
     standalone, without `.env.common`).
   - **JSON config URL variable** → also drop an example payload at
     `test/assets/configs/<name>.json` (filename = the env name with
     `NEXT_PUBLIC_` and `_URL` stripped, lowercased) and register the
     variable in the `envsWithJsonConfig` array in `index.ts`.

4. **Run the suite:**
   ```bash
   # from the tool directory
   pnpm test

   # or from the repo root
   pnpm --filter envs-validator test
   ```
   Each preset should end with `👍 All good!`. A failure prints the
   aggregated yup errors for that preset — fix top-down, since later
   errors can be downstream of earlier ones.

5. **Verify the negative path.** The presets only exercise the happy
   path, so the rule itself isn't proven until you see it reject bad
   input. Temporarily edit the preset to violate the rule (wrong type,
   missing companion variable, malformed JSON), re-run the suite,
   confirm the expected error fires, then revert.

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
