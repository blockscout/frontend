# Ticket 05 — calibration notes

## Full-repo distribution (leaf 4)

Run: `pnpm test:code-complexity` (full repo, whole-suite vitest coverage), `?.` not counted
(ADR 0004), under the new **per-function** `jsx`/`behavior` classification and CRAP applicability.

**Population:** 6538 functions total — **2265 `jsx`**, **4273 `behavior`**. Every `behavior`
function now carries a CRAP score (they used to be gated only when their file qualified); most sit
at 0% coverage because whole-suite vitest coverage only reaches specs that exist.

### `jsx` complexity (render bodies) — n=2265

| p50 | p90 | p95 | p99 | max |
|----:|----:|----:|----:|----:|
| 2 | 9 | 13 | 23 | 120 |

Count above candidate caps: `>20` → 32, `>25` → 16, `>30` → 10, `>35` → 7.

Top: `TxDetails` 120, `BlockDetails` 85, `SearchResultTableItem` 77, `AddressPageContent` 56,
`SearchResultListItem` 49, `AddressDetails` 48, `TxsStats` 43, `Stats` 35, `AddressTokens` 34.

### `behavior` complexity (handlers / hooks / utils) — n=4273

| p50 | p90 | p95 | p99 | max |
|----:|----:|----:|----:|----:|
| 1 | 4 | 6 | 11 | 48 |

Count above candidate caps: `>10` → 51, `>12` → 33, `>15` → 18, `>20` → 6.

Top: `useNavItems` cb 48, `prepareRequestBody` 26, `getFromTo` 23, `useValidateField` cb 22,
`transformFullDirectoryData` 22, `Address` cb 21, `useEtherscanRedirects` cb 20.

### `behavior` CRAP — n=4273 (all behavior functions scored)

| p50 | p90 | p95 | p99 | max |
|----:|----:|----:|----:|----:|
| 2 | 20 | 30 | 110 | 2352 |

Count above candidate caps: `>30` → 201, `>40` → 198, `>50` → 131, `>60` → 89, `>80` → 66.

**Note on the CRAP tail:** it is dominated by 0%-coverage functions, where CRAP = c²+c. So a cap of
50 ≈ "behavior complexity ≥ 7 while untested" (7²+7 = 56), a cap of 80 ≈ complexity ≥ 8 untested
(8²+8 = 72 is under; 9²+9 = 90 is over), etc. Whole-repo counts are large because most of the repo
has no unit test — but the **CI gate is diff-scoped**, so these are the repo-wide report totals, not
what any single PR would face.

## Chosen thresholds (leaf 5 — human)

- **`DEFAULT_MAX_COMPLEXITY_JSX` = 30** (conservative backstop). p99 of the `jsx` population is 23;
  `>30` flags **10** functions — the unambiguous giant render bodies (`TxDetails` 120, `BlockDetails`
  85, `SearchResultTableItem` 77, `AddressPageContent` 56, …). Set above the 26–29 composite
  components (`SearchBarInput`, `TokenTransferListItem`) so it nags "decompose this," not "this is a
  normal composite." Playwright covers rendering, so this is the only `jsx` gate and it stays high on
  purpose — lowering it would push people toward condition-swallowing refactors.

- **`DEFAULT_MAX_COMPLEXITY_BEHAVIOR` = 12** (aggressive). ~p99 of the `behavior` population (max 48);
  `>12` flags **33** functions of 4273 — real branchy logic (`prepareRequestBody` 26, `getFromTo`
  23, `useValidateField` 22, the switch/dispatch tail). Held at 12 rather than 10 deliberately: the
  11–15 band is dominated by wide-but-shallow code (`??`/`||` defaulting chains, flat `if`-ladders,
  `type→value` switches) that a reviewer needn't pause on, so 10 would trade signal for noise.
  (This raw cap is a stopgap: ticket 06 replaces it with a Cognitive-Complexity cap, which models
  "hard to read" — flat switches +1, nesting penalised — far better than cyclomatic for this axis.)

- **`DEFAULT_MAX_CRAP` = 80** (raised from the pre-ticket 50). The new per-function applicability
  brings every `behavior` function into the CRAP population, most at 0% coverage, where CRAP ≈ c²+c.
  So the cap reads as a complexity floor for untested code: 50 ≈ CX ≥ 7 untested (131 functions), 80
  ≈ CX ≥ 9 untested (66). 80 keeps CRAP aimed at genuinely complex-and-untested code and pairs with
  the behavior cap of 12 — a function in the 9–12 band that is untested is still caught by CRAP,
  while ordinary untested low-complexity code stays quiet. Counts are repo-wide report totals; the
  CI gate is diff-scoped, so no single PR faces them.

All three calibrated with `?.` not counted (ADR 0004) and are coupled — re-tune together against a
fresh full-repo run, never in isolation.
