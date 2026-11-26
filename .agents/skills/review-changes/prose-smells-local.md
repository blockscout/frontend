# Prose smell baseline — what this repo adds

The local part of home's `prose-smells.md`.

## Picking the file

Two more rows for the table:

| File | Edited when | Answers |
| --- | --- | --- |
| `.agents/delegation.md` | agent capability or trust changes | *may an agent do this?* |
| `.agents/tasks/README.md` | the product-task workflow changes | *how does a task reach a merged PR?* |

One more consequence worth flagging as a finding:

- **A statement naming a spec artefact** — ticket, leaf, tag, checkbox, breakdown — belongs to the
  workflow layer, not to `delegation.md`, which must read correctly in a repo that never adopted the
  workflow.
