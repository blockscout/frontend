---
name: add-env-var
description: Step-by-step checklist for adding a new NEXT_PUBLIC_* environment variable. Use when introducing any new runtime env var.
---

# Add a new env variable

Read `.agents/rules/env-vars.mdc` first for background: how runtime delivery
works, how the config object is structured, the three value types
(primitive / JSON-encoded / JSON config URL), and where validation lives. This
skill is the checklist; the rule is the concept doc.

## Step 0 — Decide the variable's shape

Three answers drive every step below. Settle them first.

1. **Value type** (see env-vars.mdc § "Value types"):
   - **Primitive** — string, boolean, number.
   - **JSON-encoded string** — small synchronous structured config.
   - **JSON config URL** — large async-loaded payload. Variable name ends in `_URL`.

2. **External URL?** Does the value point to a third-party host (image, JSON
   payload, HTTP endpoint)? If yes → CSP and download-script considerations
   apply (see Step 4).

3. **Mode** — Does the variable apply in the default mode, multichain mode,
   or both? This decides which validator schema(s) you touch.

## Step 1 — Document in `docs/ENVS.md`

Add a row in the section that mirrors where the variable's config lives:
App configuration / APIs configuration / App shell / Slices / Features /
External services / Misc. The doc sections mirror `src/config/index.ts`.

Fill in: name, type, description, required/optional, default, example.

Set the **Version** column to `upcoming`. The release process replaces this
with the actual version number when the change ships.

Why this is mandatory: `collect_envs.sh` scans `docs/ENVS.md` for
`NEXT_PUBLIC_*` names to emit `.env.registry`, which gates what
`make_envs_script.sh` writes into `window.__envs`. An undocumented variable
never reaches the browser.

## Step 2 — Expose through the config object

### Existing config area

Find the matching sub-config:

- Slices / features / services / shell areas: `src/<area>/<name>/config.ts`.
- Cross-cutting sections (`app`, `apis`, `chain`, `misc`, `metadata`): `src/config/<area>.ts`.

Read the value with the helper that matches its type:

- Primitive — `getEnvValue('NEXT_PUBLIC_…')`; cast at the call site
  (`=== 'true'`, `Number(…)`, …).
- JSON-encoded — `parseEnvJson<T>(getEnvValue('NEXT_PUBLIC_…'))` with a
  fallback (returns `null` on parse failure).
- JSON config URL — `getExternalAssetFilePath('NEXT_PUBLIC_…_URL')`.

Never read `process.env.NEXT_PUBLIC_*` in client code.

### New feature

If the variable belongs to a **brand-new feature**, also:

1. Create the folder `src/features/<feature-name>/`.
2. Add `src/features/<feature-name>/config.ts` following the template below.
3. Register the feature in the aggregator `src/config/features.ts`:
   ```ts
   export { default as <featureName> } from 'src/features/<feature-name>/config';
   ```
   Keep the export list alphabetised by export name.

#### Feature `config.ts` template

```ts
// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const title = 'Human-readable feature name';

const config: Feature<{ /* payload fields available when enabled */ }> = (() => {
  if (getEnvValue('NEXT_PUBLIC_<FEATURE>_ENABLED') === 'true') {
    return Object.freeze({
      title,
      isEnabled: true,
      // payload fields here
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
```

`Feature<Payload>` is a discriminated union on `isEnabled`. Consumers narrow
to the enabled branch (`if (config.isEnabled) { … config.payloadField … }`)
to get typed access to the payload. Real examples:
`src/features/web3-wallet/config.ts`, `src/features/chain-stats/config.ts`.

### Private mode

Anything that integrates with a 3rd-party able to collect user info
(analytics, error tracking, A/B testing, captcha, …) must respect the
`app.isPrivateMode` flag. The flag lives in `src/config/app`.

- **Feature config** — gate the entire enabled branch on
  `!app.isPrivateMode` so consumers see `isEnabled: false` in private mode.
  Example: `src/features/web3-wallet/config.ts`.
  ```ts
  if (!app.isPrivateMode && /* other conditions */) {
    return Object.freeze({ title, isEnabled: true, /* payload */ });
  }
  return Object.freeze({ title, isEnabled: false });
  ```

- **Service config** — never store the service's client key (or any
  identifier the SDK would use to attach the user's session to a remote
  account) in the config when private mode is on. Set the field to
  `undefined` and let consumers no-op when they see it missing. Other
  non-identifying fields (config overrides, etc.) can remain populated.
  Examples: `src/services/mixpanel/config.ts`,
  `src/services/google-analytics/config.ts`.
  ```ts
  const projectToken = !app.isPrivateMode
    ? getEnvValue('NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN')
    : undefined;
  ```

If the new variable doesn't touch user data (purely cosmetic, chain config,
URL of a same-origin asset, etc.), this section doesn't apply.

## Step 3 — Validator schema and tests

Add the rule and a test preset entry. The full procedure (which schema file,
where in the schema, JSON shape conventions, JSON-URL example assets,
companion-variable rules, running the tests, verifying the negative path)
lives in `deploy/tools/envs-validator/CONTEXT.md` — follow the "Adding a new
variable" section there.

## Step 4 — Only if the variable holds an external non-asset URL

Most URL variables need a CSP allowance under `src/server/csp/policies/`.
Gate the addition on the relevant config option being enabled — don't widen
the CSP unconditionally.

**Exceptions** — these are already auto-included by `policies/app.ts` and
need no manual CSP work:

- new API `endpoint` and `socketEndpoint` values that flow into `config.apis.*`.

If the new variable lands inside one of those config paths, skip this step.
For any other external host (analytics, third-party services, custom
integrations, etc.), add the domain to the matching policy and gate it on
the feature/option being enabled.

## Step 5 — Only if the variable holds an asset URL (image or JSON config)

Append the variable name to the `ASSETS_ENVS` array in
`deploy/scripts/download_assets.sh`. The container entrypoint downloads the
asset into the image at startup so the browser serves it same-origin.

