# Dev server — context

How the local dev server **and** the demo (review) deploy get their `NEXT_PUBLIC_*`
env vars. The model: instead of committing a per-instance preset file for every chain,
we **fetch a live instance's public config over HTTP at startup** and write it to a
throwaway `.env.tmp`. This directory owns the registry, the fetch logic, and the run
scripts.

## Why fetch instead of committed presets

Every deployed instance exposes its full public config at `/node-api/config`
(rewrite → `src/pages/api/config.ts`, returns `{ envs: { …all NEXT_PUBLIC_* } }`).
Those values include the "secret" `NEXT_PUBLIC_*` keys (WalletConnect, reCAPTCHA, GA,
…) — they're already public in the live site's `envs.js`, so a fetched preset comes
with **working keys baked in**. That makes hand-maintained, drift-prone preset files
unnecessary.

## Files

| File | Role |
|---|---|
| `registry.json` | **Single source of truth**: `alias` → instance URL map. |
| `envs-rules.json` | `localEnvs` (local APP_* substitutions) + `ignoredEnvs` / `deprecatedEnvs` (keys to drop — see "Dropped envs" below). |
| `fetch.ts` (→ `fetch.js`) | Fetches `<url>/node-api/config`, drops `ignoredEnvs` + `deprecatedEnvs`, applies/omits `localEnvs`, writes `.env.tmp`. |
| `fetch.sh` | Compile-on-run wrapper (`tsc` + `node fetch.js`). Resolves its own path, so callable from any cwd. |
| `dev.preset.sh` | `pnpm dev:preset <alias> [--port <number>]` — fetch + run `next dev`. |
| `dev.local.sh` | `pnpm dev:local [--port <number>]` — run against a local backend using `.env.localhost` (no fetch). |
| `.env.localhost` | Committed base config for local-backend dev. |
| `sync-preset-lists.mjs` | Regenerates / checks the alias dropdowns from `registry.json`. |
| `fetch.js`, `tsconfig.tsbuildinfo` | Build artifacts — git-ignored, regenerated on run. |

## Dropped envs: `ignoredEnvs` vs `deprecatedEnvs`

`envs-rules.json` lists two sets of keys that `fetch.ts` strips from the fetched
instance config before writing `.env.tmp`. Both are dropped identically; the split
is about churn and intent (JSON can't carry inline comments, so the distinction
lives here):

- **`ignoredEnvs`** — build-time / injected keys a live instance always exposes but a
  fetched preset must not carry (`NEXT_PUBLIC_GIT_COMMIT_SHA`, `…_GIT_TAG`,
  `…_ICON_SPRITE_HASH`). Stable; rarely changes.
- **`deprecatedEnvs`** — variables removed from the app. A live instance still serves
  the old key from its config, so unless it's dropped the demo deploy's envs-validator
  fails on a variable that no longer exists in the schema. This list grows every time a
  variable is removed for good (see the `deprecate-env-var` skill) — add the removed
  variable here.

## Gotchas (these bit us; don't re-learn them)

- **Output is raw `KEY=value`, NOT quoted.** dotenv-cli (the dev loader) does not understand
  bash single-quote escaping (`'\''`) — it stores it literally and corrupts JSON-ish values
  (e.g. `HOMEPAGE_HERO_BANNER_CONFIG`, `MARKETPLACE_ESSENTIAL_DAPPS_CONFIG`). So `fetch.ts`
  emits raw values, exactly like the old committed presets. Because raw values are **not
  `source`-safe**, the container entrypoint reads `.env.tmp` via a `while IFS='=' read` loop,
  never `source`.
- **dotenv-cli precedence: the FIRST `-e` file wins** (not the last). The run scripts therefore
  list env files **highest-priority-first**.
- **`--omit-local-envs` is the dev/container switch.** Dev mode applies `localEnvs` (so APP_HOST
  etc. point at `localhost`); the container passes `--omit-local-envs` so those keys are absent
  and the deployment's own APP_* values survive (this replaced the old entrypoint blacklist).

## Env layering (highest → lowest priority)

- `dev:preset`: `--port` flag → `.env.local` → `.env.extra` → `.env.secrets` → `.env.tmp` (fetched instance)
- `dev:local`: `--port` flag → `.env.local` → `.env.extra` → `.env.secrets` → `.env.localhost`

The `--port` flag sets `NEXT_PUBLIC_APP_PORT` via dotenv-cli's `-v` (applied AFTER all `-e`
files, so it beats every env file). It overrides the env var rather than just `next dev -p`
so the generated `envs.js` / `config.app.baseUrl` stay consistent with the actual port.
Without the flag, the port comes from the env files as before (default `3000` from
`localEnvs` / `.env.localhost`; a persistent personal override belongs in `.env.local`).

| File | Committed? | Purpose |
|---|---|---|
| `.env.local` | git-ignored | Personal, local-only overrides (Next convention). |
| `.env.extra` | **committed** (empty on main) | Branch/feature ENVs that must also reach the **demo deploy**. No secrets. |
| `.env.secrets` | git-ignored (repo root) | Local secret overrides; optional (fetched config already carries public keys). |
| `.env.tmp` | git-ignored | The fetched instance config; overwritten each start, left on disk for inspection. |

## Demo deploy

`deploy/scripts/entrypoint.sh` → `load_envs_from_preset`: if `ENVS_PRESET` is set (and not
`none`), runs `fetch.js "$ENVS_PRESET" --omit-local-envs --out=/tmp/.env.tmp` (writes to `/tmp`
because the `nextjs` runtime user can't write `/app`), then exports `.env.tmp` followed by the
committed `.env.extra`. The `Dockerfile` compiles `fetch.ts` in the builder stage and copies
`fetch.js` + `registry.json` + `envs-rules.json` + `.env.extra` into the runtime image.

The image is **preset-agnostic** — `ENVS_PRESET` is NOT baked in. The deploy workflow
(`deploy-review.yml`, with a `variant` input selecting the `review` / `review-2` flavor) passes
the chosen preset to the deploy job via `helmfileParameters: --state-values-set envsPreset=<alias>`;
`deploy/helmfile.yaml.gotmpl` defaults `envsPreset: none` and `deploy/values/*/values.yaml.gotmpl`
render it into the container's `frontend.env.ENVS_PRESET`, so it arrives as a runtime k8s env.

## Adding / removing a preset

1. Edit `registry.json` (the `alias` → URL map).
2. Run `pnpm presets:sync` — regenerates the alias dropdowns in `.github/workflows/deploy-review.yml`
   and `.vscode/tasks.json` (it splices only the lines between the `presets:start` / `presets:end`
   marker comments).
3. Commit. CI runs `pnpm presets:lint` (in `checks.yml`) and **fails the PR if the dropdowns drift**
   from the registry.

Other consumers (`tools/scripts/{sitemap,og-image}-generator.dev.sh`, the essential-dapps /
feature-reporter / llms-txt generators, `docker.preset.sh`) all fetch via `fetch.sh <alias>` and
run against the resulting `.env.tmp`.
