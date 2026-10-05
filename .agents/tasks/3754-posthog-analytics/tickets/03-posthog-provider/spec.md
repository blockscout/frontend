# 03 — PostHog provider

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #3754 |
| Blocked by | T02 |

## What to build

An operator sets `NEXT_PUBLIC_POSTHOG_API_KEY` and every event the app already sends to Mixpanel also
lands in their PostHog project: page views as native `$pageview` with the same properties, custom events
and button clicks under their verbatim names, the uuid cookie as distinct id, the same super-properties
and person properties, and a reset on logout. The provider is off in private mode and without
Usercentrics "PostHog" consent, ships with the FR6 defaults (EU host; autocapture, SDK pageview,
pageleave, session recording and feature flags off; `localStorage` persistence), all overridable through
`NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES`, and the CSP admits PostHog hosts only when it is enabled.

## Acceptance criteria

- [ ] Both env vars are documented in `docs/ENVS.md` (new "PostHog" subsection after "Mixpanel", version
      `upcoming`), validated in `deploy/tools/envs-validator/schemas/services.ts` with a `requires` rule
      for the overrides, covered in `services.spec.ts` (accepted; overrides-without-key rejected; invalid
      JSON rejected), present in both mock blocks of `mocks/instance.ts` and in `.env.example`.
- [ ] `src/services/posthog/config.ts` exposes `{ apiKey, configOverrides }` via `config.services.posthog`;
      `apiKey` is `undefined` in private mode or when Usercentrics is configured and `consent.posthog` is
      not `true`. `SERVICES.posthog = { name: 'PostHog' }` and `CONSENT_RESULT_ALL_ACCEPTED.posthog = true`
      in `src/services/usercentrics/services.ts`.
- [ ] `src/services/posthog/provider.ts` implements `AnalyticsProvider` over `posthog-js`: `init` calls
      `posthog.init(apiKey, { api_host: 'https://eu.i.posthog.com', autocapture: false,
      capture_pageview: false, capture_pageleave: false, disable_session_recording: true,
      <feature-flags / remote-config disabled per the installed version's option names>,
      persistence: 'localStorage', debug, ...configOverrides })`; `track` maps `EventTypes.PAGE_VIEW` to
      `$pageview` and passes every other name verbatim, forwarding `{ timestamp }` on replay; `register`
      → `posthog.register`, `identify` → `posthog.identify`, `peopleSet` / `peopleSetOnce` →
      `posthog.setPersonProperties(set, setOnce)`, `reset` → `posthog.reset()`.
- [ ] `useInit` adds the PostHog provider when `config.services.posthog.apiKey` is set; both providers
      share the one init, setup and buffer from T02 (no queue change).
- [ ] `src/server/csp/policies/posthog.ts` returns `{}` without key or in private mode, else adds
      `*.posthog.com` to `script-src`, `connect-src`, `img-src`; registered in `policies/index.ts` and
      `generateCspPolicy.ts`; `posthog.spec.ts` follows `re-captcha.spec.ts` (enabled / no key / private).
- [ ] `src/services/posthog/provider.spec.ts` (mocking `posthog-js`) asserts the FR6 init config, the
      overrides merge, the `$pageview` mapping, timestamp forwarding and the person-property calls.
- [ ] Agent runtime check, dev server up with the key set: `curl -sI localhost:3000` shows
      `*.posthog.com` in the three CSP directives; a Playwright MCP session (`browser_navigate`, then
      `browser_console_messages` + `browser_network_requests`) across 2–3 route changes shows no
      `Refused to …` CSP message and one 2xx request to `eu.i.posthog.com` per navigation whose payload
      contains `$pageview` with `Page type`, `Tab`, `Color mode`, `Color theme`; Mixpanel requests still
      go out alongside.
- [ ] Agent data check through the PostHog MCP (connected in user scope, project "Blockscout", EU):
      `call execute-sql` with a HogQL query over `events` for the last 15 minutes returns the `$pageview`
      rows plus at least one custom event (e.g. `Button click`), with `distinct_id` equal to the browser's
      `uuid` cookie and the `Chain id` / `Environment` super-props present. Follow the MCP's schema-first
      rule (`info execute-sql`, `read-data-schema` for events) before querying.
- [ ] `posthog-js` is pinned to an exact version like `mixpanel-browser` and loaded as a lazy chunk, not
      in the main bundle (check the network tab or `pnpm build` output). Dependency approved by the
      developer at ticket time; no sign-off step.
- [ ] `pnpm lint:eslint`, `pnpm lint:tsc`, `pnpm test:vitest` (incl. `deploy/tools/envs-validator`),
      `pnpm test:code-complexity` pass.

## Details

- `posthog-js` option names: read the installed version's `PostHogConfig` type; the FR6 intent is
  autocapture off, SDK pageview + pageleave off, session recording off, feature flags / remote config
  off, `localStorage` persistence, EU host.
- Q01 (Usercentrics ruleset must list "PostHog") does **not** block this ticket: a ruleset without the
  entry yields `consent.posthog === undefined`, so the provider stays off on CMP instances until the
  ruleset is updated — safe by construction. Mention it in the PR as a rollout prerequisite.
- The dev server layers `.env.local` on top of the preset (`tools/dev-server/CONTEXT.md`, "Env
  layering"); never print or copy the key.
- Runtime checks run against `pnpm dev:preset eth` (your `.env.local` already carries
  `NEXT_PUBLIC_POSTHOG_API_KEY` and is layered on top of the preset) at `http://localhost:3000`.
- PostHog MCP is already registered (user scope, `https://mcp-eu.posthog.com/mcp`, OAuth). If a fresh
  session shows it disconnected, `/mcp` → `posthog` → authenticate. The ingestion key in `.env.local`
  cannot query; the MCP has its own auth.

## Skill inputs

### `add-env-var` — `NEXT_PUBLIC_POSTHOG_API_KEY`

- Value type: primitive (string)
- External URL?: no — but the SDK talks to `*.posthog.com`, so Step 4 (CSP) applies, gated on the key being set and not private mode
- Mode: default and multichain (same as the Mixpanel vars; rule lives in `schemas/services.ts`)
- Docs: External services → new "PostHog" subsection after "Mixpanel" (plus the TOC entry); description "Project API key for [PostHog](https://posthog.com/) product analytics"; Compulsoriness `-`; Default `-`; Example `<your-secret>`; Version `upcoming`
- Config home: `src/services/posthog/config.ts`, exported from `src/config/services.ts` as `posthog` (alphabetical)
- Private mode: service config — key `undefined` in private mode and without consent (mirror `src/services/mixpanel/config.ts`)
- Asset URL (Step 5): no

### `add-env-var` — `NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES`

- Value type: JSON-encoded string (`Partial<PostHogConfig>`)
- External URL?: no
- Mode: default and multichain
- Docs: same subsection; description "JSON-like string with a subset of the [posthog-js config](https://posthog.com/docs/libraries/js/config) merged over the app defaults"; Compulsoriness `-`; Default `-`; Example `{"disable_session_recording": false}`; Version `upcoming`
- Validator: `v.optional(envJson(v.record(v.string(), v.unknown())))` + `requires('NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES', 'NEXT_PUBLIC_POSTHOG_API_KEY', …)` with the Mixpanel message pattern
- Private mode: non-identifying, may stay populated
- Asset URL: no

## Leaf worklist

- [ ] 1 `[agent]` Add `NEXT_PUBLIC_POSTHOG_API_KEY` (docs, config, validator, mocks, `.env.example`) — skill: `add-env-var`
- [ ] 2 `[agent]` Add `NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES` with the `requires` rule — skill: `add-env-var`
- [ ] 3 `[agent]` Consent + CSP: `posthog` entry in Usercentrics `SERVICES`, `posthog` CSP policy + spec, register in `generateCspPolicy`; add the pinned `posthog-js` dependency
- [ ] 4 `[agent]` Implement `src/services/posthog/provider.ts` (+ `provider.spec.ts`) and register it in `useInit`
- [ ] 5 `[agent]` Runtime verification with the Playwright MCP (console + network) and the PostHog MCP HogQL data check; lint, tsc, vitest, complexity gate
