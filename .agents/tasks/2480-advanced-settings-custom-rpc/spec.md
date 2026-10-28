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
6. RPC node tab: the tab description, a URL field, a Save button, a plug icon button (connect /
   disconnect), a status line (status tag + which node the app uses) and, when the custom node has a
   problem, an alert under the status line. Plug, status line and alert exist only while a custom URL
   is saved; with no saved URL the tab is description, field and Save. The field is pre-filled with
   the saved custom URL, or shows the first configured RPC URL as the placeholder when none is saved.
7. Only `https://` URLs are accepted; anything else shows "Invalid format" under the field and keeps
   Save disabled. Save is enabled only when the field value differs from the saved value.
8. Saving a URL stores it, marks it as in use and reloads the page; the modal does not reopen after
   the reload. Clearing the field and saving removes the stored URL and reloads, returning to the
   configured node. The plug button toggles whether the saved URL is in use without forgetting it:
   "disconnect" switches the app back to the configured node and reloads, "connect" switches back to
   the saved URL and reloads. A saved node that turns out to be broken is never auto-disconnected; the
   user decides to disconnect it or to save another URL.
9. The saved custom URL, while in use, is pinged with `eth_chainId`: on every page load (it feeds FR16
   and FR17) and every time the RPC tab is shown. The configured node is never pinged. The ping has
   four outcomes: **connected** (answers with the
   explorer's chain id), **wrong chain** (answers with another chain id), **unknown chain** (answers,
   but not with a chain id), **not responding** (no JSON-RPC answer: HTTP error, timeout, CORS). The
   RPC tab shows the outcome as a status tag — "Connected" (green), "Not responding" (red) — followed
   by "Using your custom node", and an alert under the status line for wrong chain (warning), unknown
   chain (info) and not responding (error). While the saved URL is not in use the status line is the
   grey "Disconnected" tag followed by "Using the default node", no ping, no alert. The plug button shows the connected
   icon coloured by outcome (green / orange / red) while the custom URL is in use, the grey
   disconnected icon while the saved URL is not in use. The field stays editable in every state.
10. While a custom URL is in use, every browser-side RPC request for the explorer's own chain goes to
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
15. The modal is adaptive: on desktop a centred dialog with the vertical tab list; on mobile a
    full-height bottom sheet with **no tab list** — the same tabs render as stacked sections (icon +
    heading + content) in the tab order, and "open on tab X" scrolls to that section.
16. While a custom URL is in use, the top bar shows a plug icon (next to the CSV export icon, all
    breakpoints) coloured by the last ping: green connected, orange wrong / unknown chain, red not
    responding. Its tooltip carries the status and the same warning / error text as the RPC tab's
    alert; a click opens the modal on the RPC node tab.
17. While a custom URL is in use, the contract page's methods alert row gains a "Custom RPC" pill with
    the plug icon, in front of the wallet alert: grey when connected, orange on wrong / unknown chain,
    red when not responding. A click opens the modal on the RPC node tab. Nothing is shown with the
    default node.

## Data & API

No backend API involved. No new environment variable: the RPC node tab is gated on the existing
`NEXT_PUBLIC_NETWORK_RPC_URL` being set and multichain being off.

Browser-side JSON-RPC used for verification: `eth_chainId` POSTed to the node URL; the hex result is
compared with the configured chain id. A 2xx answer whose `result` is not a hex chain id (or a JSON-RPC
error object) is "unknown chain"; no answer at all is "not responding".

## UI inventory

- **Top-bar settings popover** (existing) — trimmed to theme, identicon, "Advanced settings" link.
  Figma: https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=19733-225343
- **Advanced site settings modal**, 728×560 on desktop. Figma frame with all tabs:
  https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=24385-88460
  Mobile (stacked sections, no tab list):
  https://www.figma.com/design/OjqHcLt95E6kq5ElO79EKT/%F0%9F%93%B1-Blockscout-mobile-version?node-id=425-66888
  - Scam tokens tab: https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=24385-88369
    (switch states: `node-id=24377-85724`)
  - RPC node tab, all states (default connected, default not responding, edit, invalid, save, custom
    with chain mismatch, custom with unknown chain, custom not responding):
    https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/Blockscout-design-system?node-id=24378-86455
    Deviations from the frame, agreed with the PM: the text after the status tag names the node in use
    (FR9) instead of repeating the problem; the "custom not responding" state keeps the *connected*
    plug icon in red (the app never disconnects on its own); the two default-node states collapse to
    description + field + Save (no plug, no status line, FR6).
  - Appearance tab: https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=24441-95923
    (address-format picker is a deliberate addition next to the identicon, per the designer thread)
  - Time format tab: https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/BS_2.0-Components?node-id=31413-5354
    (Figma content is a placeholder; content is FR5, agreed in the designer thread)
- **Contract page, Read / Write method result** — the "not responding" alert. Reference screenshot in
  the issue comment on #2480; no Figma node.
- **Top bar custom-RPC indicator** (FR16), mobile top bar node:
  https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/Blockscout-design-system?node-id=34246-7308
  (the icon itself is `I34246:7308;34246:5456`; the red variant is drawn, green / orange follow the
  contract pill's colours).
- **Contract page "Custom RPC" pill** (FR17), three colour states:
  https://www.figma.com/design/4In0X8UADoZaTfZ34HaZ3K/Blockscout-design-system?node-id=34259-25460

Entry points: the popover link; the contract-page alert link, the top-bar indicator and the contract
"Custom RPC" pill (all three open the modal directly on the RPC tab).

Copy (agreed with the designer, may be shortened but must keep the message):
- RPC tab description: "We recommend using an RPC that matches your selected network to ensure accurate
  data. Enter the node URL and click Save to update. Leave blank to use the default RPC node." (the
  former separate "leave empty" helper is folded into it)
- RPC status line: tag "Connected" / "Not responding" / "Disconnected", then "Using the default node" /
  "Using your custom node"
- RPC alerts: wrong chain — "This RPC belongs to a different network. Make sure you're using the correct
  RPC URL to avoid displaying incorrect data."; unknown chain — "We couldn't identify the network for
  this RPC. Please verify the RPC URL and make sure it matches your selected network."; not responding
  — "This RPC node isn't responding. Check the URL and try again."
- Top-bar tooltip: "Custom RPC: {tag}" plus the alert text when there is one
- Scam tab description: "Tokens flagged as scam are hidden from token lists and balances."

## Implementation decisions

- **Settings modal is a new feature module** owning the modal shell, the tab registry and each tab's
  content, with an app-level open/close state (open with a target tab) so both the popover link and the
  contract alert can open it. Existing popover controls are moved, not duplicated: each control
  component is reused inside its tab, and the popover renders only what FR1 lists.
- **No post-save verification flow**: Save writes the cookie and reloads, nothing else. The page load
  that follows pings the custom node (FR9) and the top-bar indicator / contract pill show the result,
  so a bad node is visible right after the reload without any extra step. A wrong-chain node does not
  trigger the contract-page "not responding" alert (calls return empty data, which viem reports as a
  contract error); the orange indicator and pill cover it.
- **Custom RPC state lives in cookies** alongside the other preference cookies, so the server sees it:
  one cookie for the saved URL and one flag for whether it is in use (the plug button toggles the flag
  only, so disconnecting keeps the URL in the field). The CSP builder reads the URL per request and
  appends the origin to `connect-src` only while the flag is on. The server trusts the cookie only
  after re-validating it as an `https:` URL; anything else is ignored.
- **Transport resolution is a single helper** that returns the effective RPC URL list for the current
  chain: the custom URL alone when it is saved and in use, otherwise the configured list (plus the
  core-API `eth-rpc` fallback where it is used today). Both the wagmi transport builder and the standalone public
  client call it; the `rpcUrls` on the chain object are left as configured so wallet "add chain"
  prompts still advertise the operator's URLs. Because both clients are built at module load, a change
  takes effect through the page reload the setting already performs.
- **Node ping** is one react-query keyed by the custom URL that POSTs `eth_chainId` with a short
  timeout and returns `connected | wrong-chain | unknown-chain | unreachable` plus the reported chain
  id. Three consumers read the same query: the top-bar indicator and the contract pill (mounted only
  while a custom URL is in use, which is what makes the ping run at page load), and the RPC tab (which
  refetches on show). It runs in the browser only, against the saved custom URL while in use (in the
  cookie, therefore allowed by CSP); the configured node is never pinged; there is no server-side
  proxy for the check (no SSRF surface, and the check exercises the same path wagmi uses, CORS
  included). A URL that is typed but not yet saved is never pinged. One mapping function turns the
  outcome into tag / colour / alert copy so the three consumers cannot drift.
- **Mobile modal** reuses the tab registry: the same tab entries render as a vertical tab list on
  desktop and as stacked sections in a full-height bottom sheet on mobile; "open on tab X" becomes a
  scroll-into-view on mobile. No second registry.
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
- Server-side verification of the RPC URL or any proxying of RPC traffic through the Next.js server.
- Custom RPC for chains other than the explorer's own (multichain cluster chains, parent chain, dapp
  chains).
- Per-request switching without a reload.
- Changing the URLs advertised to wallets via "add chain".
