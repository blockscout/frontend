# Review — 06 Point the search surfaces at the v2 shape

## Subtask 06 — Point the search surfaces at the v2 shape

| | |
| --- | --- |
| Reviewed | `61438c9e4` → working tree |
| Round | 2 of 3 |
| Findings | 0 blocker · 6 major · 2 nit — 7 fixed, 1 deferred, 0 open |
| By axis | Spec 2 · Standards 4 · Correctness 2 |
| Outcome | `clear` |

Checks run in this context, all clean: `pnpm lint:tsc`, `pnpm lint:eslint` (0 errors; 7 pre-existing
`playwright/no-skipped-test` warnings in files this diff does not touch), `pnpm lint:cspell`,
`pnpm test:vitest --changed` (10 files / 44 tests).

Two decisions were checked against their evidence and hold, so they are **not** findings:

- Keeping the feature-owned `SearchResultTacOperation` / retyping it. The generated
  `SearchResultTacOperation` in `node_modules/@blockscout/api-types/dist/public.schema.ts:3296` is indeed
  flattened (no `tac_operation` wrapper, no `priority`) with `type: "tac_operation"` and the doc comment
  *"(enum property replaced by openapi-typescript)"*, so the route is unrecoverable from it. Keeping the
  feature-owned type and the `Exclude` in `src/slices/search/types/api.ts` is exactly what
  `src/api/CONTEXT.md`'s "Feature-owned sub-types for data the Core API only proxies" prescribes.
- The nullability widening. `getTacOperationStatusTooltip` already guards with `errorReason ? … :
  FAILURE_TOOLTIP`, so `null` cannot leak into the tooltip; `sender?: … | null` and `error_reason?: string
  | null` match the generated schema's `nullable: true` fields field-for-field, and `timestamp: string`
  matches `schemas['Timestamp'] = string`.

### F1 · major · Spec — `src/features/chain-variants/tac/components/SearchBarSuggestTacOperation.tsx:23`

**Claim.** The suggest row passes `isRollback={ data.tac_operation.rollback }` into the tag but renders no
sibling rollback badge, while both search-results rows now do
(`{ data.tac_operation.rollback && <Badge>Rollback</Badge> }`) and so do all four sites committed in 03–05.
The tag's rollback tooltip is the only remaining carrier here, and
`getTacOperationStatusTooltip` returns `null` unless `status === failed` — so a rollback whose status is
`success` or `pending` shows **no** rollback signal at all in the suggestion row. Under v1 this row rendered
a tag reading `Rollback`, so it is a regression against parent-spec requirement 5 ("`rollback: true` renders
as a separate tag beside the status tag, never as a fourth status value") and requirement 12 ("No regression
in search (`q`), …").

**Suggested fix.** Render the rollback badge beside `status` in both the mobile and desktop branches, as the
two results rows do (and see F3 — it should come from a feature-owned component).

**Status.** `fixed`

- R2 reviewer: verified — the badge sits in the shared `status` fragment (`SearchBarSuggestTacOperation.tsx:31`), which both the mobile (`:41`) and desktop (`:53`) branches render, so a `success`/`pending` rollback is visible in both.

### F2 · major · Correctness — `src/slices/search/pages/search-results/SearchResultListItem.tsx:263`

**Claim.** Neither the tag nor the badge shows a loading skeleton: `<TacOperationStatus status={…} type={…}
errorReason={…} isRollback={…}/>` omits `isLoading`, and `{ data.tac_operation.rollback &&
<Badge>Rollback</Badge> }` (line 269) omits `loading`. `isLoading` is in scope and is threaded to
`TacOperationEntity.Link` two lines above, and every committed sibling threads both — e.g.
`src/features/chain-variants/tac/pages/operations/TacOperationsTableItem.tsx:32` (`isLoading={ isLoading }`)
and `:34` (`<Badge loading={ isLoading }>`). Reachable in practice:
`src/slices/search/pages/search-results/SearchResults.tsx:124` sets `isLoading = marketplaceApps.isPlaceholderData || isPlaceholderData`,
so real tac rows render solid tags among skeletons whenever the marketplace query is still on placeholder
data. Same defect at `src/slices/search/pages/search-results/SearchResultTableItem.tsx:381` and `:387`.

**Suggested fix.** Pass `isLoading={ isLoading }` to `TacOperationStatus` and `loading={ isLoading }` to the
badge in both files.

**Status.** `fixed`

- R2 reviewer: verified — `isLoading` on the icon and the tag, `loading` on the badge, in both rows (`SearchResultListItem.tsx:249,268,270`; `SearchResultTableItem.tsx:367,386,388`).

### F3 · major · Standards — `src/slices/search/pages/search-results/SearchResultListItem.tsx:269`

**Claim.** `{ data.tac_operation.rollback && <Badge>Rollback</Badge> }` — the search **slice** now
hand-renders a tac **feature** entity's badge, duplicated verbatim at `SearchResultTableItem.tsx:387`.
`src/slices/CONTEXT.md` ("Child-slice ownership"): "The slice that owns an entity owns its **rendering** —
tables, lists, detail panels, types. Other slices or features that surface the entity … import those views;
they never reimplement them." The four sites that inline this badge today all live *inside* the feature, so
this diff is the first place the rule actually bites — and it lands in the same change that deleted
`TacOperationRollbackTag`, the component that owned this rendering.

**Suggested fix.** Render the rollback badge from a tac-feature component in both slice rows (reuse
`TacOperationTag` with `isRollback`, or export a small feature-owned badge) rather than inlining `Badge`.

**Status.** `fixed`

- R2 reviewer: verified (accepted half) — both rows render the feature-owned `TacOperationRollbackTag`; no slice hand-renders tac markup. The reinstated component is equivalent to the inline `<Badge loading>Rollback</Badge>` it replaced (default palette, `BadgeProps` spread), and its dropped tooltip is deliberate — the rollback wording travels via `isRollback`, which every call site passes.

### F4 · major · Standards — `src/features/chain-variants/tac/types/api.ts:10`

**Claim.** `TacOperationSearchPayload` re-declares field-for-field what
`@blockscout/tac-operation-lifecycle-types` already exports as `V2OperationBriefDetails`
(`operation_id`/`type`/`status`/`rollback`/`timestamp`/`sender`/`error_reason`, dist `…/v2/tac-operation-lifecycle.d.ts:50`),
differing only in `null` vs absent — and `sender?: { address: string; blockchain: tac.V2BlockchainType }`
re-inlines the exported `tac.V2BlockchainAddress` (`:69`). The type's own comment says core "proxies the
`tac-operation-lifecycle` Read API v2 brief object verbatim", which is the argument for deriving it. The
why-comment justifies not using the *core-generated* type; it does not justify retyping the *service* type,
which will silently drift when the proto adds a brief field. `smells.md` — Duplicated Code / Primitive
Obsession ("a domain concept that already has a type here → use the existing type").

**Suggested fix.** `export interface TacOperationSearchPayload extends Omit<tac.V2OperationBriefDetails, 'sender' | 'error_reason'> { sender?: tac.V2BlockchainAddress | null; error_reason?: string | null; }`

**Status.** `fixed`

- R2 reviewer: verified — `Omit<tac.V2OperationBriefDetails, 'sender' | 'error_reason'>` keeps the real route enum in `type`, the two overrides restore nullability exactly as `public.schema.ts:3296` declares it, and the wrapper plus `priority` survive.

### F5 · major · Correctness — `src/features/chain-variants/tac/components/TacOperationStatus.spec.tsx:93`

**Claim.** `it('renders a null error reason as a plain failure')` asserts only
`expect(screen.getByText('TAC → TON')).toBeTruthy()`. That text comes from
`getTacOperationStatusText(status, type)`, which never reads `errorReason`, so the assertion holds for any
value and merely repeats the case above it — the behaviour the `null` path actually risks (a
`"Failed operation. null"` tooltip) is never asserted, and the tooltip `describe` block covers `undefined`
but not `null`. Related: dropping the `Rollback` assertion left the `it.each` at `:78` with two cases
(`true`/`false`) that now assert identical outcomes, so the parametrisation proves nothing.
`tests-unit.md`: "A good test reads like a specification."

**Suggested fix.** Assert the contract instead — e.g.
`expect(getTacOperationStatusTooltip(tac.V2OperationStatus.failed, null, undefined)).toBe(FAILURE_TOOLTIP)` —
and either drop the degenerate parametrisation or make it assert the differing tooltip
(`ROLLBACK_TOOLTIP` vs `FAILURE_TOOLTIP`).

**Status.** `fixed`

- R2 reviewer: verified — the `null` branch is asserted where it lives (`:50-55`), rollback precedence added (`:57`), and the degenerate parametrisation replaced by a contract assertion (`:85`).

### F6 · major · Spec — `.agents/tasks/3627-tac-operations-api-v2/spec.md:209`

**Claim.** The subtask index row still points at the file this diff deletes:
``- [ ] 06 Point the search surfaces at the v2 shape → [`subtasks/06-search-surfaces/`](subtasks/06-search-surfaces/brief.md)``.
Rows 01–05 all link `spec.md`, and `.agents/tasks/README.md:156` makes the rule explicit — a folder holds "the
subtask's `spec.md` (once scoped) or a `brief.md`". The permanent record now carries a dead reference.

**Suggested fix.** Repoint the link to `subtasks/06-search-surfaces/spec.md`.

**Status.** `fixed`

- R2 reviewer: verified — the index row now links `subtasks/06-search-surfaces/spec.md`.

### F7 · nit · Standards — `src/api/CONTEXT.md:89`

**Claim.** The stated *reason* for feature-owned proxied sub-types is now false of its own example: core
"doesn't fully describe [it] in its own OpenAPI spec — it doesn't know those shapes (e.g. the
`tac_operation` field in the search-result variant …)". Per the subtask notes, core now **does** describe the
object; the type stays feature-owned because `openapi-typescript` collided the discriminator with the route.
Leaf 3 dismissed this as "the example is still true" — the `Exclude` snippet is, the rationale beside it is
not.

**Suggested fix.** Add a clause naming the codegen collision as the reason for the `tac_operation` case, or
move the example to `ens_domain`.

**Status.** `fixed`

- R2 reviewer: verified — `src/api/CONTEXT.md:91-94` names the discriminator collision as a second ground for the exception, so the `tac_operation` example matches its stated reason again.

### F8 · nit · Standards — `src/features/chain-variants/tac/mocks/search.ts:7`

**Claim.** `operation_id`, `timestamp` and the `sender` address literals are now copied from
`mocks/operations.ts` (`tacOperation`), which this fixture previously reused — Duplicated Code in
`smells.md`. The shapes genuinely differ (brief vs details), so this is a judgement call.

**Suggested fix.** Derive the brief payload from `tacOperation` by picking the brief fields rather than
re-typing the literals.

**Status.** `deferred`

- R2 reviewer: agree with the deferral — the two fixtures describe different payloads and are read independently; nothing was cosmetically changed.

## Out of scope — for the final review

- `src/features/chain-variants/tac/pages/operation-details/TacOperationDetails.tsx:64`,
  `.../pages/operations/TacOperationsTableItem.tsx:34`, `.../pages/operations/TacOperationsListItem.tsx:50`,
  `.../pages/tx/TxDetailsTacOperation.tsx:79` — four identical inline `<Badge loading={…}>Rollback</Badge>`
  that now duplicate the feature-owned `TacOperationRollbackTag`. Landed in subtasks 03–05 and inside the
  feature that owns the markup, so `src/slices/CONTEXT.md`'s child-slice ownership rule does not reach them
  and this subtask did not make them wrong. Unifying them is a whole-task call.

---

## Round 1 — resolution

| Finding | Verdict | What changed |
| --- | --- | --- |
| F1 | `accepted` | `SearchBarSuggestTacOperation.tsx` now renders `TacOperationRollbackTag` beside the status tag, so a `success`/`pending` rollback is visible there too. |
| F2 | `accepted` | Both slice rows pass `isLoading` to `TacOperationStatus` and `TacOperationEntity.Icon`, and `loading` to the rollback badge. |
| F3 | `accepted, partially` | The two slice rows and the suggestion row use a reinstated feature-owned `TacOperationRollbackTag` instead of an inline `Badge`, so no slice hand-renders tac markup. **Left alone:** the four in-feature inline `<Badge>Rollback</Badge>` sites in `TacOperationDetails`, `TacOperationsTableItem`, `TacOperationsListItem` and `TxDetailsTacOperation`, written by the developer in subtasks 03–05. They are inside the feature that owns the markup, so they breach no boundary, but the duplication is real — unifying them is the developer's call, not this subtask's. Flagged in the handoff. |
| F4 | `accepted` | `TacOperationSearchPayload` now derives from `tac.V2OperationBriefDetails` via `Omit`, overriding only the two fields whose nullability differs. |
| F5 | `accepted` | The null error-reason case is covered where the branching lives (the util), the degenerate render `it.each` is replaced by one rollback test asserting the tag adds no wording of its own, and the null render test now asserts `null` never reaches the text. Also added rollback-beats-error-reason precedence. |
| F6 | `accepted` | Parent spec index entry points at `spec.md`. |
| F7 | `accepted` | `src/api/CONTEXT.md` now states that the exception also covers a shape Core describes but codegen cannot express, which is why the `tac_operation` example still stands. |
| F8 | `deferred` | Mock literal duplication between `mocks/operations.ts` and `mocks/search.ts`. The two fixtures describe different endpoints' payloads (details vs. the search brief object) and are read independently by the tests; sharing them would couple unrelated surfaces to save six lines. |

## Round 2 — arbitration

Every claimed fix was checked against its anchor by a fresh reviewer and independently in the orchestrating
context; all seven hold, and F8's deferral stands. **No regressions introduced by the fixes.**

**Ruling on F3's partial rejection: agree.** `src/slices/CONTEXT.md` binds "other slices or features that
surface the entity", so it does not reach call sites inside the owning feature. Leaving the four in-feature
inline badges is right for this subtask — reopening three landed subtasks for no behavioural gain is worse
than the duplication. Recorded under *Out of scope* so it resurfaces at the whole-task review.

Checks re-run in this context after the fixes, all clean: `pnpm lint:tsc`, `pnpm lint:eslint` (0 errors;
7 pre-existing `playwright/no-skipped-test` warnings in untouched files), `pnpm lint:cspell` (0 issues),
`pnpm test:vitest --changed` (10 files / 45 tests).

The two `(human)` acceptance criteria in the subtask spec remain unticked — presentation parity with the
operations list, and a live search by operation id, sender and tx hash. They are the developer's to sign off
and are not part of this Outcome.
