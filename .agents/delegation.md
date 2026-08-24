# Delegation boundary

This is a **living document**. It records what work agents are trusted to do in this repo *today*, and what
stays with a human developer for now. The `to-tickets` skill consults it when tagging a ticket's leaves
`[agent]` or `[human]`; the `implement-ticket` skill obeys it when executing. As the repo becomes more
agent-friendly, loosen the boundary here via a normal PR — don't renegotiate it per task.

## Agents may do today

- API resources and response types (`add-api-resource` skill), including sampling live responses (`resolve-api-url`).
- Environment variables and feature configs (`add-env-var` / `deprecate-env-var` skills).
- Page scaffolding and route plumbing — navigation, metadata, guards, route types, sitemap, page-type
  analytics (`add-new-page` skill).
- Data wiring: hooks, query integration, rendering fetched data plainly.
- Component **scaffolds** — file placement, props and types, data fetching, behavioral states
  (loading / empty / error / pagination), semantic structure built from existing toolkit components, and
  placeholder presentation. Every deferred visual decision is marked `TODO (design):` (the convention the
  `add-new-page` templates use), which is what makes the handover to a human explicit.
- Unit tests (`*.spec.ts` / `*.spec.tsx`) and Playwright test **scaffolds** (`*.pw.tsx` files, fixtures, mock data).
- Glossary and docs updates, demo deploys (`deploy-demo` skill).

## Humans only, for now

- Final markup and styling that must match the designer's Figma mockups; visual polish of any kind.
- Choosing nav/sprite icons and other visual assets.
- Generating and eyeballing Playwright screenshot baselines — and only **once the component matches the
  mockup**, because a baseline of placeholder presentation is worse than no baseline at all.
- Design sign-off.
