# Home page: transactions real-time feed toggle

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3758 |
| Feature branch | `issue-3758` |
| PM | Nikita S. |
| Designer | Tatyana |
| Backend | Victor |
| Minimum API version | TBD — Core API release that ships blockscout/blockscout#14926 (see Q01) |
| Slack channel | — |

## Context & goal

The home page "Latest transactions" widget shows five transactions fetched once, plus a notice line
("scanning new transactions…" / "N more transactions have come in") driven by a websocket counter. A
user who wants to watch the chain live has to reload or follow the link. The goal is a "Real-time feed"
switch on the widget, mirroring the one on the Flashblocks page: when on, newly validated transactions
slide into the list as they arrive, newest first, and the counter line disappears.

## Functional requirements

1. A new env var `NEXT_PUBLIC_HOMEPAGE_TXS_REAL_TIME_FEED` with values `off` (toggle shown, off by
   default), `on` (toggle shown, on by default) and `hidden` (no toggle; current behaviour). Default `off`.
   Documented, validated, mocked and listed like the other homepage envs.
2. The toggle is a switch labelled "Real-time feed" with an info hint reading "See the latest
   transactions in real time, ordered chronologically." It sits in the tab row's right slot when the
   widget renders tabs, and on the title row when there are no tabs. Match the Flashblocks page switch.
3. The toggle applies to the main "Latest txn" tab only. Other tabs (deposits, watchlist, cross-chain,
   ZetaChain) keep their current counter behaviour and never show the switch.
4. Toggle off: current behaviour, unchanged — five items, counter notice line, "View all" link.
5. Toggle on: the notice line is hidden; each transaction object received from the global transaction
   socket channel is inserted at the top of the list with the fade-in animation used by the latest blocks
   widget; the list keeps the five newest items, dropping the oldest; no refetch of the list resource.
6. The user's toggle choice persists across reloads in a cookie. The env default applies only when the
   cookie is absent.
7. Toggle changes log an analytics event with the new state, through the shared analytics facade, so
   it reaches every enabled provider (Mixpanel, PostHog).
8. The RPC-degraded variant of the widget supports the same toggle: when on, new transactions from each
   polled block are prepended, keeping the five newest, and the overflow counter line is hidden.
9. When the env is `off` or `on` but the backend does not push transaction objects on the global
   channel (support is per-instance, see Q01), the toggle is hidden as if the env were `hidden`.

## Data & API

- List: `core:homepage_txs` (exists). Unchanged, used for the initial five items.
- Socket: `transactions:new_transaction` topic, `transaction` event. Today the payload is a count only
  (`{ transaction: N }`); transaction objects are needed for FR5. Backend work tracked in
  blockscout/blockscout#14926 — payload shape and the per-instance support signal are open (Q01). The
  core API release that ships it becomes the minimum API version for the release notes.
- RPC fallback: the home RPC data context already receives every block's transactions via the public
  client; FR8 is a change in how it retains them, not a new data source.
- Env var: `NEXT_PUBLIC_HOMEPAGE_TXS_REAL_TIME_FEED` (FR1), in the homepage slice config.
- Cookie: a new name in the shared cookie registry for the persisted toggle state (FR6).

## UI inventory

- Home page `/`, "Latest transactions" widget, main tab. Mockups are the inline images on the issue:
  toggle off (counter line present), toggle on (counter line hidden). No Figma node.
- Switch + hint: match the Flashblocks page's "Real-time feed" switch.
- No new routes, navigation entries, or cross-links.

## Implementation decisions

- **Socket objects, no refetch.** Live mode inserts the socket payload directly into the list resource's
  React Query cache, the way the latest blocks widget does for `blocks:new_block`. Count-only events are
  ignored in live mode. Refetching on count was considered and rejected.
- **Scope held to the main tab** even though deposits and multichain-local widgets also have count
  sockets; those channels carry counts only and are out of scope.
- **Env is a three-value enum**, not a boolean, so operators can hide the toggle entirely.
- **Backend capability gate** (FR9): the mechanism depends on Q01's answer; until then the toggle is
  implemented behind the env and the gate is a deferred ticket.
- **Degraded view** (FR8): a real-time flag in the home RPC data context switches its transaction
  retention from "first five, count the rest" to "newest five". Small change, no refactor.
- **Counter line in live mode is hidden** (issue option a), not shown disabled (option b).
- **Live list size stays at five**; it does not grow like the Flashblocks table.
- **Analytics**: one custom event for the toggle, logged via the shared facade.

## Out of scope

- Any backend change (tracked separately in blockscout/blockscout#14926).
- Pending transactions feed; the live list shows validated transactions only.
- Real-time mode for deposits, watchlist, cross-chain, ZetaChain tabs, and the multichain explorer home.
- The transactions list page `/txs`.
