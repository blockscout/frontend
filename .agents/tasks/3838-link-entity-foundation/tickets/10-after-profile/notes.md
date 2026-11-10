# Notes — 10

## Instance switch: eth → robinhood

The ticket 01 baseline is on `eth`, but on the recording days (2026-11-09/10) `eth.blockscout.com`'s
database was unhealthy: both scenario endpoints timed out at 60 s (the token transfers one returned a 500
once). The render delta needs the same rows on both sides — per-component self time is summed over
instances, and the instance mix follows the row data (contract names, tags, token types, method badges) —
so switching the instance means re-recording the baseline on it too; the `eth` exports of ticket 01 are
not comparable to anything recorded here. Q01 in `questions.md` is updated accordingly.

Scenarios on the `robinhood` preset (`https://robinhoodchain.blockscout.com`), 50 rows each:

- txs list: `/txs?page=2&next_page_params=%257B%2522index%2522%253A3%252C%2522filter%2522%253A%2522validated%2522%252C%2522block_number%2522%253A110819773%257D`
- token transfers list: `/token-transfers?page=9&next_page_params=%257B%2522index%2522%253A60%252C%2522block_number%2522%253A110820026%257D`

## Builds

Both are `pnpm prod:preset robinhood --profile` (Turbopack, `next build --profile`, profiling `react-dom`
aliased in), the same flavor on both sides.

- **After**: commit `45c83e40de0dd76f2bffeb73e5ee36eca97bbc72` (`45c83e40d`, tip of `issue-3838` after
  ticket 09), clean working tree, served on `localhost:3000` from this worktree. Build log:
  `.ai/tmp/prod-profile-build-after.log`.
- **Before**: commit `74e7fe520d5e3dce1c9e23304735eddc75704dc9` (`74e7fe520`, the ticket 01 SHA, before any
  foundation change) in a detached worktree (`.claude/worktrees/link-entities-before`), plus the one file
  ticket 01 also carried uncommitted at build time — `tools/dev-server/prod.preset.sh` from `8f189968f`, so
  `--profile` builds with Turbopack. No `src/` change; the measured code is the SHA's. Served on
  `localhost:3001`; the worktree was removed after the recordings. Build log:
  `.ai/tmp/prod-profile-build-before.log`.

Exports (git-ignored, in this worktree's `.ai/tmp/`):

- `robinhood-after-txs-list.json`, `robinhood-after-token-transfers.json`
- `robinhood-before-txs-list.json`, `robinhood-before-token-transfers.json`

## Verdict: FR7 met — the 50-row render is faster in both scenarios

Every trace has the same commit structure as in ticket 01: page shell, 20-row skeleton commit, 20-row
real-data commit, then three lazy-render reveal commits of ~10 rows (`useLazyRenderedList`). The 50 rows of
FR7 are rendered by the data commit plus the three reveals, so the row for "50 rows" below sums those four.
The analyzer defaults to the biggest commit (the skeleton one); the data commit was selected with `--commit`.
Full outputs: `.ai/tmp/robinhood-txs-list.delta.txt`, `.ai/tmp/robinhood-token-transfers.delta.txt`.

### Commit durations (ms)

| Commit | txs before | txs after | Δ | token transfers before | token transfers after | Δ |
| --- | --- | --- | --- | --- | --- | --- |
| Page shell | 50.9 | 51.1 | +0.2 | 49.3 | 49.3 | 0.0 |
| Skeleton, 20 rows | 113.0 | 114.8 | +1.8 | 101.9 | 87.3 | −14.6 |
| Real data, 20 rows | 64.2 | 70.7 | **+6.5** | 87.0 | 82.7 | −4.3 |
| Reveal 1 | 28.6 | 21.6 | −7.0 | 38.7 | 36.2 | −2.5 |
| Reveal 2 | 35.5 | 32.9 | −2.6 | 42.5 | 18.1 | −24.4 |
| Reveal 3 | 33.6 | 29.2 | −4.4 | 38.0 | 18.2 | −19.8 |
| **50 rows (data + reveals)** | **161.9** | **154.4** | **−7.5 (−4.6 %)** | **206.2** | **155.2** | **−51.0 (−24.7 %)** |
| Fibers in the data commit | 7412 | 6620 | −11 % | 6742 | 5842 | −13 % |

The page-shell commit renders no entity and is within 0.2 ms on both sides, so the recordings are
comparable; the row-only reveal commits are faster after in all six cases.

### The one worse number: the txs real-data commit, +6.5 ms

Single sample, so part of it is noise, but the per-component delta is legible (same instance counts on
both sides unless noted):

```
component                         before ms (inst) | after ms (inst) | Δ
A (minified fn)                       5.5 (1836)   |    0.2 (1330)   | −5.3   ← the removed chakra() layer
chakra(Component)                     7.0  (587)   |    1.9  (121)   | −5.1   ← same
chakra(span)                          5.5  (266)   |   10.0  (266)   | +4.5
ForwardRef(Anonymous)                 5.7 (1329)   |    9.3 (1329)   | +3.6
Button                                1.0   (85)   |    3.8   (85)   | +2.8
Box                                   0.5   (48)   |    2.6  (128)   | +2.1   ← +80 = the new entity Container per Address entity
AddressEntity.{Container,Icon,Root,Link,Content,Copy}   —   |    2.9 (6×40)  | +2.9   ← the parts, now named
BlockEntity.{Root,Link}, TxEntity.{Icon,Content}         —   |    0.9         | +0.9
```

Reading: the `chakra()` wrapper cost (≈10 ms) is gone and about the same amount reappears spread over the
leaf Chakra elements (`chakra(span)`, `ForwardRef(Anonymous)`, `Button`) that now receive the style props
the wrapper used to resolve, plus ≈4 ms of named entity parts that used to be inside the anonymous
functions. Nothing points at a single regressing entity component: the Address, Block and Tx parts together
are under 4 ms for 100 entities, and the same entities render faster in the reveal commits of the same
trace. The token transfers data commit, with the same Address/Token/Tx entities, is 4.3 ms faster.

### Token transfers real-data commit, top of the delta

```
component                         before ms (inst) | after ms (inst) | Δ
chakra(Component)                    12.0  (573)   |    1.9   (62)   | −10.1
Link                                  1.5   (81)   |    7.4   (81)   | +5.9
chakra(span)                          9.6  (148)   |    5.0  (148)   | −4.6
chakra(div)                           8.1  (259)   |    5.6  (178)   | −2.5
chakra(a)                             2.6   (81)   |    4.2   (81)   | +1.6
Box                                   1.9   (74)   |    3.4  (155)   | +1.5
AddressEntity.* / TokenEntity.Link / TxEntity.*          —   |    2.8         | +2.8
```

### Follow-up candidates (out of this task's scope)

Not regressions, but where the remaining entity cost sits after the revision, for the perf work the spec
defers to this data: the toolkit `Link` (0.09 ms avg in the token transfers commit vs 0.02 before — worth a
second sample before acting), and `ForwardRef(Anonymous)` / `chakra(span)` on the txs list, which are the
Chakra leaf elements under `Truncate` and the copy button.
