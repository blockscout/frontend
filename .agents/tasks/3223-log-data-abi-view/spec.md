# Change tuple view in log list view

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3223 |
| Feature branch | `issue-3223` |
| PM | Nikita S. |
| Designer | Tatyana |
| Backend | Victor |
| Minimum API version | Core API v12.0.4+ |
| Demo | eth |

> **This spec is deliberately incomplete.** The task starts with a prototype, and the final behaviour is
> decided from the feedback on it (`questions.md`, Q01). Everything that describes the prototype lives in its
> ticket, `tickets/01-prototype/spec.md`, and binds that ticket only. The sections marked "To be scoped
> after the prototype" below are filled in once Q01 is resolved. Until then they say nothing about the
> final version, and no part of the prototype ticket is a requirement of the task.

## Context & goal

A log whose event carries tuples or arrays of tuples is hard to read today. The "Decode input data" table
prints such a value as a flat positional list with no field names, so the user has to match each position
against the event signature by hand. A reference log list:
https://eth.blockscout.com/tx/0x1f2ff3e83a940adaee84ee765ba1dd9058fe57cebda8b8d804e8e4988d3cf062?tab=logs

The goal is a structured view of the decoded log data, with every value under its field name and nested the
way the event declares it, in the style the contract "Read/Write" method result already uses
(`ContractMethodOutput`).

The task is phased. There are no mockups: the UI is assembled from existing components.

1. **Prototype** — a first take on the view, shown to colleagues to collect feedback.
2. **Final version** — scoped from that feedback.

## Functional requirements

To be scoped after the prototype.

## Data & API

- Resources: the existing log list resources of the core API (transaction logs, address logs). No new
  resource, no new param.
- The log item's `decoded.abi` holds the ABI of the event. It is deployed on production instances; `eth`
  runs v12.0.4 and returns it for both transaction logs and address logs.
- `decoded.abi` together with the log's `topics` and `data` is enough to decode the event on the client
  with viem: checked against the reference transaction and a page of Seaport address logs, including arrays
  of tuples, a nested tuple and an array of `bytes32`.
- The generated response type declares `decoded.abi` as an empty object, so the value has to be narrowed to
  an event ABI before use.
- A Zilliqa Scilla log carries no `decoded` data.

## UI inventory

- Affected component: `LogItem`. It renders on the transaction "Logs" tab, the address "Logs" tab and the
  multichain address "Logs" tab. No new route, no new navigation entry.
- No Figma nodes.
- Which sections of `LogItem` change, and how: to be scoped after the prototype.

## Implementation decisions

To be scoped after the prototype.

## Out of scope

To be scoped after the prototype.
