# 03 — RPC node tab

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #2480 |
| Blocked by | T01, T02 |

## What to build

The modal gains an "RPC node" tab (icon `link`): a description, a URL field with a connection-status plug
icon, the "leave empty" helper and a Save button. The field is pre-filled with the saved custom URL or shows
the first configured RPC URL as placeholder. Only `https://` URLs pass; anything else shows "Invalid format"
and keeps Save disabled; Save is enabled only when the value differs from the saved one. Save writes the cookie
and reloads; clearing and saving removes the cookie and reloads; the modal does not reopen after reload. Every
time the tab is shown, the active node (custom when set, else the first configured URL) is pinged with
`eth_chainId`: the plug icon is `integration/full` (green) when the chain id matches the explorer's,
`integration/partial` (red) otherwise, with "Couldn't reach this node" or "This node serves chain ID {x}, but
this explorer is for chain ID {y}" under the field. A failed custom node is never auto-reverted. The tab is
hidden on multichain instances and when no RPC URL is configured. Saving or clearing logs one Mixpanel event.
FR6–9, FR13, FR14.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, gear → Advanced settings → RPC node

- [ ] Tab registered in the modal with icon `link`; hidden when `config.features.multichain.isEnabled` or
      `config.chain.rpcUrls` is empty.
- [ ] Validation: `https:` URL or empty; "Invalid format" message and disabled Save otherwise; Save disabled
      when the value equals the saved value.
- [ ] Save sets the cookie (from T02) and reloads; empty value removes the cookie and reloads; no post-save
      verification.
- [ ] Ping hook POSTs `eth_chainId` with a short timeout to the active node, returns
      `connected | unreachable | wrong-chain` plus the reported chain id; runs on tab show only; never pings
      an unsaved typed value; plug icon and message follow the result (`integration/full` / `integration/partial`).
- [ ] One new `EventTypes` entry for the RPC setting with a `set | reset` payload, logged on save.
- [ ] Unit tests: validation, Save-enabled logic, ping-result mapping, visibility gate.
- [ ] `(human)` Save / reset / invalid / unreachable / wrong-chain flows behave as described on the running app.
- [ ] `(human)` RPC node tab matches the mockup at every breakpoint, including every field state.

## Details

- Copy (Q05, editable, stay on-message): description "Send contract calls and other blockchain requests
  through your own RPC node."; helper "Leave empty and save to return to the default node."
- Error states (unreachable, wrong chain) reuse the "Invalid format" error treatment (Q04).
- Figma: tab `24385-88461`; field states (default connected, default disconnected, edit, error, save, custom
  connected) `24377-86343`.
- Ping goes straight from the browser to the node (no server proxy); CSP already allows it (configured list or
  the cookie's URL via T02).

## Skill inputs

None — no project scaffold skill runs in this ticket.

## Leaf worklist

- [ ] 1 `[agent]` Ping hook + URL validation + Mixpanel event type, with unit tests
- [ ] 2 `[agent]` RPC node tab content (field, plug icon, Save, messages, gate) registered in the modal
- [ ] 3 `[agent]` Style the RPC node tab to mockup — [Figma](https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=24385-88461) · [field states](https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=24377-86343)
