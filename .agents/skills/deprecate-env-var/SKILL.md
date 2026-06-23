---
name: deprecate-env-var
description: Checklist for deprecating a NEXT_PUBLIC_* environment variable — immediate removal, or a grace period before a later removal. Use when removing, renaming, or replacing a runtime env var.
---

# Deprecate an env variable

This is the reverse of the `add-env-var` skill. Read `.agents/rules/env-vars.mdc`
first for background: how runtime delivery works, how the config object is
structured, the three value types, and where validation lives.

## How removal is enforced

Two startup checks make a removed variable fail loudly, so you rarely need to
write a custom guard:

- The validator schemas use `.noUnknown(true)` — any `NEXT_PUBLIC_*` key not
  declared in a schema fails validation.
- `checkPlaceholdersCongruity` (in `deploy/tools/envs-validator/index.ts`)
  throws if an env has no build-time placeholder. Placeholders come from
  `.env.registry`, which `collect_envs.sh` generates by scanning
  `docs/ENVS.md`.

Net effect: **a variable removed from both `docs/ENVS.md` and the schema will
fail container startup if an operator still sets it.** This is the hard stop
behind "immediate" removal, and the reason a grace period must keep the
variable in *both* places until the final removal.

## Step 0 — Find the current state, then pick the path

A variable already mid-grace-period must **not** be treated as a fresh
deprecation. First check whether it is **already deprecated** from an earlier
release: grep `deploy/tools/envs-validator/index.ts` for a
`printDeprecationWarning` / `checkDeprecatedEnvs` entry naming it, and check its
`docs/ENVS.md` row for a "Deprecated…" annotation.

- **Already in a grace period** — a request to "remove it" *is* the removal
  phase. Go straight to **Branch B → Phase 2**; do **not** ask the user which
  branch.

- **Not yet deprecated** — **ask the user explicitly** which branch applies
  (do not infer it):

  - **Immediate removal** — the variable is deleted in this release. Operators
    who still pass it get a startup failure. Right when the feature is gone
    entirely, or the value now comes from elsewhere (e.g. the API) and no
    migration by the operator is expected. Precedents:
    `NEXT_PUBLIC_HAS_MUD_FRAMEWORK`, `NEXT_PUBLIC_SAVE_ON_GAS_ENABLED`, the
    Sentry variables.

  - **Grace period** — the variable keeps working for one or more releases with
    a runtime deprecation warning, then is removed in a later release. Right
    when operators need time to migrate, typically because the variable was
    **renamed or replaced** by a new one. Precedent:
    `NEXT_PUBLIC_RE_CAPTCHA_V3_APP_SITE_KEY` → `NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY`
    (#2384).

Also settle: **is there a replacement variable?** This changes the grace-period
recipe and the `Comment` you write in the docs.

---

## Branch A — Immediate removal

Do all of the following in one PR.

### A1 — Move the docs row

- Delete the variable's row (and its section/heading if it was the only row)
  from `docs/ENVS.md`.
- Append a row to `docs/DEPRECATED_ENVS.md`. The **Description** must be the
  variable's *original functional* description — if a grace period appended a
  deprecation note (`Deprecated — use NEXT_PUBLIC_FOO instead.`), strip it back
  to the original. Set **Deprecated in version** to `upcoming` (the release
  process replaces it), and put the deprecation reason or replacement **only in
  the Comment column** — e.g. `Feature is deprecated.`, `Replaced with
  NEXT_PUBLIC_FOO`, or `Removed; configuration done on the API side`.

### A2 — Remove the validator rule

- Delete the rule from wherever it lives: inline in `schema.ts`, in
  `schema_multichain.ts`, or in a feature sub-schema under
  `schemas/features/<name>.ts`. Remove it from **both** schemas / sub-schemas
  if it applied in both modes.
- Remove the variable from every test preset under
  `deploy/tools/envs-validator/test/` (`.env.base`, `.env.alt`,
  `.env.multichain`, scenario presets). If it was a JSON-config-URL variable,
  also delete its example payload under `test/assets/configs/` and its entry in
  the `envsWithJsonConfig` array in `index.ts`.

### A3 — Remove the app code

- Remove the sub-config that reads it (the `getEnvValue('NEXT_PUBLIC_…')` /
  `parseEnvJson` / `getExternalAssetFilePath` call) and every consumer.
- If a **whole feature** is being removed: delete the feature folder
  (`config.ts`, components, `mocks/`, `*.pw.tsx` and their committed
  screenshots) and remove its export from the aggregator
  `src/config/features.ts`.

### A4 — Remove downstream references (only those that existed)

Check each and clean up if the variable/feature touched it:

- CSP allowance under `src/server/csp/policies/`.
- `ASSETS_ENVS` array in `deploy/scripts/download_assets.sh` (asset-URL vars).
- `deploy/tools/sitemap-generator/next-sitemap.config.js`.
- `deploy/tools/llms-txt-generator/` generators.
- `public/icons/name.d.ts` (if a feature-only icon is gone).
- `.agents/GLOSSARY.md`.

### A5 — Stop the demo deploy from re-supplying it

Add the removed variable to the `deprecatedEnvs` array in
`tools/dev-server/envs-rules.json`. The local dev server and the demo (review)
deploy fetch a **live instance's** config over HTTP, and that instance still
serves the old variable; `deprecatedEnvs` drops it before validation. Without
this, the demo deploy fails on a variable that no longer exists in the schema.
See `tools/dev-server/CONTEXT.md` § "Dropped envs" for the full why.

### A6 — (Optional) friendlier error for a replaced variable

The `.noUnknown` + congruity checks already fail startup with a generic
message. If the variable was **replaced** and you want operators to see a
clear "use X instead" message, add a guard to `checkDeprecatedEnvs()` in
`deploy/tools/envs-validator/index.ts` that throws with that message.

---

## Branch B — Grace period (two phases)

### Phase 1 — Deprecation release (this PR)

1. **Docs** — keep the row in `docs/ENVS.md` (it still functions). **Append** a
   deprecation note to its Description, leaving the original text intact (e.g.
   `… original description. Deprecated — use NEXT_PUBLIC_FOO instead.`) — Phase 2
   strips this note when it moves the row. Do **not** touch
   `docs/DEPRECATED_ENVS.md` yet. If there is a replacement variable, add it now
   following the `add-env-var` skill.

2. **App code** — keep reading the variable. For a replacement, read the new one
   with a fallback to the old at the call site:
   `getEnvValue('NEXT_PUBLIC_FOO') || getEnvValue('NEXT_PUBLIC_OLD')`.

3. **Validator schema** — keep the old variable accepted in `schema.ts` /
   `schema_multichain.ts`. If it was **Required**, make it optional now (the new
   variable carries the requirement). Keep its test-preset entries valid.

4. **Validator messaging** (`deploy/tools/envs-validator/index.ts`):
   - Always add a non-fatal warning in `printDeprecationWarning()` when the old
     variable is present (the `❗❗❗ … will be removed in the next release …`
     block).
   - **If there is a replacement:** also add a guard in `checkDeprecatedEnvs()`
     that **throws** when the old variable is set *without* the new one — forces
     operators onto the new name while still accepting both. (This is the
     `NEXT_PUBLIC_RE_CAPTCHA_*` pattern from #2384.)
   - **If there is no replacement:** warn only; do not throw.

### Phase 2 — Removal release (a later PR)

Run the entire **Branch A** checklist for the old variable, **plus**: remove
the warning block you added to `printDeprecationWarning()` and the guard in
`checkDeprecatedEnvs()` in Phase 1.

---

## Both branches — finishing up

- **Version columns** stay `upcoming`; the `prepare-release` skill rewrites them
  to the shipping tag.
- **Label the PR `ENVs`** so the change is picked up into the "Changes in ENV
  variables" section of the release notes.
- **Run the validator suite and check the negative path:**
  ```bash
  pnpm --filter envs-validator test
  ```
  Each preset should end with `👍 All good!`. For a grace-period guard,
  temporarily set the old variable without the new one in a preset and confirm
  startup fails as intended, then revert. See
  `deploy/tools/envs-validator/CONTEXT.md` for details.
