# Review changes — what this repo adds

The local part of home's `review-changes` skill: what its `SKILL.md` leaves to the repository under review.
A session started in home reads it. A session started inside this repo reads the frozen `SKILL.md` beside
it and never this file.

## Checks

```bash
pnpm lint:eslint --changed=<base>
pnpm lint:tsc
pnpm lint:cspell
pnpm test:vitest --changed <base>
```

## Documents

- `.agents/delegation.md` — what an agent may do in this repo and what stays with a human. The standards
  axis reads it.

## Task documents

- **The task folder** comes off the branch name: `issue-<number>` → `.agents/tasks/<issue>-<slug>/`.
- **The spec** is `spec.md` in the task folder. A task with no spec is normal: see "Not every task needs a
  spec" in `.agents/tasks/README.md`.

## Not a finding

- **Missing Playwright screenshot baselines** — human-generated, per `.agents/delegation.md`.
