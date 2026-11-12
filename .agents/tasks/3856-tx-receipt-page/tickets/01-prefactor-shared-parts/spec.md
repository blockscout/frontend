# 01 — Prefactor shared parts

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 01 of #3856 |
| Blocked by | none |

## What to build

Four behaviour-preserving refactors that let the receipt tickets be pure additions. Nothing a user sees
changes: the transaction page, the header logo and every existing time stay exactly as they are.

- **Transaction query without the RPC fallback.** `useTxQuery` takes an option that turns the RPC-node
  fallback off while keeping the socket live update for a pending transaction. The default keeps today's
  behaviour.
- **Network logo image part.** The image part of `NetworkLogo` (image, placeholder fallback, dark-mode
  filter) becomes its own component that takes a chain config instead of reading the global one, and
  renders no link. `NetworkLogo` composes it with the global config.
- **Date-only and time-only formats.** `Time` gets two named formats in `FORMATS`: a date-only one
  (`Nov 04 2026`) and a time-only one that follows the user's local / UTC setting as the other formats do.
- **Reusable interpretation parts.** The template pipeline of `TxInterpretation` (`checkSummary` →
  `fillStringVariables` → `extractVariables` / `getStringChunks`) and its per-variable renderer
  (`TxInterpretationElementByType`) become usable from outside the component, and the variable renderer
  gains a no-link mode in which addresses, tokens, domains, the market (`dexTag`) and link variables
  render as plain content and send no click analytics. `TxInterpretation` keeps its output.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open a transaction page with an interpretation, one without, and the
home page (header logo), in light and dark mode

- [ ] `useTxQuery` with the fallback off never enables the RPC query; with the option absent its existing specs pass unchanged
- [ ] `NetworkLogo` renders the same markup as before; the image part accepts a chain config and has no link
- [ ] `Time` has the two new formats, both following the local-time setting; existing formats untouched
- [ ] `TxInterpretation` output is unchanged; the variable renderer in no-link mode renders no anchor for any variable type
- [ ] Unit tests cover the fallback switch, the two formats and the no-link mode; existing visual tests need no baseline update
- [ ] `(human)` The transaction page summary, the header logo and existing times look and behave as before

## Leaf worklist

- [ ] 1 `[agent]` `useTxQuery`: option to turn off the RPC fallback, with unit tests
- [ ] 2 `[agent]` Extract the `NetworkLogo` image part, taking a chain config
- [ ] 3 `[agent]` Add the date-only and time-only formats to `Time`, with unit tests
- [ ] 4 `[agent]` Make the interpretation template pipeline and variable renderer reusable, with a no-link mode and unit tests
