# 03 — RPC node tab

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #2480 |
| Blocked by | T01, T02 |

## What to build

The modal gains an "RPC node" tab (icon `link`): a description, a row with the URL field, a Save button and a
plug icon button, then a status line (status tag + "Using your custom node" / "Using the default node") and,
when the custom node has a problem, an alert under it; plug, status line and alert exist only while a URL is
saved (no saved URL → description, field, Save). The field is pre-filled with the saved custom URL or
shows the first configured RPC URL as placeholder. Only `https://` URLs pass; anything else shows "Invalid
format" and keeps Save disabled; Save is enabled only when the value differs from the saved one. Save writes
the URL cookie, sets the in-use flag and reloads; clearing and saving removes both and reloads; the modal does
not reopen after reload. The plug button toggles the in-use flag and reloads (disconnect → default node, URL
kept in the field; connect → back to the saved URL). The saved URL, while in use, is pinged with `eth_chainId`
through the shared ping query (one react-query keyed by URL, refetched every time the tab is shown):
`connected | wrong-chain | unknown-chain | unreachable`; the configured node is never pinged. The status tag is
"Connected" (green), "Not responding" (red) or "Disconnected" (grey, saved URL not in use, no ping); the plug shows
`integration/full` coloured green / orange / red by outcome while the custom URL is in use, `integration/partial`
grey otherwise; the alert is warning for wrong chain, info for unknown chain, error for not responding (copy in
the parent spec's UI inventory). A failed custom node is never auto-disconnected. The tab is hidden on
multichain instances and when no RPC URL is configured. Saving, clearing, connecting and disconnecting each log
one Mixpanel event. FR6–9, FR13, FR14.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, gear → Advanced settings → RPC node

- [x] Tab registered in the modal with icon `link`; hidden when `config.features.multichain.isEnabled` or
      `config.chain.rpcUrls` is empty.
- [x] Validation: `https:` URL or empty; "Invalid format" message and disabled Save otherwise; Save disabled
      when the value equals the saved value.
- [x] Save sets the URL cookie and the in-use flag (from T02) and reloads; empty value removes both and
      reloads; no post-save verification.
- [x] Plug button: toggles the in-use flag and reloads; disabled while the field holds an unsaved value;
      not rendered when no URL is saved (row is field + Save).
- [x] Shared ping query (in the settings feature module, importable by T04's consumers) POSTs `eth_chainId`
      with a short timeout to the saved custom URL while in use, returns
      `connected | wrong-chain | unknown-chain | unreachable` plus the reported chain id; the tab refetches it
      on show; never pings an unsaved typed value or the configured node.
- [x] One pure mapping from ping outcome + in-use state to tag label / tag colour / plug icon + colour / alert
      status + copy; the tab renders from it, T04's indicator and pill reuse it.
- [x] One new `EventTypes` entry for the RPC setting with a `set | reset | connect | disconnect` payload.
- [x] Unit tests: validation, Save-enabled logic, ping-outcome mapping (all four outcomes × in use / not),
      visibility gate.
- [ ] `(human)` Save / reset / invalid / connect / disconnect / unreachable / wrong-chain flows behave as
      described on the running app.
- [ ] `(human)` RPC node tab matches the mockup at every breakpoint, including every field state.

## Details

- Copy: description, status line, alert texts and tooltip are listed in the parent spec's UI inventory
  (editable, stay on-message, Q05). The former separate "leave empty" helper is gone — it is part of the
  description.
- Only "Invalid format" uses the red-field error treatment; node problems are reported by the status tag,
  the plug colour and the alert, never by colouring the field (supersedes Q04).
- Figma, all eight states: `24378-86455` in the design-system file. Two deliberate deviations (parent spec UI
  inventory): the text after the tag names the node in use, and the "custom not responding" state shows the
  connected plug in red, not the disconnected plug; the two default-node states collapse to description +
  field + Save — no plug, no status line (Q06).
- "Unknown chain" = the node answered 2xx but `result` is not a hex chain id (or is a JSON-RPC error);
  "unreachable" = no answer (HTTP error, timeout, CORS).
- Ping goes straight from the browser to the node (no server proxy); CSP already allows it (configured list or
  the cookie's URL via T02).

## Skill inputs

None — no project scaffold skill runs in this ticket.

## Leaf worklist

- [x] 1 `[agent]` Shared ping query + outcome mapping + URL validation + Mixpanel event type, with unit tests
- [x] 2 `[agent]` RPC node tab content (field, Save, plug button, status line, alert, gate) registered in the modal
- [x] 3 `[agent]` Style the RPC node tab to mockup, all states — [Figma](https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/Blockscout-design-system?node-id=24378-86455)
