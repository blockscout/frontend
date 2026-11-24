# 07 — Clear the remaining high and critical runtime alerts

Deferred: it cannot be scoped until ticket 06 shows what the refresh leaves behind.

## Goal

Open alerts of high and critical severity for runtime dependencies are at zero (FR17), and every security
override names the parent that pins the vulnerable version and is a range (FR19).

## Known context

- Before the refresh there were about 35 open high-severity runtime alerts across about 20 packages, all
  for transitive dependencies and all with a patched version.
- What remains after ticket 06 is, per package, one of: bump the parent, add a ranged override, or dismiss
  the alert with a reason. The spec's triage routine (FR20) names when each applies.
- The existing `overrides` in `pnpm-workspace.yaml` already follow the FR19 shape; new entries copy it. An
  existing entry whose parent has moved past the floor is dropped.
- A fix younger than the minimum release age waits, except a critical one, which gets a temporary
  exemption.
- A parent bump may be a major update, or one of a wallet stack package. Either may need its own ticket.

## Blocking unknowns

| Unknown | Owner |
| --- | --- |
| Which advisories remain after the refresh, and through which parents | ticket 06, in its `notes.md` |
| Whether any remaining fix needs a major update of a direct dependency | the developer, once the list exists |

## Scoping

Run `to-tickets` again once ticket 06 has landed. Ticket 08 is blocked by this one: retarget its edge if
this ticket splits.
