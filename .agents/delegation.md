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
  placeholder presentation.
- Final markup and styling to the mockup, which should **always** be verified by the developer.
- Unit tests (`*.spec.ts` / `*.spec.tsx`) and Playwright test **scaffolds** (`*.pw.tsx` files, fixtures, mock data).
- Glossary and docs updates, demo deploys (`deploy-demo` skill).
- Resolving agent-review findings and pushing the fixes, within the review loop's rules (`resolve-review
  --auto`): fix / reject / defer per its verdict rules, and stop on anything that needs a human.
- Fixing a red CI run inside the review loop (`review-loop/ci-fixes.md`), including updating a Playwright
  baseline when the diff is explained by a spec requirement the commit cites; any other visual diff, and
  any fix that changes behaviour or restructures beyond the finding, stops for a human.
- Design readouts from Figma nodes (`design-readout` skill) — recognition only, never implementation.

## Humans only, for now

- Visual polish of any kind, and any visual asset the readout did not recognize and the spec does not name.
- Generating and eyeballing Playwright screenshot baselines, beyond the cited-requirement case above — and
  only **once the component matches the mockup**, because a baseline of placeholder presentation is worse
  than no baseline at all.
- Design sign-off.
