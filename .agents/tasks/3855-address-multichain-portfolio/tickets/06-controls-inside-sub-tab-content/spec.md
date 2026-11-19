# 06 — Controls inside sub-tab content

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 06 of #3855 |
| Blocked by | none |

## What to build

On every single-chain instance, the token-type filters, the NFT display-type switch and pagination leave
the sub-tab row and render inside the sub-tab content, above the list. This holds for both Tokens and NFTs.
The sub-tab row carries tabs only. The NFTs sub-tab is otherwise unchanged (FR5, FR6).

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open `/address/<hash>?tab=tokens_erc20` and `?tab=tokens_nfts` for an
address with more than one page of each

- [ ] `AddressTokens` passes no right slot to its sub-tab row; `AddressTokensRightSlot`,
      `address-tokens-layout` and its spec are deleted.
- [ ] Tokens: the fungible type filter (when there is more than one fungible type) and pagination render in
      the content's action bar above the table.
- [ ] NFTs: the display-type switch, the NFT type filter and pagination render above the list, for both the
      list and the collections view.
- [ ] Sub-tab ids `tokens_erc20` and `tokens_nfts` are unchanged; filtering, switching and paginating behave
      as before, including scroll-to-top on page change.
- [ ] `AddressTokens.pw.tsx` is extended for the new control placement.
- [ ] `(human)` Controls behave correctly on desktop and mobile: sticky behaviour, pagination, filter and
      switch state.
- [ ] `(human)` The Tokens sub-tab controls match the mockup at every breakpoint.
- [ ] `(human)` The NFTs sub-tab matches the mockup at every breakpoint.

## Details

- The Multichain explorer's `MultichainAddressPortfolio` keeps its own right slot; it is out of scope
  (FR15).
- Mockups are desktop only; on mobile keep the controls above the list in the existing action-bar pattern.
- `AddressNfts` and `AddressNftsCollections` are also rendered by the Multichain explorer; whatever moves
  into them must stay opt-in there.

## Leaf worklist

- [ ] 1 `[agent]` Move the Tokens and NFTs controls into the sub-tab content and delete the right-slot code
- [ ] 2 `[agent]` Style the Tokens sub-tab controls to mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6337-4418)
- [ ] 3 `[agent]` Style the NFTs sub-tab to mockup — [Figma](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6339-2653)
- [ ] 4 `[agent]` Extend `AddressTokens.pw.tsx` for the control placement
- [ ] 5 `[human]` Regenerate and review the affected screenshot baselines
