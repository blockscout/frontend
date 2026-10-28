# 04 — Contract page "RPC node is not responding" alert, custom-RPC indicators (top bar, contract pill)

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

While a custom URL is in use, two indicators show the last ping of that node (T03's shared query, which this
mounting is what makes run at page load): a plug icon in the top bar next to the CSV export icon, at every
breakpoint, green / orange / red by outcome, with a tooltip "Custom RPC: {tag}" plus the alert text when there
is one; and a "Custom RPC" pill (plug icon + label) at the front of the contract methods alert row, grey /
orange / red. Both open the modal on the RPC node tab on click. Nothing renders with the default node.
FR16, FR17.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, a verified contract's Read tab, with the custom RPC cookie pointing at a dead `https://` host

- [ ] A classifier walks the viem error cause chain and returns "not responding" for `HttpRequestError`,
      `TimeoutError`, `LimitExceededRpcError`, `InternalRpcError`; everything else falls through.
- [ ] `ContractMethodResultPublicClient` renders the alert for classified errors, choosing the copy by whether
      the custom RPC cookie is set; the link calls the settings-modal context with the RPC tab as target.
- [ ] Unclassified errors (reverts, ABI errors) render exactly as before.
- [ ] Unit tests for the classifier and the copy selection.
- [ ] Top-bar indicator in `TopBar.tsx`'s icon group before `CsvExportDownloads`, rendered only while the custom
      URL is in use (cookie + flag); colour / tooltip from T03's outcome mapping; click opens the modal on the
      RPC tab through the context. Shown on mobile too.
- [ ] "Custom RPC" pill in `ContractMethodsAlerts` before `ConnectWalletAlert`, same gate, same mapping, same
      click; it uses the toolkit `Alert` like its neighbour and does not depend on `connectWallet` being enabled.
- [ ] The ping runs once per page load while the custom URL is in use (query mounted by the indicator), and the
      RPC tab's refetch updates the indicators without a reload.
- [ ] `(human)` The alert appears for a dead node, the link opens the modal on the RPC tab without a reload,
      and a revert still shows the viem short message.
- [ ] `(human)` Indicator and pill show green / orange / red for a good, wrong-chain and dead custom node, are
      absent with the default node, and open the modal on the RPC tab.
- [ ] `(human)` Top-bar indicator matches the mockup on desktop and mobile; contract pill matches the mockup.

## Details

- "Not responding" alert: no Figma node; reference screenshot is in the issue comment on #2480. Use the toolkit
  `Alert` with a `Link`.
- Top-bar indicator: mobile top bar `34246-7308` (icon instance `I34246:7308;34246:5456`, only the red state is
  drawn; green / orange use the pill's colours). Contract pill, three states: `34259-25460`. Both in the
  design-system file.
- Ping outcome → colour: connected green, wrong chain / unknown chain orange, unreachable red (pill background
  grey / orange / red).
- Write calls that fail before the wallet prompt reach `ContractMethodResultWalletClient`; only the
  public-client path is in scope for this ticket (spec FR12 names the result area for method calls).

## Skill inputs

None — no project scaffold skill runs in this ticket.

## Leaf worklist

- [ ] 1 `[agent]` Error classifier with unit tests
- [ ] 2 `[agent]` Alert rendering + modal link in `ContractMethodResultPublicClient`
- [ ] 3 `[agent]` Top-bar custom-RPC indicator (gate, tooltip, click) and contract "Custom RPC" pill, wired to T03's query and mapping
- [ ] 4 `[agent]` Style the top-bar indicator to mockup — [Figma](https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/Blockscout-design-system?node-id=34246-7308)
- [ ] 5 `[agent]` Style the contract "Custom RPC" pill to mockup — [Figma](https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/Blockscout-design-system?node-id=34259-25460)
