# Deploy — context

How a Blockscout frontend container is built and how it starts up. The image
is produced from `Dockerfile` (three stages: `deps` → `builder` → `runner`)
and entered through `entrypoint.sh`. The orchestration lives in
`deploy/scripts/`; the heavier programs it calls live in `deploy/tools/`.

This file is intentionally a map, not a manual. For per-tool details, look
for a `CONTEXT.md` (or `README.md`) inside the matching `deploy/tools/<tool>/`
folder.

## Build time

### Run the build-time scripts (`deploy/scripts/`)

- **`build_sprite.sh`** — assembles the SVG icon sprite from `src/sprite/icons/`
  into `public/icons/sprite.<hash>.svg`. The hash is exported as
  `NEXT_PUBLIC_ICON_SPRITE_HASH` so the app can cache-bust the sprite.
- **`collect_envs.sh`** — scans `docs/ENVS.md` for every `NEXT_PUBLIC_*` name
  and writes `.env.registry`. This registry is the contract between the docs
  and the runtime: only variables listed in it will reach the browser. Build
  args (Git tag, commit SHA, …) are captured into `.env` at the same time.

The Next.js build itself (`pnpm routes:generate`, `pnpm run build`) runs
between these and produces the standalone server bundle copied into the
runtime image.

### Build the runtime tools

Each of runtime tools is built into a small standalone JS bundle so the runtime
image doesn't need to ship the full source tree or `node_modules`.

## Runtime

`entrypoint.sh` is the container's `ENTRYPOINT`. It runs the steps below in
order and then `exec`s the Next.js server. Most steps depend on the
container's environment, which is why they happen here and not at build
time.

1. **Load preset** — if `ENVS_PRESET` is set, source the matching file from
   `configs/envs/`. Presets are convenience bundles of env vars for common
   deployments.
2. **`download_assets.sh`** — fetches the external assets referenced by env
   vars (network logo, marketplace config JSON, featured-networks list,
   etc.) into `public/assets/configs/` so the app serves them same-origin
   and not depend on 3rd-party insfrastructure.
3. **`validate_envs.sh`** → `envs-validator` — fail-fast check that the
   container's env vars conform to the schema. Skippable via
   `SKIP_ENVS_VALIDATION=true`.
4. **`favicon_generator.sh`** → `favicon-generator` — regenerates favicons
   from the (possibly just-downloaded) network icon.
5. **`og_image_generator.js`** — renders the Open Graph preview image used
   for link unfurls.
6. **`export_pro_api_flag.sh`** — auto-detects whether the configured chain
   is supported by the Blockscout Pro API and exports
   `NEXT_PUBLIC_PRO_API_SUPPORTED` accordingly (unless the operator already
   set it).
7. **`make_envs_script.sh`** — writes every `NEXT_PUBLIC_*` value into
   `public/assets/envs.js` as `window.__envs = { … }`. This is how runtime
   env values reach the browser.
8. **`multichain-config-generator`** and
   **`essential-dapps-chains-config-generator`** — produce the JSON config
   files those features load at runtime.
9. **`sitemap_generator.sh`** → `sitemap-generator` — writes
   `sitemap.xml` / `robots.txt` for the current host.
10. **`llms-txt-generator`** — writes `llms.txt`.
11. **`feature-reporter`** — logs the enabled-feature summary.
12. **`exec node server.js`** — hand control to Next.js.
