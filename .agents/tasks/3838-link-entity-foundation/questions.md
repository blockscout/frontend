# Open questions — Revise the link-entity foundation

No open questions at spec time. Every decision was settled in the grilling session; see the
spec's "Implementation decisions". Add entries here with a stable id (`Q01`, `Q02`, …) if one
arises during ticketing or implementation.

## Settled at ticketing

Decisions the developer made in the `to-tickets` session; no outside owner, no thread.

| Id | Decision | Status |
| --- | --- | --- |
| Q01 | Profile scenarios: `eth` preset, the two URLs in ticket 01 Details; a human records them in React DevTools. Re-resolved in ticket 10: `eth` was unavailable (DB outage) when the after profile was due, so both sides were re-recorded on the `robinhood` preset, URLs in `tickets/10-after-profile/notes.md`. | resolved |
| Q02 | Parent-chain `chain=` maps to a shield-less chain so L1 entities stay link-only (FR1 wins over FR5's shield for the parent chain). | resolved |
| Q03 | `TokenEntityExternal`'s shield-only-when-multichain quirk is preserved; it lives in the surviving `TokenEntityInterchain`. | resolved |
| Q04 | `AddressEntityInterchain` survives as the carrier of the `currentAddress` → `noLink` rule; not shifted to call sites. | resolved |
| Q05 | Collapsed `truncation`: the string union plus `{ type: 'dynamic'; tailLength }` and `{ type: 'constant'; maxSymbols }`. | resolved |
| Q06 | `defineEntity.icon` may return an icon name or a React element (TacOperation pending spinner). | resolved |
| Q07 | `TxEntityInterchain` survives (ticket 09): it carries the unlinkable-chain rule — an unknown `source_chain` / `destination_chain` renders unlinked, where a plain `TxEntity` would link to the current chain. Kept beside its Address and Token siblings, not pushed onto the 10 cross-chain call sites. | resolved |
