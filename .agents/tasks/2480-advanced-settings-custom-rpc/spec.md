# Advanced site settings modal with a user-defined RPC node

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/2480 (custom RPC) + https://github.com/blockscout/frontend/issues/2519 (settings modal) |
| Feature branch | `issue-2480` |
| PM | Ulyana |
| Designer | Tatyana |
| Backend | — |
| Minimum API version | — |
| Slack channel | — |

## Context & goal

Contract reads and writes on the contract page go through the RPC node the instance operator configured.
When that node is down or rate-limited, the user sees a raw viem error ("HTTP request failed.") and has
no way out. The goal is to let the user point the explorer at their own RPC node and make the failure
actionable: the error names the problem and links straight to the setting.

The setting needs a home. The current top-bar settings popover is a flat list of toggles; the design
introduces an "Advanced site settings" modal with tabs and trims the popover to colour theme, identicon
and a link to the modal. The two issues ship together: the modal is where the RPC setting lives, and the
RPC setting is what makes the modal worth opening.

Designer thread with the settled answers:
https://blockscout.slack.com/archives/D03PDKKMLQH/p1792678732622049

## Functional requirements

1. The top-bar settings popover shows only the colour theme picker, the identicon picker and an
   "Advanced settings" link that opens the modal. The scam-tokens, poor-reputation, address-format and
   local-time controls leave the popover and live in the modal.
2. The "Advanced site settings" modal has a vertical tab list on the left and the active tab's content
   on the right: **Scam tokens**, **RPC node**, **Appearance**, **Time format**. Each tab is subject to
   the same visibility gate as the control it hosts; a tab with nothing to show is hidden.
3. Scam tokens tab: "Hide scam tokens" and "Hide poor reputation tokens" switches, same behaviour as
   today (cookie write, page reload).
4. Appearance tab: colour theme picker, identicon picker, and the address-format picker next to the
   identicon (shown only when the chain has more than one address format).
5. Time format tab: "Local time" switch and a relative / absolute selector, both persisted in the
   cookies the settings context already reads.
6. RPC node tab: a URL field with a connection-status plug icon, a Save button, the tab description and
   the "leave empty" helper. The field is pre-filled with the saved custom URL, or shows the first
   configured RPC URL as the placeholder when none is saved.
7. Only `https://` URLs are accepted; anything else shows "Invalid format" under the field and keeps
   Save disabled. Save is enabled only when the field value differs from the saved value.
8. Saving a URL stores it in a cookie and reloads the page; the modal does not reopen after the
   reload. Clearing the field and saving removes the cookie and reloads, returning to the configured
   node. A saved node that turns out to be unreachable surfaces through the contract-page alert
   (FR12) or the next time the RPC tab is opened (FR9).
9. The plug icon reflects the last ping of the **active** node (custom when set, otherwise the first
   configured URL), run every time the RPC tab is shown: green when the node answers with the
   explorer's chain id, red otherwise. A red result shows a message under the field: "Couldn't reach
   this node" when there is no valid JSON-RPC answer, "This node serves chain ID {x}, but this explorer
   is for chain ID {y}" on a mismatch. A failed custom node is never auto-reverted; the field stays
   editable.
10. While a custom URL is saved, every browser-side RPC request for the explorer's own chain goes to
    that URL only: the wagmi transports (contract read / write / simulate, revoke, L2 claims) and the
    standalone public client (degraded-mode home, tx, block, address fallbacks). The configured URLs
    and the core-API `eth-rpc` fallback are not used while the custom URL is set.
11. The custom URL is permitted by the Content Security Policy for that user only: the CSP middleware
    adds the cookie's URL to `connect-src` per request. No blanket relaxation of `connect-src`.
12. On the contract page, when a method call fails at the transport or node level (HTTP error,
    timeout, rate limit, internal node error), the result area shows an alert instead of the raw viem
    message: "The RPC node is not responding. Try your own RPC node." with the default node, or "Your
    RPC node is not responding. Change the RPC node URL." with a custom one. The linked phrase opens the
    modal on the RPC node tab without a reload. Contract reverts and ABI/argument errors keep their
    current rendering.
13. The RPC node tab is hidden on multichain instances and when the chain has no configured RPC URL.
14. Saving or clearing the custom URL logs one Mixpanel event.
15. The modal is adaptive: a centred dialog on desktop, a bottom sheet on mobile, per the existing
    dialog component's `adaptive` mode.

## Data & API

No backend API involved. No new environment variable: the RPC node tab is gated on the existing
`NEXT_PUBLIC_NETWORK_RPC_URL` being set and multichain being off.

Browser-side JSON-RPC used for verification: `eth_chainId` POSTed to the node URL; the hex result is
compared with the configured chain id.

## UI inventory

- **Top-bar settings popover** (existing) — trimmed to theme, identicon, "Advanced settings" link.
  Figma: https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=19733-225343
- **Advanced site settings modal**, 728×560 on desktop. Figma frame with all tabs:
  https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=24385-88460
  - Scam tokens tab: https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=24385-88369
    (switch states: `node-id=24377-85724`)
  - RPC node tab: https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=24385-88461
    (field states — default connected, default disconnected, edit, error, save, custom connected:
    `node-id=24377-86343`). The "unreachable" and "wrong chain" messages reuse the error state.
  - Appearance tab: https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=24441-95923
    (address-format picker is a deliberate addition next to the identicon, per the designer thread)
  - Time format tab: https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=31413-5354
    (Figma content is a placeholder; content is FR5, agreed in the designer thread)
- **Contract page, Read / Write method result** — the "not responding" alert. Reference screenshot in
  the issue comment on #2480; no Figma node.

Entry points: the popover link; the contract-page alert link (opens the modal directly on the RPC tab).

Copy (agreed with the designer, may be shortened but must keep the message):
- RPC tab description: "Send contract calls and other blockchain requests through your own RPC node."
- RPC helper: "Leave empty and save to return to the default node."
- Scam tab description: "Tokens flagged as scam are hidden from token lists and balances."

## Implementation decisions

- **Settings modal is a new feature module** owning the modal shell, the tab registry and each tab's
  content, with an app-level open/close state (open with a target tab) so both the popover link and the
  contract alert can open it. Existing popover controls are moved, not duplicated: each control
  component is reused inside its tab, and the popover renders only what FR1 lists.
- **No post-save verification flow**: Save writes the cookie and reloads, nothing else. The ping runs
  only when the RPC tab is shown, so a bad node is caught on the next visit to the tab or by the
  contract-page alert. A wrong-chain node does not trigger that alert (calls return empty data, which
  viem reports as a contract error), so it is caught only by the tab ping — accepted.
- **Custom RPC URL lives in a cookie** alongside the other preference cookies, so the server sees it.
  The CSP builder reads it per request and appends the origin to `connect-src`. The server trusts the
  cookie only after re-validating it as an `https:` URL; anything else is ignored.
- **Transport resolution is a single helper** that returns the effective RPC URL list for the current
  chain: the custom URL alone when the cookie is set, otherwise the configured list (plus the core-API
  `eth-rpc` fallback where it is used today). Both the wagmi transport builder and the standalone public
  client call it; the `rpcUrls` on the chain object are left as configured so wallet "add chain"
  prompts still advertise the operator's URLs. Because both clients are built at module load, a change
  takes effect through the page reload the setting already performs.
- **Node ping** is one hook that POSTs `eth_chainId` with a short timeout and returns
  `connected | unreachable | wrong-chain` plus the reported chain id; it drives the plug icon and the
  message under the field. It runs in the browser only, against the active node (already in the cookie
  or the configured list, therefore allowed by CSP); there is no server-side proxy for the check (no
  SSRF surface, and the check exercises the same path wagmi uses, CORS included). A URL that is typed
  but not yet saved is never pinged.
- **Error classification on the contract page** walks the viem error's cause chain: `HttpRequestError`,
  `TimeoutError`, `LimitExceededRpcError` and `InternalRpcError` map to the "not responding" alert;
  everything else keeps the current `shortMessage` rendering. The alert's link opens the modal in
  place through the modal state, not via reload.
- **Validation** on the client: must parse as a URL with the `https:` scheme; empty means "reset".
- **Analytics**: one new event type for the RPC setting with a `set | reset` action; existing settings
  controls keep whatever they log today.
- **Visibility gates** reuse the gates each control already has (scam toggle env, multichain flag,
  address-format count, theme count); the tab hides when every control in it is hidden.

## Out of scope

- A "match system" colour theme (the 5th swatch in the popover mockup) — separate task.
- A contract-page banner that says a custom node is active (open question Q01; no alert ships until
  the PM decision lands).
- Server-side verification of the RPC URL or any proxying of RPC traffic through the Next.js server.
- Custom RPC for chains other than the explorer's own (multichain cluster chains, parent chain, dapp
  chains).
- Per-request switching without a reload.
- Changing the URLs advertised to wallets via "add chain".
