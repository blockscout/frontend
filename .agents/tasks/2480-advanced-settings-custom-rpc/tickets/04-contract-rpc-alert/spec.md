# 04 — Contract page "RPC node is not responding" alert

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 04 of #2480 |
| Blocked by | T03 |

## What to build

On the contract Read / Write tabs, when a method call fails at the transport or node level, the result area
shows an alert instead of the raw viem message: "The RPC node is not responding. Try your own RPC node." with
the default node, or "Your RPC node is not responding. Change the RPC node URL." when a custom URL is saved.
The linked phrase opens the settings modal on the RPC node tab in place, without a reload. Contract reverts
and ABI / argument errors keep their current `shortMessage` rendering. FR12.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, a verified contract's Read tab, with the custom RPC cookie pointing at a dead `https://` host

- [ ] A classifier walks the viem error cause chain and returns "not responding" for `HttpRequestError`,
      `TimeoutError`, `LimitExceededRpcError`, `InternalRpcError`; everything else falls through.
- [ ] `ContractMethodResultPublicClient` renders the alert for classified errors, choosing the copy by whether
      the custom RPC cookie is set; the link calls the settings-modal context with the RPC tab as target.
- [ ] Unclassified errors (reverts, ABI errors) render exactly as before.
- [ ] Unit tests for the classifier and the copy selection.
- [ ] `(human)` The alert appears for a dead node, the link opens the modal on the RPC tab without a reload,
      and a revert still shows the viem short message.

## Details

- No Figma node; reference screenshot is in the issue comment on #2480. Use the toolkit `Alert` with a `Link`.
- Write calls that fail before the wallet prompt reach `ContractMethodResultWalletClient`; only the
  public-client path is in scope for this ticket (spec FR12 names the result area for method calls).

## Skill inputs

None — no project scaffold skill runs in this ticket.

## Leaf worklist

- [ ] 1 `[agent]` Error classifier with unit tests
- [ ] 2 `[agent]` Alert rendering + modal link in `ContractMethodResultPublicClient`
