# Share the currency rounding and render interpretation summaries as plain text

| | |
| --- | --- |
| Parent spec | [../../spec.md](../../spec.md) — step 2 of #3593 |
| Status | `done` |
| Size | `medium` |
| Sub-branch | — (single commit on `issue-3593`) |
| PM | Ulyana (task author) |
| Designer | — |
| Backend | — |

## Context & goal

The transaction interpretation summary is a template with typed variables that only `TxInterpretation`
knows how to render — as React elements. The OG description needs the same content as a plain string.

The issue pins the amounts to the UI ("including … amount rounding"), and that rounding is four magic
thresholds living inline in `TxInterpretationElementByType`'s `currency` case. Copy-pasting them would
guarantee drift the first time someone tunes a threshold, so this subtask extracts them into a shared
function that the component then calls, and adds a plain-text renderer beside it.

## Functional requirements

- `formatCurrencyValue(value)` produces exactly what the UI shows today — the ladder from
  `src/features/tx-interpretation/common/components/TxInterpretation.tsx:128`:

  | range | output |
  | --- | --- |
  | `< 0.1` | `BigNumber(value).toPrecision(2)` |
  | `< 10000` | `BigNumber(value).dp(2).toFormat()` |
  | `< 1000000` | `BigNumber(value).dividedBy(1000).toFormat(2) + 'K'` |
  | otherwise | `BigNumber(value).dividedBy(1000000).toFormat(2) + 'M'` |

  `TxInterpretation` calls it instead of holding its own copy; its rendered output must not change.
- `summaryToPlainText(summary)` returns the summary as a single-line string, or `undefined` when
  `checkSummary` rejects it — the same gate the UI uses to render nothing.
- Each variable type maps to the text its UI counterpart displays:

  | type | text |
  | --- | --- |
  | `string` | verbatim (already inlined by `fillStringVariables`) |
  | `currency` | `formatCurrencyValue(value)` |
  | `token` | `symbol ?? name ?? 'Unnamed token'` — matches `TokenEntity onlySymbol` |
  | `address` | `addressToPlainText(value)` (below) |
  | `domain` | verbatim |
  | `method` | verbatim (the badge's text) |
  | `dexTag` | `value.name` |
  | `link` / `external_link` | `value.name`; the URL is dropped |
  | `timestamp` | `dayjs(Number(value) * SECOND).format('MMM DD YYYY')` — the UI's variable format, **not** the OG description's own timestamp format |
  | `native` / `wei` | `currencyUnits.ether` / `currencyUnits.wei` |

- `getAddressName(address)` owns the name chain `AddressEntity`'s `Content` resolves — metadata `name`-type
  tag (via `getTagName`) ?? `ens_domain_name` ?? `name`, `undefined` when the address has no name. It lives
  in the address slice and the entity component calls it, so the two cannot drift.
- `addressToPlainText(address)` composes that with the hash fallback (`shortenString(hash, 8)`, what
  `truncation="constant"` resolves to). It is exported because subtask 3's fallback action branch needs it
  twice in one template string.
- Whitespace comes out clean: single spaces between parts, no leading or trailing space. Against the
  production sample in the parent spec the result is exactly `Swap 2.92M SPERPS for 0.016 WETH`.

<!-- cspell:ignore SPERPS -->

## Data & API

None — operates on `TxInterpretationSummary` (`src/features/tx-interpretation/common/types/api.ts`), which
covers all ten variable types.

## UI inventory

- `src/features/tx-interpretation/common/components/TxInterpretation.tsx` — its `currency` case now
  delegates. No other change; do not restructure the component to be render-agnostic.
- New files in `src/features/tx-interpretation/common/utils/` (kebab-case, matching siblings elsewhere in
  the repo): the currency formatter, the plain-text renderer, the address-to-text helper.
- `src/slices/address/utils/get-address-name.ts` — the address name chain, extracted from `AddressEntity`
  so both the entity and the plain-text renderer read from one place.

## Out of scope

- Noves (`createNovesSummaryObject`) — parent Q1, and it wouldn't reuse this anyway: Noves prose is already
  a finished sentence.
- Making `TxInterpretationElementByType` itself render-agnostic — the one-line mappings above are cheaper
  inlined in the new util than abstracted out of a working component.

## Task breakdown

- [x] 1 `[agent]` Extract the currency ladder into a shared function and call it from `TxInterpretation`
  — `common/utils/format-currency-value.ts`.
  - inputs:
    - Signature `(value: string) => string`. Keep `BigNumber` as the implementation — same import, same
      thresholds, same order of comparisons.
    - The component's `currency` case becomes `<chakra.span>{ formatCurrencyValue(value) + ' ' }</chakra.span>` —
      the trailing space is the component's spacing concern and stays there, out of the shared function.
- [x] 2 `[agent]` Add `addressToPlainText`
  — `common/utils/address-to-plain-text.ts` over the extracted `slices/address/utils/get-address-name.ts`.
  - inputs:
    - Extract `AddressEntity`'s `Content` name chain into the address slice and call it from both the
      component and the new helper, which appends the `shortenString(hash, 8)` fallback.
    - Ignore the proxy-implementation branch (`AddressEntityContentProxy`) and the bech32/Filecoin alt-hash
      handling — both are display concerns driven by client-side user settings, unavailable server-side.
- [x] 3 `[agent]` Add `summaryToPlainText`
  — `common/utils/summary-to-plain-text.ts`.
  - inputs:
    - Return `undefined` when `!checkSummary(template, variables)`.
    - Reuse the existing `fillStringVariables` → `extractVariables` → `getStringChunks` pipeline from
      `../utils/utils` so the parsing stays identical to the component's.
    - Assemble parts (trimmed chunk, then that index's variable text), drop empties, join with a single
      space, then collapse runs of whitespace and trim. Don't try to replicate the component's per-element
      trailing spaces.
    - Handle `native` / `wei` by name before the type switch, exactly as the component does.
- [x] 4 `[agent]` Unit tests
  — a spec per new util; the timestamp assertion pins `TZ` to UTC via `vi.stubEnv`.
  - inputs:
    - Reuse `txInterpretation` from `src/features/tx-interpretation/blockscout/mocks.ts` (it exercises
      `string`, `currency`, `token`, `address`, `timestamp` in one template) and `TX_INTERPRETATION` from
      `blockscout/stubs.ts`.
    - Cover the four rounding branches at their boundaries, the name chain (name tag / ENS / name / none)
      beside `getAddressName`, `checkSummary` rejection returning `undefined`, and the whitespace result.
    - Skip tests that only assert the mock or `BigNumber` itself.

## Open questions

None. (Parent Q1 does not affect this subtask.)
