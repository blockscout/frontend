# Integrate PostHog for product analytics

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3754 |
| Feature branch | `issue-3754` |
| PM | Ulyana |
| Designer | — |
| Backend | — |
| Minimum API version | — |
| Slack channel | — |

## Context & goal

Product analytics today goes to Mixpanel only, and the Mixpanel module *is* the app's analytics API:
every call site imports it directly, and page views, identity, person profiles, and logout reset are all
Mixpanel-specific. An instance operator who wants PostHog instead of (or alongside) Mixpanel has no
option. The goal is PostHog as a second, optional, env-configured provider that receives exactly the
same data Mixpanel receives — page views, custom events, button clicks, identity and person
properties — so dashboards in either tool answer the same questions.

## Functional requirements

1. PostHog is enabled by a `NEXT_PUBLIC_POSTHOG_API_KEY` env var; a companion
   `NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES` (JSON subset of the SDK config) can only be set when the key
   is. Both are documented, validated, mocked and listed in `.env.example` like their Mixpanel
   counterparts.
2. PostHog is subject to the same gating as Mixpanel: off in private mode, and off when Usercentrics
   is configured and the user has not consented to the "PostHog" service.
3. Every event the app sends to Mixpanel — same event name, same property keys and values — is also
   sent to PostHog when it is enabled, including the GrowthBook "Experiment started" event. Enabling
   either provider alone, both, or neither works.
4. Page views reach PostHog as the SDK's native `$pageview` event, carrying the same properties the
   Mixpanel "Page view" event carries (page type, tab, page, source, color mode, color theme), fired on
   every route change by the app, not by the SDK's own pageview autocapture.
5. Identity and profile parity: the same uuid cookie is the distinct id; the same super-properties are
   registered on every event; the same person properties are set / set-once; logout resets the
   PostHog identity as it resets Mixpanel's.
6. SDK defaults when enabled: EU ingestion host, autocapture off, SDK pageview and pageleave capture
   off, session recording off, feature flags disabled, `localStorage` persistence. All overridable via
   the config-overrides env.
7. Events fired before the SDK chunk has loaded are buffered and replayed to every enabled provider
   with their original timestamp; a provider whose SDK fails to load is silently disabled for the page
   load without affecting the other.
8. The Content Security Policy allows PostHog hosts (script, connect, img) only when PostHog is
   enabled and not in private mode.
9. The analytics debug switch is `_analytics_debug` (query param and cookie) and turns on SDK debug
   logging for every enabled provider. The former `_mixpanel_debug` is removed, not aliased.
10. No analytics call site imports a vendor module; all go through a provider-neutral analytics
    facade. Event names, payload types and the page-type dictionary keep their current shape.

## Data & API

No backend API involved. Environment variables (next release, `v2.12.0+`):

- `NEXT_PUBLIC_POSTHOG_API_KEY` — PostHog project API key; presence enables the provider.
- `NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES` — JSON subset of the `posthog-js` config merged over the
  app defaults (FR6); requires the key.

Third-party references: `posthog-js` config and API docs
(https://posthog.com/docs/libraries/js/config, https://posthog.com/docs/libraries/js/features), CSP
guidance (https://posthog.com/docs/advanced/content-security-policy).

## UI inventory

No user-facing UI. Affected surfaces are invisible: the app-level analytics init in the page wrapper,
CSP headers, and the Usercentrics consent service list.

## Implementation decisions

- **Provider-neutral facade under `src/shared/analytics/`** owns the public API every call site uses:
  `logEvent`, `EventTypes` + payload types, `userProfile` (`set`, `setOnce`), `reset`, `useInit`,
  `useLogPageView`, `getPageType`. It is cross-cutting with no vendor owner, hence `shared`.
  `userProfile.increment` is dropped: no caller uses it and PostHog has no equivalent.
- **Providers are thin vendor wrappers under `src/services/`** — the existing Mixpanel module reduced
  to one, a new PostHog module as the other — each implementing one common provider interface:
  `init(options)` plus synchronous `track`, `identify`/`register`, `peopleSet`, `peopleSetOnce`,
  `reset`. Each has its own `config.ts` (consent + private-mode gated, exposed via
  `config.services.<provider>`), CSP policy, and Usercentrics service entry.
- **One buffer queue in the facade**, moved out of the Mixpanel module: one idle-deferred init loads
  every enabled provider's SDK chunk, runs its setup (super-props, identify, profile writes), then
  replays the buffer into each. Replay backdates events: Mixpanel via the `time` property, PostHog via
  the capture `timestamp` option. A provider whose init throws is disabled individually (FR7).
- **Page views** — the facade's `useLogPageView` emits one logical event; the PostHog provider maps the
  "Page view" name to `$pageview` and passes the properties through unchanged. All other events keep
  their name verbatim.
- **Call-site migration** is mechanical: every `import * as mixpanel from 'src/services/mixpanel'`
  becomes the facade import, usages renamed accordingly; done with `ast-grep` in one pass. Tests
  mocking the Mixpanel module move to mocking the facade or the provider as appropriate.
- **Debug flag** — the Mixpanel-specific query param and cookie are renamed to `_analytics_debug` in
  place (dev-only switch, no backward compatibility).
- **GrowthBook** keeps calling the facade, so experiment events fan out to both providers for free.
- **CSP** — a `posthog` policy adding `*.posthog.com` to `script-src`, `connect-src` and `img-src`
  (PostHog's own guidance: wildcard, since lazy-loaded bundles come from a separate assets subdomain).
- **Consent** — new `posthog` entry named "PostHog" in the Usercentrics services list; the CMP-side
  ruleset must list the same service name (Q01).

## Out of scope

- PostHog session recording, surveys, feature flags, toolbar, or using PostHog as a GrowthBook
  replacement — all explicitly disabled by default.
- Removing or deprecating Mixpanel.
- A single "analytics provider" switch env; providers are enabled independently by their own keys.
- Rolling the key out to deployed instances (operator / DevOps task after release).
- Google Analytics is untouched: it is a script tag with no event API and stays outside the facade.
