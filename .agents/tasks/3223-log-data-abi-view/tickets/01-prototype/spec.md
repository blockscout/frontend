# 01 — Prototype: "ABI" view of the log "Data" section

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 01 of #3223 |
| Blocked by | none |

> This ticket is a prototype. Its criteria and decisions bind this ticket only. They are not the task's
> requirements: the final version may keep, change or drop any of them (`../../questions.md`, Q01). The
> appearance is provisional. The result stays on a draft PR with a demo and is not merged.

## What to build

A log whose response carries the event ABI gets a display type selector in its "Data" section, with "ABI"
and "Hex". "ABI" shows the event's non-indexed inputs decoded from the raw data as a tree: each value under
its name and type, tuples and arrays nested as the event declares them. "Hex" shows the raw data as today.
A log without the ABI looks exactly as it does now.

## Acceptance criteria

How to verify: `pnpm dev:preset eth`, open
`/tx/0x1f2ff3e83a940adaee84ee765ba1dd9058fe57cebda8b8d804e8e4988d3cf062?tab=logs`

- [ ] A log with `decoded.abi` offers a display type selector in its "Data" section, with the options "ABI"
      and "Hex".
- [ ] "ABI" is selected by default when it is offered.
- [ ] The "ABI" view shows the event's non-indexed inputs only, each under its name and type, with tuples
      and arrays nested as the event declares them and tuple fields named.
- [ ] An address value in the "ABI" view links to that address page.
- [ ] The "Hex" view shows the raw data.
- [ ] "ABI" is not offered when the response has no ABI, when the event has no non-indexed inputs, or when
      the data cannot be decoded with the ABI. No error is shown for it.
- [ ] A log with only the "Hex" option shows no selector, and its "Data" section is unchanged.
- [ ] A log list that offers "UTF-8" today (Zilliqa Scilla) keeps offering it, with the same default.
- [ ] The "Decode input data" section is unchanged.
- [ ] The decode util has a Vitest spec that covers a tuple array, a nested tuple, an event with no
      non-indexed inputs, a missing ABI and data that does not match the ABI.
- [ ] `(human)` On the reference transaction the "ABI" view of the `OrderFulfilled` and `OrdersMatched`
      logs reads correctly, and switching between "ABI" and "Hex" works on the transaction "Logs" tab and
      the address "Logs" tab.

## Details

- **Value source.** Values are decoded on the client with viem from `decoded.abi`, `topics` and `data`. The
  backend's `decoded.parameters` is not the source of the "ABI" view.
- **Decode util.** It lives in the log slice, narrows `decoded.abi` to an event ABI, and returns a result
  type. It never throws to the component.
- **Option set**, built per log: "ABI" when decoding yields at least one non-indexed input, "Hex" always,
  "UTF-8" when the log list passes a default data type. The two existing branches of the "Data" row in
  `LogItem` become one: no selector for a single option.
- **Default selection**: "ABI" when offered, otherwise the default data type passed by the log list,
  otherwise "Hex".
- **Layout.** With a selector, the row is a `RawDataSnippet`: the selector in its header, the content as
  its data. The "ABI" content is the tree built from the `Item` parts of `ContractMethodOutput`
  (`resultPublicClient`), in result mode. "Hex" and "UTF-8" content is the text, as `RawInputData` shows it
  today. The `Alert` wrapper of `ContractMethodOutput` is not used.
- **Copy button**: offered for "Hex" and "UTF-8", not for "ABI".
- **Height**: the "ABI" content is not held to the height limit `RawInputData` sets for the text.
- **Reuse.** The `Item` parts are imported from the contract slice as they are; they are not moved.
- **Surfaces.** The change is inside `LogItem`, so the transaction, address and multichain address log
  lists all get it. `LogDecodedInputData` and its other consumers are not touched.
- **Visual tests.** No new Playwright suite and no new baseline: the appearance is provisional. The
  existing `LogItem` baselines must stay unchanged, since their mocks carry no ABI.
- No env var, no analytics event.

## Leaf worklist

- [x] 1 `[agent]` Decode util for the event's non-indexed inputs, with its Vitest spec
- [x] 2 `[agent]` "Data" row component with the display type selector, wired into `LogItem`
- [x] 3 `[agent]` Log mock with `decoded.abi` for the tuple-array case
