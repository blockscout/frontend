# Design readout — Transaction receipt page

<!-- cspell:ignore Egxq Vulwf Akakf EZETH -->

## Receipt page, light — [6292:224650](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6292-224650)

Sidecar `/Users/tom/Dev/bs/.ai/design-readout/CEgxqWOzVulwfTUHhs0gUC-6292-224650.json` · color mode `light` · file version `2420937091460480665` · regions `6292:224650`

### Recognized

| Node | Content | Component | Props | Tokens | Signal |
| --- | --- | --- | --- | --- | --- |
| `6292:224650` | page frame 1440×729 | — (page container) | — | `background → bg.primary` | `color` |
| `6292:225563` | page backdrop layer 1437×728 | — (page background, see Layout questions) | — | `background #101112/4 → badge.gray.bg, tag.root.subtle.bg` (answered: blackAlpha.50) | `color` |
| `6292:225213` | card 359×534 | — (card container) | — | `background → bg.primary` | `color` |
| `6292:225218` | `logo_hor` | `NetworkLogo` | `imageOnly noLink` (image part only, to be extracted; per-chain config) | `icon #1C180D → no token` | `correction` |
| `6292:225221` | status slot; `Pending` (`I6292:225221;1003:19141`), `refresh` (`I6292:225221;26721:66403`) | `Spinner` | `size=md` (pending; Success / Failed swap in `TxStatus` as shipped) | `background #101112/4 → badge.gray.bg, tag.root.subtle.bg` | `correction` |
| `6292:225259` | summary block 295×96 | — (panel, one with `6292:225266`) | — | `background #101112/4 → badge.gray.bg, tag.root.subtle.bg` (answered: blackAlpha.50) | `color` |
| `6292:225260` | `Transfer` | `Heading` | `level=3 color=text.secondary` (textStyle heading.md) | `text → text.secondary` | `correction` |
| `6292:225262` | `813.62 `; token icon `USDT` (`6292:225264`), symbol `USDT` (`6292:225265`) | `TokenValue` | `tokenEntityProps.noLink` (token icon 20px) | `text → text.primary` | `correction` |
| `6292:225266` | parties row 295×52 | — (panel, one with `6292:225259`) | — | `background #101112/4 → badge.gray.bg, tag.root.subtle.bg` (answered: blackAlpha.50) | `color` |
| `6292:225273` | `0xA6...5306`; identicon `Avatar` (`6292:225270`) | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → text.primary` | `context` |
| `6292:225279` | `to` | `Text` | — | `text → text.secondary` | `correction` |
| `I6292:225282;20543:278991` | `0x1cb...a149`; identicon `Avatar` (`6292:225281`) | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → text.primary` | `context` |
| `6292:225331` | `Date` | `Text` | — | `text → text.secondary` | `correction` |
| `6292:225333` | `Nov 04 2026` | `Time` | `format=date-only` (new format) | `text → text.secondary` | `shape` |
| `6292:225339` | `Time` | `Text` | — | `text → text.secondary` | `correction` |
| `6292:225341` | `02:51:55 +4:00 UTC` | `Time` | `format=time-only` (new format; lighter `+4:00 UTC` suffix is icon.secondary) | `text → text.secondary` | `correction` |
| `6292:225389` | `Tx fee` | `Text` | — | `text → text.secondary` | `correction` |
| `6292:225391` | `0.000003268416333 ETH  $0.01` | `TxFee` | `USD in parentheses as shipped; lighter USD run is icon.secondary · override color=text.secondary` | `text → text.secondary` | `correction` |
| `6292:225394` | `table_divider` | `Separator` | — | `icon #101112/6 → no token in icon role (hex equals border.divider)` | `correction` |
| `6292:225399` | `Chain` | `Text` | — | `text → text.secondary` | `correction` |
| `6292:225402` | `Robinhood Chain` | `Text` | — | `text → text.secondary` | `correction` |
| `6292:225440` | `Tx hash` | `Text` | — | `text → text.secondary` | `correction` |
| `6292:225443` | `0x1ea...e7c34` | `TxEntity` | `noIcon noLink noCopy truncation=constant · override color=text.secondary` | `text → text.secondary` | `context` |
| `6292:225488` | `Transaction details` (label `I6292:225488;22463:46693`) | `Button` | `variant=subtle size=md` (as shipped, no override) | `background #101112/4 → badge.gray.bg, tag.root.subtle.bg` | `correction` |
| `6292:225489` | `Connect` (copy-link button 44×40) | `CopyToClipboard` | `type=link` (default styles customised to the mockup look: filled, 44×40; no override recorded, the node resolved no token for its fill) | `icon #101112/4 → no token` | `correction` |
| `6292:225490` | `Copyright © Blockscout Limited 2023-2026` | `Text` | `textStyle=xs color=text.secondary` | `text → text.secondary` | `correction` |

### Ambiguous

### Unrecognized

### Layout questions

- Divider between the Tx fee row and the Chain row: own element or a border? — nodes `6292:225394` — a separator element (border.divider) vs a border on the row group — answer: a `Separator` element; the detail rows are flex rows, not a table, so the table row-divider convention does not apply.
- Page background: tinted layer or one token? — nodes `6292:225563`, `6292:224650` — bg.primary frame with a full-size #101112/4 overlay and the card back on bg.primary vs one page background color — answer: the card is bg.primary; the page background is blackAlpha.50 (light) / whiteAlpha.50 (dark). The summary and parties blocks `6292:225259`, `6292:225266` are one panel with an inner divider, filled blackAlpha.50 (light) / whiteAlpha.100 (dark); no `bg` override recorded, the tool does not accept blackAlpha.50 for these nodes (they resolved badge.gray.bg, tag.root.subtle.bg).
- Card vertical placement — nodes `6292:225213`, `6292:225490` — card and copyright centred in the viewport vs a fixed top offset — answer: centred in the viewport; the copyright belongs to the page, under the card.

### By convention

## Receipt page, dark — [6292:225570](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6292-225570)

Sidecar `/Users/tom/Dev/bs/.ai/design-readout/CEgxqWOzVulwfTUHhs0gUC-6292-225570.json` · color mode `dark` · file version `2420937091460480665` · regions `6292:225570`

### Recognized

| Node | Content | Component | Props | Tokens | Signal |
| --- | --- | --- | --- | --- | --- |
| `6292:225570` | page frame 1440×729 | — (page container) | — | `background → bg.primary` | `color` |
| `6292:225573` | card 359×534 | — (card container) | — | `background → bg.primary` | `color` |
| `6292:225578` | `logo_hor` | `NetworkLogo` | `image part only, no link` (to be extracted; per-chain config) | `icon #FFFFFF → no token` | `correction` |
| `6292:225581` | status slot; `Pending` (`I6292:225581;19383:71285`), `refresh` (`I6292:225581;26721:66540`) | `Spinner` | `size=md` (pending; Success / Failed swap in `TxStatus` as shipped) | `background #FFFFFF/6 → badge.gray.bg, tag.root.subtle.bg` | `correction` |
| `6292:225619` | summary block 295×96 | — (panel, one with `6292:225626`) | — | `background #FFFFFF/6 → badge.gray.bg, tag.root.subtle.bg` (answered: whiteAlpha.100) | `color` |
| `6292:225620` | `Transfer` | `Heading` | `level=3` (textStyle heading.md; intended color text.secondary, not recordable as an override: the node's fill is a light-theme slip) | `text #718096 → no token` (intended: text.secondary) | `correction` |
| `6292:225622` | `813.62 `; token icon `USDT` (`6292:225624`), symbol `USDT` (`6292:225625`) | `TokenValue` | `tokenEntityProps noLink` (token icon 20px) | `text #101112/80 → no token` (light-theme slip; intended: text.primary) | `correction` |
| `6292:225626` | parties row 295×52 | — (panel, one with `6292:225619`) | — | `background #FFFFFF/6 → badge.gray.bg, tag.root.subtle.bg` (answered: whiteAlpha.100) | `color` |
| `6292:225633` | `0xA6...5306`; identicon `Avatar` (`6292:225630`) | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → text.primary` | `context` |
| `6292:225639` | `to` | `Text` | — | `text → text.secondary` | `correction` |
| `I6292:225642;20543:278991` | `0x1cb...a149`; identicon `Avatar` (`6292:225641`) | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text #101112/80 → no token` (light-theme slip; intended: text.primary) | `correction` |
| `6292:225691` | `Date` | `Text` | — | `text → text.secondary` | `correction` |
| `6292:225693` | `Nov 04 2026` | `Time` | `format=date-only` (new format) | `text → text.secondary` | `shape` |
| `6292:225699` | `Time` | `Text` | — | `text → text.secondary` | `correction` |
| `6292:225701` | `02:51:55 +4:00 UTC` | `Time` | `time-only format` (new format; lighter `+4:00 UTC` suffix is icon.secondary) | `text → text.secondary` | `correction` |
| `6292:225749` | `Tx fee` | `Text` | — | `text → text.secondary` | `correction` |
| `6292:225751` | `0.000003268416333 ETH  $0.01` | `TxFee` | `USD in parentheses as shipped; lighter USD run is icon.secondary · override color=text.secondary` | `text → text.secondary` | `correction` |
| `6292:225754` | `table_divider` | `Separator` | — | `icon #FFFFFF/6 → no token in icon role (hex equals border.divider)` | `correction` |
| `6292:225759` | `Chain` | `Text` | — | `text → text.secondary` | `correction` |
| `6292:225762` | `Robinhood Chain` | `Text` | — | `text → text.secondary` | `correction` |
| `6292:225800` | `Tx hash` | `Text` | — | `text → text.secondary` | `correction` |
| `6292:225803` | `0x1ea...e7c34` | `TxEntity` | `noIcon noLink noCopy truncation=constant · override color=text.secondary` | `text → text.secondary` | `context` |
| `6292:225848` | button 243×40; label `Transaction details` (`I6292:225848;22463:46693`) | `Button` | `variant=subtle size=md` (as shipped, no override) | `background #FFFFFF/6 → badge.gray.bg, tag.root.subtle.bg`; label `text → text.primary` | `correction` |
| `6292:225849` | `Connect` (link glyph, 44×40) | `CopyToClipboard` | `type=link` (default styles customised here to the mockup look: filled, 44×40; no override recorded: the node resolved no token for its fill, #FFFFFF/6 = whiteAlpha.100) | `icon #FFFFFF/6 → no token` | `correction` |
| `6292:225850` | `Copyright © Blockscout Limited 2023-2026` | `Text` | `textStyle=xs` (intended color text.secondary, not recordable as an override: the node resolved no text token) | `text #718096 → no token` (Figma style: icon.secondary) | `correction` |

### Ambiguous

### Unrecognized

- `6292:225571` box `Rectangle 4` (page backdrop layer 1437×728) — background #FFFFFF/4 → no token (palette whiteAlpha.50) — proposal none — gap `color` — no component to record; answered as a Layout item (L4): the page background is whiteAlpha.50 in dark

### Layout questions

- Summary and parties: one panel with an inner divider, or two boxes 1px apart — nodes `6292:225619`, `6292:225626` — one rounded container with a divider between its sections / two boxes with a 1px gap showing the card background — one panel with an inner divider; fill whiteAlpha.100 in dark (no bg override recorded: the nodes did not resolve that token)
- Line between the Tx fee and Chain rows — node `6292:225754` — its own 1px element / a bottom border on the first row group — a `Separator` element; the detail rows are flex rows, not a table
- Date and Time as two rows from one timestamp — nodes `6292:225693`, `6292:225701` — two `Time` instances with fixed formats / formats derived from the user's time setting — two `Time` instances with new date-only and time-only formats; the lighter `+4:00 UTC` suffix is icon.secondary
- Tx fee value: USD beside the native amount, and the value's width — nodes `6292:225751`, `6292:225749` — shipped `TxFee` horizontal layout with USD in parentheses / the mockup's bare `$0.01`; value fills the row / hug-width value — USD stays in parentheses as shipped, one line, right-aligned; the lighter `$0.01` run is icon.secondary
- Actions row — nodes `6292:225848`, `6292:225849` — button grows and the copy button is fixed / fixed 243px button — the button grows, the copy button is fixed (44×40), gap 8px
- Page backdrop — nodes `6292:225570`, `6292:225571`, `6292:225573` — page is bg.primary plus a whiteAlpha.50 layer with a bg.primary card / the overlay is a mockup artifact — the card is bg.primary; the page background is whiteAlpha.50 in dark (blackAlpha.50 in light)
- Address and hash truncation length — nodes `6292:225633`, `I6292:225642;20543:278991`, `6292:225803` — shipped `constant` truncation everywhere / the drawn lengths (4+4, 5+4, 5+5) — shipped `constant` everywhere
- Light-theme fills in the dark frame — nodes `6292:225620`, `6292:225622`, `6292:225625`, `I6292:225642;20543:278991` — deliberate values / designer slips — slips: `Transfer` is text.secondary; the amount, the symbol and the recipient address are text.primary

### By convention

## Card, transfer view (token transfer and pending native-coin fallback) — [6297:3859](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6297-3859)

Sidecar `/Users/tom/Dev/bs/.ai/design-readout/CEgxqWOzVulwfTUHhs0gUC-6297-3859.json` · color mode `light` · file version `2420937091460480665` · regions `6297:3859`

### Recognized

Token transfer card (success):

| Node | Content | Component | Props | Tokens | Signal |
| --- | --- | --- | --- | --- | --- |
| `6282:3592` | card 359×534 | — (card container) | — | `background → bg.primary` | `color` |
| `6282:3597` | `logo_hor` | `NetworkLogo` | `imageOnly noLink` (image part only, to be extracted; per-chain config) | `icon #1C180D → no token` | `correction` |
| `6282:3600` | status slot; `icon/check-circle` (`I6282:3600;1003:19143`), `Success` (`I6282:3600;1003:19144`) | `TxStatus` | `status=ok` (as shipped: green badge, `status/success` icon, text; swaps with `Spinner` while pending) | `background → badge.green.bg`; `text → badge.green.fg` | `correction` |
| `6282:3638` | summary block 295×96 | — (panel, one with `6282:3645`) | — | `background #101112/4 → badge.gray.bg, tag.root.subtle.bg` (answered: blackAlpha.50) | `color` |
| `6282:3639` | `Transfer` | `Heading` | `level=3 color=text.secondary` (textStyle heading.md) | `text → text.secondary` | `correction` |
| `6282:3641` | `813.62 `; token icon `USDT` (`6282:3643`), symbol `USDT` (`6282:3644`) | `TokenValue` | `tokenEntityProps.noLink` (token icon 20px; 24/32 = heading.lg) | `text → text.primary` | `correction` |
| `6282:3645` | parties row 295×52 | — (panel, one with `6282:3638`) | — | `background #101112/4 → badge.gray.bg, tag.root.subtle.bg` (answered: blackAlpha.50) | `color` |
| `6282:3652` | `0xA6...5306`; identicon `Avatar` (`6282:3649`) | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → text.primary` | `context` |
| `6282:3658` | `to` | `Text` | — (plain connector between two `AddressEntity`; not `AddressFromTo`) | `text → text.secondary` | `correction` |
| `I6282:3661;20543:278991` | `0x1cb...a149`; identicon `Avatar` (`6282:3660`) | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → text.primary` | `context` |
| `6285:3609` | `Date` | `Text` | — | `text → text.secondary` | `correction` |
| `6285:3611` | `Nov 04 2026` | `Time` | `format=date-only` (new format) | `text → text.secondary` | `shape` |
| `6285:3617` | `Time` | `Text` | — | `text → text.secondary` | `correction` |
| `6285:3619` | `02:51:55 +4:00 UTC` | `Time` | `format=time-only` (new format; lighter `+4:00 UTC` suffix is icon.secondary) | `text → text.secondary` | `correction` |
| `6285:3667` | `Tx fee` | `Text` | — | `text → text.secondary` | `correction` |
| `6285:3669` | `0.000003268416333 ETH  $0.01` | `TxFee` | `USD in parentheses as shipped; lighter USD run is icon.secondary; one line, right-aligned · override color=text.secondary` | `text → text.secondary` | `correction` |
| `6285:3672` | `table_divider` | `Separator` | — | `icon #101112/6 → no token in icon role (hex equals border.divider)` | `correction` |
| `6285:3677` | `Chain` | `Text` | — | `text → text.secondary` | `correction` |
| `6285:3680` | `Robinhood Chain` | `Text` | — | `text → text.secondary` | `correction` |
| `6285:3718` | `Tx hash` | `Text` | — | `text → text.secondary` | `correction` |
| `6285:3721` | `0x1ea...e7c34` | `TxEntity` | `noIcon noLink noCopy truncation=constant · override color=text.secondary` | `text → text.secondary` | `context` |
| `6282:3828` | `Transaction details` (label `I6282:3828;22463:46693`) | `Button` | `variant=subtle size=md` (as shipped, no override; grows in the actions row) | `background #101112/4 → badge.gray.bg, tag.root.subtle.bg` | `correction` |
| `6282:3829` | `Connect` (copy-link button 44×40, link glyph) | `CopyToClipboard` | `type=link` (default styles customised to the mockup look: filled, 44×40, fixed width; no override recorded, the node resolved no token for its fill) | `icon #101112/4 → no token` | `correction` |
| `6282:3830` | `Copyright © Blockscout Limited 2023-2026` | `Text` | `textStyle=xs color=text.secondary` | `text #A0AEC0 → no token` (answered: text.secondary) | `correction` |

Native-coin fallback card (pending):

| Node | Content | Component | Props | Tokens | Signal |
| --- | --- | --- | --- | --- | --- |
| `6297:3510` | card 359×534 | — (card container) | — | `background → bg.primary` | `color` |
| `6297:3515` | `logo_hor` | `NetworkLogo` | `imageOnly noLink` (image part only, to be extracted; per-chain config) | `icon #1C180D → no token` | `correction` |
| `6300:9187` | `Loaders/Circular-Progress` (status slot, pending) | `Spinner` | `size=md` (20px; Success / Failed swap in `TxStatus` as shipped) | `icon #E2E8F0 → no token` | `correction` |
| `6297:3556` | summary block 295×96 | — (panel, one with `6297:3563`) | — | `background #101112/4 → badge.gray.bg, tag.root.subtle.bg` (answered: blackAlpha.50) | `color` |
| `6297:3557` | `Transfer` | `Heading` | `level=3 color=text.secondary` (textStyle heading.md) | `text → text.secondary` | `correction` |
| `6297:3559` | `0`; symbol `ETH` (`6297:3562`) | `NativeCoinValue` | — (amount = the transaction's own value, zero included; 24/32 = heading.lg) | `text → text.primary` | `correction` |
| `6297:3561` | `ETH` (native coin icon 20×20) | `TokenIconNative` | `boxSize=5` | `icon #DDDCDC → no token` | `correction` |
| `6297:3563` | parties row 295×52 | — (panel, one with `6297:3556`) | — | `background #101112/4 → badge.gray.bg, tag.root.subtle.bg` (answered: blackAlpha.50) | `color` |
| `6297:3570` | `0xA6...5306`; identicon `Avatar` (`6297:3567`) | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → text.primary` | `context` |
| `6297:3576` | `to` | `Text` | — (plain connector between two `AddressEntity`; not `AddressFromTo`) | `text → text.secondary` | `correction` |
| `I6297:3579;20543:278991` | `0x1cb...a149`; identicon `Avatar` (`6297:3578`) | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → text.primary` | `context` |
| `6297:3628` | `Date` | `Text` | — | `text → text.secondary` | `correction` |
| `6297:3630` | `-` (pending Date placeholder) | `Text` | — | `text → text.secondary` | `correction` |
| `6297:3636` | `Time` | `Text` | — | `text → text.secondary` | `correction` |
| `6297:3638` | `-` (pending Time placeholder) | `Text` | — | `text → text.secondary` | `correction` |
| `6297:3686` | `Tx fee` | `Text` | — | `text → text.secondary` | `correction` |
| `6297:3688` | `0.000003268416333 ETH  $0.01` | `TxFee` | `USD in parentheses as shipped; lighter USD run is icon.secondary; one line, right-aligned · override color=text.secondary` | `text → text.secondary` | `correction` |
| `6297:3691` | `table_divider` | `Separator` | — | `icon #101112/6 → no token in icon role (hex equals border.divider)` | `correction` |
| `6297:3696` | `Chain` | `Text` | — | `text → text.secondary` | `correction` |
| `6297:3699` | `Robinhood Chain` | `Text` | — | `text → text.secondary` | `correction` |
| `6297:3737` | `Tx hash` | `Text` | — | `text → text.secondary` | `correction` |
| `6297:3740` | `0x1ea...e7c34` | `TxEntity` | `noIcon noLink noCopy truncation=constant · override color=text.secondary` | `text → text.secondary` | `context` |
| `6297:3785` | `Transaction details` (label `I6297:3785;22463:46693`) | `Button` | `variant=subtle size=md` (as shipped, no override; grows in the actions row) | `background #101112/4 → badge.gray.bg, tag.root.subtle.bg` | `correction` |
| `6297:3786` | `Connect` (copy-link button 44×40, link glyph) | `CopyToClipboard` | `type=link` (default styles customised to the mockup look: filled, 44×40, fixed width; no override recorded, the node resolved no token for its fill) | `icon #101112/4 → no token` | `correction` |
| `6297:3787` | `Copyright © Blockscout Limited 2023-2026` | `Text` | `textStyle=xs color=text.secondary` | `text #A0AEC0 → no token` (answered: text.secondary) | `correction` |

### Ambiguous

### Unrecognized

### Layout questions

- Is the line between the two row groups its own element or a border? — nodes `6285:3672`, `6297:3691` — a `Separator` element between the Date / Time / Tx fee group and the Chain / Tx hash group vs a bottom border on the first group — answer: a `Separator` element; the detail rows are flex rows, not a table, so the table row-divider convention does not apply.
- Is the summary block one panel or two? — nodes `6282:3638`, `6282:3645`, `6297:3556`, `6297:3563` — two filled boxes (96 and 52 high) stacked with a 1px gap showing the card background vs one rounded panel with an internal divider line — answer: one panel with an inner divider, filled blackAlpha.50 (light) / whiteAlpha.100 (dark); not a Badge or Tag. No `bg` override recorded, the tool does not accept blackAlpha.50 for these nodes (they resolved badge.gray.bg, tag.root.subtle.bg).
- One color or two inside the Time and Tx fee values? — nodes `6285:3619`, `6285:3669`, `6297:3688` — the sidecar holds a single fill (#718096) per text node, the mockup draws `+4:00 UTC` and `$0.01` lighter than the leading part: one text.secondary run vs a leading part plus a lighter suffix — answer: two; the leading part is text.secondary, the lighter `+4:00 UTC` and `$0.01` suffixes are icon.secondary.
- Does the Tx fee value share the row with its label or sit in its own cell? — nodes `6285:3667`, `6285:3669`, `6297:3686`, `6297:3688` — the value box (279 wide, 24 high) overlaps the label box: a right-aligned value on one line vs a value that may wrap under the label — answer: one line, right-aligned.
- Which truncation for hashes? — nodes `6282:3652`, `I6282:3661;20543:278991`, `6285:3721`, `6297:3570`, `I6297:3579;20543:278991`, `6297:3740` — the mockup draws three head/tail lengths (4+4, 5+4, 5+5): one `truncation=constant` everywhere vs per-row lengths as drawn — answer: shipped `constant` everywhere.
- Tx hash row: entity or plain truncated text? — nodes `6285:3721`, `6297:3740` — `TxEntity` with `noIcon noLink noCopy` vs `Truncate` text as the transaction page's hash row — answer: `TxEntity` noIcon noLink noCopy truncation=constant, override color=text.secondary.
- Actions row sizing — nodes `6282:3828`, `6282:3829`, `6297:3785`, `6297:3786` — fixed widths as drawn (243 and 44) vs a growing button beside a fixed copy button — answer: the button grows, the copy button is fixed, gap 8px.
- Where does the copyright line belong? — nodes `6282:3830`, `6297:3787` — part of the card component vs part of the page — answer: the page, under the card.

### By convention

## Card, `Call` fallback, pending — [6297:3202](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6297-3202)

Sidecar `/Users/tom/Dev/bs/.ai/design-readout/CEgxqWOzVulwfTUHhs0gUC-6297-3202.json` · color mode `light` · file version `2420937091460480665` · regions `6297:3202`

### Recognized

| Node | Content | Component | Props | Tokens | Signal |
| --- | --- | --- | --- | --- | --- |
| `6297:3203` | card box 445×534 | — (card container, no component) | — | background #FFFFFF → `bg.primary` | color |
| `6297:3209` | `logo_hor` | `NetworkLogo` | image part only, no link | icon #1C180D → no token (brand artwork) | correction |
| `6300:9182` | `Loaders/Circular-Progress` | `Spinner` | size=md | icon #E2E8F0 → no token | correction |
| `6297:3249` | summary panel box 381×96 | — (panel container, no component; see Layout questions) | — | background #101112/4 → `badge.gray.bg`, `tag.root.subtle.bg` (value of blackAlpha.50) | color |
| `6297:3250` | `Call` | `Heading` | level=3 · override color=text.secondary | text #718096 → `text.secondary` | correction |
| `6297:3251` | `0x6af57517` | `Heading` | textStyle=heading.lg | text #101112/80 → `text.primary` | correction |
| `6297:3252` | parties panel box 381×52 | — (panel container, no component; see Layout questions) | — | background #101112/4 → `badge.gray.bg`, `tag.root.subtle.bg` (value of blackAlpha.50) | color |
| `6297:3257` | `0xA6...5306` (+ icon `6297:3254` `Avatar`, the identicon) | `AddressEntity` | noLink noCopy truncation=constant · override fontWeight=500 | text #101112/80 → `text.primary` | context |
| `6297:3263` | `interacted with` | `Text` | — | text #718096 → `text.secondary` | correction |
| `I6297:3266;20543:278991` | `0x1cb...a149` (+ icon `6297:3265` `Contract`, the contract icon) | `AddressEntity` | noLink noCopy truncation=constant · override fontWeight=500 | text #101112/80 → `text.primary`; icon #718096 → `icon.primary` | context |
| `6297:3272` | `Date` | `Text` | — | text #718096 → `text.secondary` | correction |
| `6297:3274` | `-` (pending placeholder; a final status shows `Time` with a new date-only format) | `Text` | — | text #718096 → `text.secondary` | correction |
| `6297:3280` | `Time` | `Text` | — | text #718096 → `text.secondary` | correction |
| `6297:3282` | `-` (pending placeholder; a final status shows `Time` with a new time-only format) | `Text` | — | text #718096 → `text.secondary` | correction |
| `6297:3330` | `Tx fee` | `Text` | — | text #718096 → `text.secondary` | correction |
| `6297:3332` | `0.000003268416333 ETH  $0.01` | `TxFee` | USD in parentheses as shipped; the lighter `$0.01` run is `icon.secondary` · override color=text.secondary | text #718096 → `text.secondary` | correction |
| `6297:3335` | `table_divider` | `Separator` | — | icon #101112/6 → no token | correction |
| `6297:3340` | `Chain` | `Text` | — | text #718096 → `text.secondary` | correction |
| `6297:3343` | `Robinhood Chain` | `Text` | — | text #718096 → `text.secondary` | correction |
| `6297:3381` | `Tx hash` | `Text` | — | text #718096 → `text.secondary` | correction |
| `6297:3384` | `0x1ea...e7c34` | `TxEntity` | noIcon noLink noCopy truncation=constant · override color=text.secondary | text #718096 → `text.secondary` | context |
| `6297:3429` | button box 329×40 (+ label `I6297:3429;22463:46693` `Transaction details`) | `Button` | variant=subtle size=md, as shipped | background #101112/4 → `badge.gray.bg`, `tag.root.subtle.bg` (not applied: the shipped `button.subtle.bg` stands); label text #101112/80 → `text.primary` | correction |
| `6297:3430` | `Connect` (chain-link glyph on a filled 44×40 box) | `CopyToClipboard` | type=link; default styles customised to the mockup look (filled, 44×40); no override recorded, the node resolved no token for its fill (#101112/4, value of blackAlpha.50) | icon #101112/4 → no token | correction |
| `6297:3431` | `Copyright © Blockscout Limited 2023-2026` | `Text` | textStyle=xs color=text.secondary | text #A0AEC0 → no token (intended `text.secondary`) | correction |

### Ambiguous

(none)

### Unrecognized

(none)

### Layout questions

- Is the summary one panel or two? — nodes `6297:3249`, `6297:3252` — two boxes of the same fill stacked with a 1px gap vs one panel with a 1px inner divider above the parties row — one panel with an inner divider; fill blackAlpha.50 in light, whiteAlpha.100 in dark, not a Badge/Tag (no `bg` override recorded: the tool rejects that token for these nodes)
- How wide is the Tx fee value and where does the fiat go? — nodes `6297:3330`, `6297:3332` — amount and USD on one line as a single value vs `TxFee`'s own two-part layout, which may wrap the USD part — one line, right-aligned; USD stays in parentheses as shipped
- Hash truncation length — nodes `6297:3384`, `6297:3257`, `I6297:3266;20543:278991` — one shipped `truncation="constant"` everywhere vs per-node lengths as drawn (5+5, 4+4, 5+4) — shipped `constant` everywhere
- Copyright line placement — nodes `6297:3431`, `6297:3203` — part of the page layout under the card vs part of the card component — belongs to the page, under the card
- Status slot when not pending — nodes `6300:9182` — one slot swapping `Spinner` and `TxStatus` vs separate elements — one status slot swaps `Spinner` (pending) and `TxStatus` as shipped (Success / Failed)
- Detail rows: flex rows or a table? — nodes `6297:3272`, `6297:3274`, `6297:3280`, `6297:3282`, `6297:3330`, `6297:3332`, `6297:3340`, `6297:3343`, `6297:3381`, `6297:3384` — a table with a label and a value column vs independent flex rows — flex rows, not a table; the line `6297:3335` between the Tx fee and Chain rows is a `Separator` element
- Actions row sizing — nodes `6297:3429`, `6297:3430` — fixed widths as drawn (329 and 44) vs a growing button beside a fixed copy button — the button grows, the copy button is fixed, gap 8px

### By convention

(none: the card is not a table, so the row-divider and right-aligned price-cell conventions do not apply)

## Cards that follow the API sentence — [6299:3955](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6299-3955)

Sidecar `/Users/tom/Dev/bs/.ai/design-readout/CEgxqWOzVulwfTUHhs0gUC-6299-3955.json` · color mode `light` · file version `2420937091460480665` · regions `6299:3955`

### Recognized

| Node | Content | Component | Props | Tokens | Signal |
| --- | --- | --- | --- | --- | --- |
| `6299:3956` | `box` | `Box` | `card surface` | `background → bg.primary` | `color` |
| `6299:3962` | `logo_hor` | `NetworkLogo` | `image-part-only no-link per-chain-config` | `icon → no token (#1C180D)` | `correction` |
| `6299:3965` | `box + icon/check-circle (I6299:3965;1003:19143), Success (I6299:3965;1003:19144)` | `TxStatus` | `—` | `background → badge.green.bg` | `correction` |
| `6299:4003` | `box` | `Box` | `one panel with inner divider (L1); intended bg blackAlpha.50, override not accepted by the tool` | `background → badge.gray.bg, tag.root.subtle.bg` | `color` |
| `6299:4004` | `Swap` | `Heading` | `level=3 color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6299:4007` | `813.62 + Unknown_TOKEN (6299:4009), CASHCAT (6299:4010)` | `TokenValue` | `tokenEntityProps.noLink` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `correction` |
| `6299:4012` | `for` | `Text` | `textStyle=heading.md color=text.secondary` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `correction` |
| `6299:4014` | `0.03613 + Unknown_TOKEN (6299:4016), WETH (6299:4017)` | `TokenValue` | `tokenEntityProps.noLink` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `correction` |
| `6299:4018` | `box` | `Box` | `one panel with inner divider (L1); intended bg blackAlpha.50, override not accepted by the tool` | `background → badge.gray.bg, tag.root.subtle.bg` | `color` |
| `6299:4024` | `0xA6...5306 + + (6299:4021)` | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `context` |
| `6299:4030` | `interacted with` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `I6299:4033;20543:278991` | `0x1cb...a149 + Contract (6299:4032)` | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `context` |
| `6299:4080` | `Date` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6299:4082` | `Nov 04 2026` | `Time` | `format=date-only-new` | `text → link.secondary, text.secondary` | `shape` |
| `6299:4088` | `Time` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6299:4090` | `02:51:55 +4:00 UTC` | `Time` | `format=time-only-new` | `text → link.secondary, text.secondary` | `correction` |
| `6299:4138` | `Tx fee` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6299:4140` | `0.000003268416333 ETH  $0.01` | `TxFee` | `override color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6299:4143` | `table_divider` | `Separator` | `—` | `icon → no token (#101112/6)` | `correction` |
| `6299:4148` | `Chain` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6299:4151` | `Robinhood Chain` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6299:4189` | `Tx hash` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6299:4192` | `0x1ea...e7c34` | `TxEntity` | `noIcon noLink noCopy truncation=constant · override color=text.secondary` | `text → link.secondary, text.secondary` | `context` |
| `6299:4237` | `box + Transaction details (I6299:4237;22463:46693)` | `Button` | `variant=subtle size=md` | `background → badge.gray.bg, tag.root.subtle.bg` | `correction` |
| `6299:4238` | `Connect` | `CopyToClipboard` | `type=link filled 44x40` | `icon → no token (#101112/4)` | `correction` |
| `6300:8723` | `box` | `Box` | `card surface` | `background → bg.primary` | `color` |
| `6300:8729` | `logo_hor` | `NetworkLogo` | `image-part-only no-link per-chain-config` | `icon → no token (#1C180D)` | `correction` |
| `6300:8732` | `box + icon/check-circle (I6300:8732;1003:19143), Success (I6300:8732;1003:19144)` | `TxStatus` | `—` | `background → badge.green.bg` | `correction` |
| `6300:8770` | `box` | `Box` | `one panel with inner divider (L1); intended bg blackAlpha.50, override not accepted by the tool` | `background → badge.gray.bg, tag.root.subtle.bg` | `color` |
| `6300:8771` | `Swap` | `Heading` | `level=3 color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:8774` | `813.62 + Unknown_TOKEN (6300:8776), CASHCAT (6300:8777)` | `TokenValue` | `tokenEntityProps.noLink` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `correction` |
| `6300:8779` | `for` | `Text` | `textStyle=heading.md color=text.secondary` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `correction` |
| `6300:8781` | `0.03613 + Unknown_TOKEN (6300:8783), WETH (6300:8784)` | `TokenValue` | `tokenEntityProps.noLink` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `correction` |
| `6300:9078` | `on` | `Text` | `textStyle=heading.md color=text.secondary` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `correction` |
| `6300:9085` | `Unknown_TOKEN + Uniswap V3 (6300:9086)` | `Image` | `as-shipped-in-TxInterpretation-dexTag with-name-text-truncated-end no-link` | `icon → no token (#E2E8F0)` | `correction` |
| `6300:8785` | `box` | `Box` | `one panel with inner divider (L1); intended bg blackAlpha.50, override not accepted by the tool` | `background → badge.gray.bg, tag.root.subtle.bg` | `color` |
| `6300:8791` | `0xA6...5306 + Avatar (6300:8788)` | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `context` |
| `6300:8797` | `interacted with` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `I6300:8800;20543:278991` | `Uniswap V3: Swap Router + Contract (6300:8799)` | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `correction` |
| `6300:8847` | `Date` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:8849` | `Nov 04 2026` | `Time` | `format=date-only-new` | `text → link.secondary, text.secondary` | `shape` |
| `6300:8855` | `Time` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:8857` | `02:51:55 +4:00 UTC` | `Time` | `format=time-only-new` | `text → link.secondary, text.secondary` | `correction` |
| `6300:8905` | `Tx fee` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:8907` | `0.000003268416333 ETH  $0.01` | `TxFee` | `override color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:8910` | `table_divider` | `Separator` | `—` | `icon → no token (#101112/6)` | `correction` |
| `6300:8915` | `Chain` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:8918` | `Robinhood Chain` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:8956` | `Tx hash` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:8959` | `0x1ea...e7c34` | `TxEntity` | `noIcon noLink noCopy truncation=constant · override color=text.secondary` | `text → link.secondary, text.secondary` | `context` |
| `6300:9004` | `box + Transaction details (I6300:9004;22463:46693)` | `Button` | `variant=subtle size=md` | `background → badge.gray.bg, tag.root.subtle.bg` | `correction` |
| `6300:9005` | `Connect` | `CopyToClipboard` | `type=link filled 44x40` | `icon → no token (#101112/4)` | `correction` |
| `6300:5072` | `box` | `Box` | `card surface` | `background → bg.primary` | `color` |
| `6300:5078` | `logo_hor` | `NetworkLogo` | `image-part-only no-link per-chain-config` | `icon → no token (#1C180D)` | `correction` |
| `6300:5081` | `box + icon/check-circle (I6300:5081;1003:19143), Success (I6300:5081;1003:19144)` | `TxStatus` | `—` | `background → badge.green.bg` | `correction` |
| `6300:5119` | `box` | `Box` | `one panel with inner divider (L1); intended bg blackAlpha.50, override not accepted by the tool` | `background → badge.gray.bg, tag.root.subtle.bg` | `color` |
| `6300:5434` | `Akakf + Avatar (6300:5433)` | `AddressEntity` | `noLink noCopy truncation=constant` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `correction` |
| `6300:5443` | `initiated Withdraw of` | `Text` | `textStyle=heading.md color=text.secondary` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `correction` |
| `6300:5130` | `0.03613 + Unknown_TOKEN (6300:5132), EZETH (6300:5133)` | `TokenValue` | `tokenEntityProps.noLink` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `correction` |
| `6300:5134` | `box` | `Box` | `one panel with inner divider (L1); intended bg blackAlpha.50, override not accepted by the tool` | `background → badge.gray.bg, tag.root.subtle.bg` | `color` |
| `6300:5140` | `Akakf + Avatar (6300:5137)` | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `correction` |
| `6300:5146` | `interacted with` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `I6300:5149;20543:278991` | `0x1cb...a149 + Contract (6300:5148)` | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `context` |
| `6300:5196` | `Date` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5198` | `Nov 04 2026` | `Time` | `format=date-only-new` | `text → link.secondary, text.secondary` | `shape` |
| `6300:5204` | `Time` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5206` | `02:51:55 +4:00 UTC` | `Time` | `format=time-only-new` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5254` | `Tx fee` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5256` | `0.000003268416333 ETH  $0.01` | `TxFee` | `override color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5259` | `table_divider` | `Separator` | `—` | `icon → no token (#101112/6)` | `correction` |
| `6300:5264` | `Chain` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5267` | `Robinhood Chain` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5305` | `Tx hash` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5308` | `0x1ea...e7c34` | `TxEntity` | `noIcon noLink noCopy truncation=constant · override color=text.secondary` | `text → link.secondary, text.secondary` | `context` |
| `6300:5353` | `box + Transaction details (I6300:5353;22463:46693)` | `Button` | `variant=subtle size=md` | `background → badge.gray.bg, tag.root.subtle.bg` | `correction` |
| `6300:5354` | `Connect` | `CopyToClipboard` | `type=link filled 44x40` | `icon → no token (#101112/4)` | `correction` |
| `6300:5447` | `box` | `Box` | `card surface` | `background → bg.primary` | `color` |
| `6300:5453` | `logo_hor` | `NetworkLogo` | `image-part-only no-link per-chain-config` | `icon → no token (#1C180D)` | `correction` |
| `6300:5456` | `box + icon/check-circle (I6300:5456;1003:19143), Success (I6300:5456;1003:19144)` | `TxStatus` | `—` | `background → badge.green.bg` | `correction` |
| `6300:5494` | `box` | `Box` | `one panel with inner divider (L1); intended bg blackAlpha.50, override not accepted by the tool` | `background → badge.gray.bg, tag.root.subtle.bg` | `color` |
| `6300:5495` | `Committed EIP-4844 blob` | `Heading` | `level=3 color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5502` | `by` | `Text` | `textStyle=heading.md color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5500` | `Bundler: 0xc85...723 + Avatar (6300:5499)` | `AddressEntity` | `noLink noCopy` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `correction` |
| `6300:5503` | `box` | `Box` | `one panel with inner divider (L1); intended bg blackAlpha.50, override not accepted by the tool` | `background → badge.gray.bg, tag.root.subtle.bg` | `color` |
| `6300:5509` | `0xA6...5306 + Avatar (6300:5506)` | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `context` |
| `6300:5515` | `interacted with` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `I6300:5518;20543:278991` | `0x1cb...a149 + Contract (6300:5517)` | `AddressEntity` | `noLink noCopy truncation=constant · override fontWeight=500` | `text → badge.blue_alt.fg, badge.gray.fg, badge.purple_alt.fg, link.menu, link.navigation.fg, link.navigation.fg.selected, link.subtle, link.subtle.hover, tag.root.clickable.fg, tag.root.subtle.fg, text.primary` | `context` |
| `6300:5565` | `Date` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5567` | `Nov 04 2026` | `Time` | `format=date-only-new` | `text → link.secondary, text.secondary` | `shape` |
| `6300:5573` | `Time` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5575` | `02:51:55 +4:00 UTC` | `Time` | `format=time-only-new` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5623` | `Tx fee` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5625` | `0.000003268416333 ETH  $0.01` | `TxFee` | `override color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5628` | `table_divider` | `Separator` | `—` | `icon → no token (#101112/6)` | `correction` |
| `6300:5633` | `Chain` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5636` | `Robinhood Chain` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5674` | `Tx hash` | `Text` | `color=text.secondary` | `text → link.secondary, text.secondary` | `correction` |
| `6300:5677` | `0x1ea...e7c34` | `TxEntity` | `noIcon noLink noCopy truncation=constant · override color=text.secondary` | `text → link.secondary, text.secondary` | `context` |
| `6300:5722` | `box + Transaction details (I6300:5722;22463:46693)` | `Button` | `variant=subtle size=md` | `background → badge.gray.bg, tag.root.subtle.bg` | `correction` |
| `6300:5723` | `Connect` | `CopyToClipboard` | `type=link filled 44x40` | `icon → no token (#101112/4)` | `correction` |
| `6300:5724` | `Copyright © Blockscout Limited 2023-2026` | `Text` | `textStyle=xs color=text.secondary` | `text → no token (#A0AEC0)` | `correction` |

### Ambiguous

### Unrecognized

### Layout questions

- Are the headline lines hand-broken or free-wrapping? — nodes `6299:4004`, `6299:4007`, `6299:4010`, `6299:4012`, `6299:4014`, `6299:4017`, `6300:8771`, `6300:8774`, `6300:8777`, `6300:8779`, `6300:8781`, `6300:8784`, `6300:9078`, `6300:9086`, `6300:5434`, `6300:5443`, `6300:5130`, `6300:5133`, `6300:5495`, `6300:5500` — fixed lines as drawn, each centered, or only the break after the action type forced and the rest one centered inline flow that wraps by width — answer (L3): the action type on its own line, the rest wraps freely (FR7)
- Is "by" in the blob card part of the action-type line or of the sentence? — nodes `6300:5495`, `6300:5502`, `6300:5500` — styled like the action type but on the second line beside the address, or an ordinary connecting word in the wrapping remainder — answer (L3, D4): an ordinary connecting word; connecting words share the action type's style (`heading.md`, `text.secondary`)
- Is the summary block one panel or two? — nodes `6299:4003`, `6299:4018`, `6300:8770`, `6300:8785`, `6300:5119`, `6300:5134`, `6300:5494`, `6300:5503` — two `#101112/4` boxes stacked with a 1px gap, or one panel with an inner border line — answer (L1, D14): one panel with an inner divider; fill `blackAlpha.50` in light, `whiteAlpha.100` in dark, not a Badge or Tag. The `bg` override is not recorded, the tool rejects that token for these nodes
- How does a long name in the parties row shrink? — nodes `I6300:8800;20543:278991`, `6300:8791`, `6300:8797` — a fixed max width on the second party with the row centered, or the row fills the panel and only the overflowing part truncates — answer (L9): the row fills the panel and truncates on overflow
- Is the hash truncation the shipped one? — nodes `6299:4192`, `6300:8959`, `6300:5308`, `6300:5677`, `6299:4024`, `I6299:4033;20543:278991`, `6300:8791`, `I6300:5149;20543:278991`, `6300:5509`, `I6300:5518;20543:278991` — as drawn (5+5, 4+4, 5+4 characters), or the shipped `truncation="constant"` — answer (L10): shipped `constant` everywhere
- Is the line between the Tx fee and Chain rows an element or a row border? — nodes `6299:4143`, `6300:8910`, `6300:5259`, `6300:5628` — raised in the readout as an application of the table row-divider convention; reviewed (B1): the card is not a table, the convention does not apply — answer (L2, L12): a `Separator` element between flex rows
- Is the Tx fee value one right-aligned line? — nodes `6299:4140`, `6300:8907`, `6300:5256`, `6300:5625` — raised in the readout as an application of the right-aligned price-cell convention; reviewed (B1): not a table — answer (L8): one line, right-aligned

### By convention

## Status and address-icon showcase — [6282:3275](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6282-3275)

Sidecar `/Users/tom/Dev/bs/.ai/design-readout/CEgxqWOzVulwfTUHhs0gUC-6282-3275.json` · color mode `light` · file version `2420937091460480665` · regions `6282:3275`

### Recognized

| Node | Content | Component | Props | Tokens | Signal |
| --- | --- | --- | --- | --- | --- |
| `6282:3282` | `logo_hor` (status row variant: success) | `NetworkLogo` | image part only, no link (to be extracted, per-chain config) | icon #1C180D → no token (image content) | correction |
| `6282:3323` | `logo_hor` (status row variant: failed) | `NetworkLogo` | image part only, no link | icon #1C180D → no token (image content) | correction |
| `6282:3364` | `logo_hor` (status row variant: pending) | `NetworkLogo` | image part only, no link | icon #1C180D → no token (image content) | correction |
| `6282:3285` | `Success` badge, with `I6282:3285;1003:19143` icon `icon/check-circle` and `I6282:3285;1003:19144` text | `TxStatus` | status ok, as shipped | background → badge.green.bg · text → badge.green.fg | color |
| `6282:3326` | `Failed` badge, with `I6282:3326;1003:19146` icon `icon/close-circle` and `I6282:3326;1003:19147` text | `TxStatus` | status error, as shipped | background → badge.red.bg · text → badge.red.fg | color |
| `6300:9177` | `Loaders/Circular-Progress` (pending status) | `Spinner` | size md (20px); swaps with `TxStatus` in the one status slot | icon #E2E8F0 → no token | correction |
| `6300:9135` | `Swap ` (action type) | `Heading` | level 3, textStyle heading.md, color text.secondary | text → text.secondary | correction |
| `6300:9138` | `813.62`, with `6300:9140` icon `Unknown_TOKEN` and `6300:9141` `CASHCAT` | `TokenValue` | tokenEntityProps noLink; token icon 20px (TokenEntity icon, placeholder fallback); heading.lg as drawn | text → text.primary | correction |
| `6300:9143` | `for` (connecting word) | `Text` | textStyle heading.md, color text.secondary (node is drawn text.primary 24/32; D4 wins) | text → text.primary | correction |
| `6300:9145` | `0.03613`, with `6300:9147` icon `Unknown_TOKEN` and `6300:9148` `WETH` | `TokenValue` | tokenEntityProps noLink; token icon 20px; heading.lg as drawn | text → text.primary | correction |
| `6282:3415` | `0xA6...5306`, with `6282:3412` icon `+` (EIP-7702 identicon) | `AddressEntity` | noLink, noCopy, truncation constant · override fontWeight=500 | text → text.primary | context |
| `I6282:3424;20543:278991` | `0x1cb...a149`, with `6282:3423` icon `Contract` (regular contract) | `AddressEntity` | noLink, noCopy, truncation constant · override fontWeight=500 | text → text.primary · icon → icon.primary | context |
| `6294:3651` | `0xA6...5306`, with `6294:3648` icon `Avatar` (identicon) | `AddressEntity` | noLink, noCopy, truncation constant · override fontWeight=500 | text → text.primary | context |
| `I6294:3660;20543:278991` | `0x1cb...a149`, with `6294:3659` icon `Contract` (proxy contract) | `AddressEntity` | noLink, noCopy, truncation constant · override fontWeight=500 | text → text.primary · icon → icon.primary | context |
| `6294:3735` | `0xA6...5306`, with `6294:3732` icon `Avatar` (identicon) | `AddressEntity` | noLink, noCopy, truncation constant · override fontWeight=500 | text → text.primary | context |
| `I6294:3744;20543:278991` | `0x1cb...a149`, with `6294:3743` icon `Contract` (verified proxy contract) | `AddressEntity` | noLink, noCopy, truncation constant · override fontWeight=500 | text → text.primary · icon #38A169 → no token (green.500) | context |
| `6294:3771` | `0xA6...5306`, with `6294:3768` icon `Avatar` (identicon) | `AddressEntity` | noLink, noCopy, truncation constant · override fontWeight=500 | text → text.primary | context |
| `I6294:3780;20543:278991` | `0x1cb...a149`, with `6294:3779` icon `Contract` (verified contract) | `AddressEntity` | noLink, noCopy, truncation constant · override fontWeight=500 | text → text.primary · icon #38A169 → no token (green.500) | context |
| `6282:3421` | `interacted with` | `Text` | plain connector between the two `AddressEntity`; not `AddressFromTo` | text → text.secondary | correction |
| `6294:3657` | `interacted with` | `Text` | plain connector | text → text.secondary | correction |
| `6294:3741` | `interacted with` | `Text` | plain connector | text → text.secondary | correction |
| `6294:3777` | `interacted with` | `Text` | plain connector | text → text.secondary | correction |
| `6282:3515` | `Date` | `Text` | row label | text → text.secondary | correction |
| `6282:3517` | `Nov 04 2026` | `Time` | date-only format (new format needed) | text → text.secondary | shape |
| `6282:3523` | `Time` | `Text` | row label | text → text.secondary | correction |
| `6282:3525` | `02:51:55 +4:00 UTC` | `Time` | time-only format (new format needed); the lighter `+4:00 UTC` suffix is icon.secondary; real format follows the user setting | text → text.secondary | correction |
| `6282:3531` | `Tx fee` | `Text` | row label | text → text.secondary | correction |
| `6282:3533` | `0.000003268416333 ETH  $0.01` | `TxFee` | as shipped, USD in parentheses; one line, right-aligned; the lighter `$0.01` run is icon.secondary · override color=text.secondary | text → text.secondary | correction |
| `6282:3536` | `table_divider` | `Separator` | between the Tx fee and Chain rows | icon #101112/6 → no token | correction |
| `6282:3541` | `Chain` | `Text` | row label | text → text.secondary | correction |
| `6282:3544` | `Robinhood Chain` | `Text` | chain name | text → text.secondary | correction |
| `6282:4031` | `Tx hash` | `Text` | row label | text → text.secondary | correction |
| `6282:4034` | `0x1ea...e7c34` | `TxEntity` | noIcon, noLink, noCopy, truncation constant · override color=text.secondary | text → text.secondary | context |
| `6282:3588` | `Transaction details` button, with `I6282:3588;22463:46693` label | `Button` | variant subtle, size md, as shipped (no override); grows in the actions row | background #101112/4 → badge.gray.bg, tag.root.subtle.bg (neither is the button's token) | correction |
| `6282:3589` | `Connect` (copy-link button, link glyph) | `CopyToClipboard` | type link; default styles customised to the mockup look: filled, 44×40, fixed width; no override recorded — the node resolved no token for its fill (#101112/4) | icon #101112/4 → no token | correction |
| `6282:3590` | `Copyright © Blockscout Limited 2023-2026` | `Text` | textStyle xs, color text.secondary; belongs to the page, under the card | text #A0AEC0 → no token | correction |

### Ambiguous

(none)

### Unrecognized

(none)

### Layout questions

- Is the header one logo + one status, or three stacked rows? — nodes `6282:3282`, `6282:3323`, `6282:3364`, `6282:3285`, `6282:3326`, `6300:9177` — a showcase of the three status variants of a single row vs three rows drawn 36px apart — answer: variants of one row (L11); one status slot swaps `Spinner` and `TxStatus`
- Is the parties block one row or four? — nodes `6282:3410`, `6294:3646`, `6294:3730`, `6294:3766` — a showcase of four address-icon variants of one row vs four stacked 52px rows — answer: variants of one row (L11); the row fills the panel and truncates on overflow (L9)
- How do the summary block and the parties row join? — nodes `6300:9134`, `6282:3410` (and the showcase copies `6294:3646`, `6294:3730`, `6294:3766`) — two separate filled boxes with a 1px gap vs one rounded container with an inner divider — answer: one panel with an inner divider (L1); fill blackAlpha.50 in light, whiteAlpha.100 in dark; not a Badge / Tag. No override recorded: the tool rejects `bg=blackAlpha.50` for these nodes, so the panels stay here without a component
- Where does the summary sentence break? — nodes `6300:9135`, `6300:9138`, `6300:9141`, `6300:9143`, `6300:9145`, `6300:9148` — fixed lines vs the action type on its own line and the rest one centered run that wraps — answer: action type on its own line, the rest wraps freely (L3)
- Is the divider its own element? — node `6282:3536` — a separate divider element between the two row groups vs a border on a row group — answer: a `Separator` element (L2)
- Are the detail rows a table? — nodes `6282:3515`, `6282:3517`, `6282:3523`, `6282:3525`, `6282:3531`, `6282:3533`, `6282:3541`, `6282:3544`, `6282:4031`, `6282:4034` — label-left / value-right flex rows vs a two-column table — answer: flex rows, not a table (L12); the table conventions do not apply (B1)
- Card surface and page backdrop (answered, not raised as a question in the readout) — node `6282:3276` — answer: the card is bg.primary (the node's resolved token); the page background is blackAlpha.50 in light, whiteAlpha.50 in dark (L4); the card is centred in the viewport (L5)
- Actions row (answered, not raised as a question in the readout) — nodes `6282:3588`, `6282:3589` — answer: the button grows, the copy button is fixed, gap 8px (L7)

### By convention

(none — the card is not a table; reviewed as empty, B1)

## Entry point, "Additional info" popup — [6267:4403](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6267-4403)

Sidecar `/Users/tom/Dev/bs/.ai/design-readout/CEgxqWOzVulwfTUHhs0gUC-6267-4403.json` · color mode `light` · file version `2420937091460480665` · regions `6267:4535, I6267:4535;30673:54479`

### Recognized

| Node | Content | Component | Props | Tokens | Signal |
| --- | --- | --- | --- | --- | --- |
| `6267:4535` | popup box 322×494 | `PopoverContent` | `w=330px` (shipped width stays, see Layout questions) | `background → bg.primary` (#FFFFFF; shipped `popover.bg`, same hex) | `color` |
| `I6267:4535;29850:2960` | `Additional info ` | `Heading` | `level=3 mb=4` | `text → text.primary` (#101112/80) | `correction` |
| `I6267:4535;32325:62161` | `Success` (text `I6267:4535;32325:62161;1003:19144`) | `TxStatus` | as shipped, with its status icon; the mockup draws no icon | `background → badge.green.bg` (#F0FFF4) · `text → badge.green.fg` (#38A169) | `correction` |
| `I6267:4535;32325:61107` | `Transaction fee` | `Text` | `color=text.secondary fontWeight=600` | `text → text.secondary` (#718096) | `correction` |
| `I6267:4535;32325:61122` | `0.002395904453623692 ETH ($2.84)` | `TxFee` | `rowGap=0 noTooltip`; 14/20 as shipped, the mockup's 16/24 is stale | `text → text.primary` (#101112/80) | `correction` |
| `I6267:4535;29850:2981` | `table_divider` | `Separator` | `orientation=horizontal`, through the `VStack separator` prop | `icon → none resolved` (#101112/6; shipped `border.divider`) | `correction` |
| `I6267:4535;1770:30602` | `Gas limit & usage by txn` | `Text` | `color=text.secondary fontWeight=600`; text stays "Gas limit & usage by transaction" as shipped | `text → text.secondary` (#718096) | `correction` |
| `I6267:4535;30673:54478` | `208,420` | `Text` | plain formatted number; shipped order stays `gas_used \| gas_limit` | `text → text.primary` (#101112/80) | `correction` |
| `I6267:4535;30673:54482` | `159,319` | `Text` | plain formatted number; shipped order stays `gas_used \| gas_limit` | `text → text.primary` (#101112/80) | `correction` |
| `I6267:4535;30673:54484` | `Progress` (percent text `52.05%` `I6267:4535;30673:54486`) | `Utilization` | `ml=4`; as shipped, the mockup's track fill and weight 600 are stale | `icon → none resolved` (#EDF2F7) · `text → text.success` (#38A169) | `correction` |
| `I6267:4535;29850:2978` | `table_divider` | `Separator` | `orientation=horizontal`, through the `VStack separator` prop | `icon → none resolved` (#101112/6; shipped `border.divider`) | `correction` |
| `I6267:4535;1772:30658` | `Gas fees (Gwei)` | `Text` | `color=text.secondary fontWeight=600` | `text → text.secondary` (#718096) | `correction` |
| `I6267:4535;1772:30681` | `Base: 13.538410068\nMax: 20.27657523\nMax priority: 1.5` | `NativeCoinValue` | `units=gwei unitsTooltip=wei noSymbol fontWeight=700`, one per line after its label; 14/20 and bold values as shipped, the mockup's 16/24 weight 400 is stale | `text → text.primary` (#101112/80) | `correction` |
| `I6267:4535;29850:2972` | `table_divider` | `Separator` | `orientation=horizontal`, through the `VStack separator` prop | `icon → none resolved` (#101112/6; shipped `border.divider`) | `correction` |
| `I6267:4535;1774:30685` | `Others` | `Text` | `color=text.secondary fontWeight=600` | `text → text.secondary` (#718096) | `correction` |
| `I6267:4535;29850:2975` | `table_divider` | `Separator` | `orientation=horizontal`, through the `VStack separator` prop | `icon → none resolved` (#101112/6; shipped `border.divider`) | `correction` |
| `I6267:4535;1770:30534` | `More details` | `Link` | default variant, `mt=1 w=fit-content`; left side of the footer row | `text → link.primary` (#2B6CB0) | `correction` |
| `I6267:4535;34393:1276` | `Receipt` icon 20×20 | `SpriteIcon` | `name=receipt boxSize=5 color=icon.secondary`; the `receipt` sprite icon is new, to be exported from Figma | `icon → icon.secondary` (#A0AEC0) | `correction` |
| `I6267:4535;34393:1277` | `Receipt` | `Link` | `variant=secondary external noIcon`; the spec's variant wins over the mockup's #A0AEC0 | `text → none resolved` (#A0AEC0; the variant gives `link.secondary` #718096) | `correction` |

### Ambiguous

- `I6267:4535;1774:30696` `Txn type: 2 (EIP-1559)  \nNonce: 4 \nPosition: 132` — settled in substance: stays as shipped in
  `src/slices/tx/components/TxAdditionalInfoContent.tsx` (three lines, values `fontWeight=700`, "(EIP-1559)" in
  `text.secondary`); the mockup's single weight-400 node is a stale sample — proposal none (the decision names no
  component, so no correction is recorded) — gap `context`

### Unrecognized

- `I6267:4535;30673:54479` INSTANCE `Divider_menu` 1×16, between the two gas numbers — values missing: the tool
  dropped it as chrome on the name match "menu", so the node is not in the sidecar and `--correct` rejects it
  ("Node I6267:4535;30673:54479 is not in the sidecar of 6267:4403") — proposal `TextSeparator`
  (`src/shared/texts/TextSeparator.tsx`, as shipped, settled by the developer) — gap `shape`

### Layout questions

- Is the "Value" section removed from the popup? — nodes `I6267:4535;32325:62161`, `I6267:4535;32325:61107` — shipped
  renders "Value" as the first section after the status, the mockup goes from the badge straight to "Transaction
  fee": the mockup is a stale sample, or the redesign drops the section — the "Value" section stays.
- Where does `Receipt` sit in the footer row? — nodes `I6267:4535;1770:30534`, `I6267:4535;34393:1276`,
  `I6267:4535;34393:1277` — one row with `justify-content: space-between` and `Receipt` pinned right, or `Receipt`
  directly beside "More details" — one row, `justify-content: space-between`; "More details" left, icon + "Receipt"
  pinned right, 8px between the icon and the text.
- Popup width — node `6267:4535` — mockup 322 (content 290 + 16 padding each side), shipped `PopoverContent
  w="330px"`: keep 330, or change to 322 — the width stays 330.

### By convention

## Entry point, transaction details page — [6267:4363](https://www.figma.com/design/CEgxqWOzVulwfTUHhs0gUC/?node-id=6267-4363)

Sidecar `/Users/tom/Dev/bs/.ai/design-readout/CEgxqWOzVulwfTUHhs0gUC-6267-4363.json` · color mode `light` · file version `2420937091460480665` · regions `6267:4402`

### Recognized

| Node | Content | Component | Props | Tokens | Signal |
| --- | --- | --- | --- | --- | --- |
| `6267:4402` | `Receipt icon` (32×32 button; inner `Receipt` icon 20×20, `I6267:4402;33359:28676`) | `IconButton` wrapping `SpriteIcon` | `variant=icon_background size=md` · `SpriteIcon name=receipt` — a new sprite icon, to be exported from Figma (none in `src/sprite/icons/`) | sidecar: `icon → #F7FAFC`, no token resolved. Wrong role: `#F7FAFC` is the button background (`gray.50` = `button.icon_background.bg`); the glyph is `#A0AEC0` (`gray.400` = `icon.secondary`), absent from the sidecar. Both are what the `icon_background` variant sets. The sidecar carries no wrapper radius or padding and no inner-icon leaves | `correction` |

### Ambiguous

### Unrecognized

### Layout questions

- Where the button sits in the summary line — nodes `6267:4402` — (a) inside the right-hand `Flex gap={3}` of `TxSubHeading`, as a sibling of `ActionsMenu`; (b) directly after the summary content, outside that Flex, with its own margin — answer: (a), inside the right-hand `Flex gap={3}` of `TxSubHeading`, after `ActionsMenu`
- Mobile placement (the frame is desktop only) — nodes `6267:4402` — (a) drops to the second row with `ActionsMenu` / `AlternativeExplorers`, as shipped; (b) stays inline with the summary sentence — answer: (a), drops to the second row with `ActionsMenu` / `AlternativeExplorers`, as shipped

### By convention
