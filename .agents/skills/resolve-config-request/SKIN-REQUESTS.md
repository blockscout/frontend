# Skin requests

A live **demo** is the review surface — screenshots miss dark-mode variants and viewBox cropping. The demo is unconditional — even a plain logo swap earns one.

Variables: `NEXT_PUBLIC_NETWORK_LOGO` / `_DARK`, `NEXT_PUBLIC_NETWORK_ICON` / `_DARK`, `FAVICON_MASTER_URL`, `NEXT_PUBLIC_OG_IMAGE_URL`, `NEXT_PUBLIC_COLOR_THEME_OVERRIDES`, `NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG`, `NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG`, `NEXT_PUBLIC_NAVIGATION_PROMO_BANNER_CONFIG`.

Checkout and commit/PR rules: parent **Fetched configs**, except its confirmation — see **Phase 1**. Follow the `check-github-cli` skill before any `gh` step.

Non-skin variables on the same request wait and ride in the phase-2 DevOps message. Non-skin `frontend-configs` files on the same request go in this PR.

## Drift

The `configs/hero-banner/` and `configs/color-themes/` JSON files are the editable source of truth for variables whose values are **inlined** into the env var. They are not fetched at runtime. To change one colour, read the current file, patch it, and regenerate the string.

Emitting `NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG` or `NEXT_PUBLIC_COLOR_THEME_OVERRIDES` without updating the file in the same change lets the two drift: the next colour tweak regenerates from a stale base and silently reverts everything since. Those variables always take this branch, even for a one-colour change.

Regenerate with the configs repo's converter:

```bash
node ./tools/json-converter/index.js <path-to-file>
```

## Colour sources

Two configs, overlapping vocabulary; the request usually covers only one of them in text. Reconcile both before writing anything.

- **Message text → hero banner.** background, text colour, button default/hover, light and dark.
- **Figma sheet → colour theme overrides.** These tokens typically exist *only* in Figma.

A `background` in the message text is not the theme's `bg.primary`.

Read fills off a rendered frame (`get_screenshot`). Bound-variable lookup (`get_variable_defs`) returns design-system defaults for per-instance raw fills. Both need the Figma plugin in Claude Code or Cursor. To tell which tokens are actually part of the request, diff each swatch against `DEFAULT_THEME_COLORS` in `src/toolkit/theme/foundations/colors.ts`: a token sitting at the default is not part of the request; one that differs is.

**If those tools are absent or fail, or Figma is unreachable, stop.** A half-applied skin reaching DevOps is worse than a blocked request.

Hero banner values are `Array<string | undefined>` with index `[0]` = light, `[1]` = dark (`[1] || [0]` fallback).

## Assets

Optimise SVGs with the configs repo's `svgo.config.cjs` — it strips dimensions, keeps `viewBox`, and applies `prefixIds` per file so light and dark variants do not collide. Favicon: square PNG, ≥180×180. OG image: 1200×600.

Directories: `configs/network-logos/`, `configs/network-icons/`, `configs/favicons/`, `configs/og-images/`, `configs/hero-banner/`, `configs/network-skins/` (hero backgrounds), `configs/color-themes/`, `configs/homepage-highlights/`. Navigation promo banner is inlined and has no file in this repo.

While the configs PR is open, asset URLs are the **PR branch's** raw GitHub URLs, not `main`.

## Demo mechanics

`.env.extra` is committed and is the **only** channel that carries env overrides into a review deploy. An instance not in the registry: add it to `tools/dev-server/registry.json`, run `pnpm presets:sync` (writes `.github/workflows/deploy-review.yml` and `.vscode/tasks.json`), commit all four **on the demo branch**. They die with that branch. Procedure: `tools/dev-server/CONTEXT.md`.

Hostname: `review-<branch-slug>.k8s-dev.blockscout.com`. Follow the `deploy-demo` skill.

Verify the theme by **computed values** — read the resolved CSS custom properties in both light and dark. The first click after opening the theme settings pop-over is swallowed; click again. A demo also confirms two things a local run cannot: that the favicon bundle is generated at container start from `FAVICON_MASTER_URL`, and that the envs-validator accepts the inline JSON blobs.

## Phase 1 — demo

**Phase 1 runs to the demo link without stopping.** No gate — designer's or user's — on the branch, the commits, the configs PR, the demo deploy, or the demo-link post. The PR is open but unmerged and the demo dies with its branch, so nothing here can touch a production instance; the parent's commit confirmation does not apply. The demo *is* the review surface, and a confirmation asked before it exists is asked of someone who cannot yet see what they are confirming.

The requester (designer) is the gatekeeper for phase 2; the user relays that approval. There is no automated watch on the thread — the user monitors and continues this session.

1. Produce the assets and JSON configs from the thread and Figma.
2. Open a PR on `frontend-configs` (target `main` branch). No confirmation, per above; `create-pr` exceptions: parent **Fetched configs**.
3. Point the demo at the PR-branch raw URLs (see **Demo mechanics**). Deploy it.
4. Verify on the live demo, post the demo link to the requester, and **stop**. Post it without asking — the named exception to `AGENTS.md`'s approve-before-sending rule. This is the run's only stop; what it waits for is the designer's reply.

**Done when:** the configs PR is open, the demo is live, the requester has the link, and this run has stopped.

## Phase 2 — ship

Starts only when the user relays the designer's approval.

1. Merge the configs PR. Swap every branch URL to `main` and confirm each returns 200 — that is when instances can fetch them.
2. For inlined vars (hero banner, colour theme), regenerate the strings from the merged files (the converter above). URL vars (homepage highlights, asset URLs): the env value is the `main` raw URL. Navigation promo: the inlined string produced in phase 1.
3. Run the parent skill from **Read current state** through **Send, then hand over**.
4. **Teardown** — checkable, they fail silently when skipped:
   - demo destroyed: `gh workflow run cleanup.yml --ref <branch>`; hostname returns 404
   - temporary frontend branch deleted, local and remote
   - `git status` clean

The review-image cleanup is broken ([frontend#3638](https://github.com/blockscout/frontend/issues/3638)); hostname 404 is the bar, not image deletion.

**Done when:** the DevOps message is sent, the handover reply is posted, and every teardown box above is true.
