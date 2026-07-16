# Update token information tooltip copy

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3572 |
| Status | `done` |
| Size | `small` |
| Feature branch | `issue-3572` |
| PM | Ulyana (task author) |
| Designer | — |
| Backend | — |
| Slack channel | — (default routing per `to-spec`) |

## Context & goal

The token details page shows a green "certified" checkmark next to the token name when verified token
info exists. Its tooltip currently claims the info "has been verified by {chain name}", which oversells
the provenance: the info may be added manually or come from an external data provider. The task replaces
the tooltip copy with an accurate statement plus a link to the docs page explaining token info sources.

## Functional requirements

- The tooltip on the certified checkmark reads:
  "Token information was added manually or sourced from an external data provider."
  followed by a "More details" link.
- "More details" links to `https://docs.blockscout.com/using-blockscout/overviews/token-info`, opening
  externally. No UTM params (matches every other `docs.blockscout.com` link in the codebase).
- The link inside the tooltip is clickable — the toolkit `Tooltip` gets the `interactive` prop
  (see `src/slices/chain/indexing-status/IndexingStatusInternalTxs.tsx` for prior art).

## Data & API

None — no API, env var, or feature-flag changes.

## UI inventory

- Single surface: token details page title, [`src/slices/token/pages/details/TokenPageTitle.tsx:100`](../../../src/slices/token/pages/details/TokenPageTitle.tsx).
  Codebase-wide search confirmed no other component renders this tooltip.
- The tooltip content changes from a template string (interpolating `config.chain.name`) to JSX with a
  `Link external` — chain name no longer appears in the copy.

## Out of scope

- The checkmark icon itself (name, color, placement) — text-only change.
- Analytics: no Mixpanel event for the "More details" link.
- Demo deploy.

## Task breakdown

- [x] 1 `[agent]` Replace the tooltip copy in `TokenPageTitle.tsx` with the new text + "More details"
  external link; make the tooltip `interactive`. — Done: JSX tooltip content with `Link external` in
  `src/slices/token/pages/details/TokenPageTitle.tsx`; `tsc` and ESLint clean.

## Open questions

None.
