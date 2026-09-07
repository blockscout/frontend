# Mutation testing — suppressing a mutant

A suppression is a **claim** to the reviewer: *this edit cannot change observable behaviour, so no test could have caught it.* It is not a way to turn a red job green. Written as below, a reviewer can verify the claim in the diff; otherwise, ESLint rejects it.

## The only accepted form

```ts
// Stryker disable next-line ConditionalExpression: <reason>
```

This is enforced by `stryker/well-formed-disable`, defined in `../eslint/well-formed-disable.mjs` and included in `pnpm lint:eslint`. Three things are required:

- **`next-line`.** Stryker permits a bare `disable`, which applies to the rest of the file—a blanket mute that continues silencing mutants added months later. A suppression must identify the single exempted line.
- **The mutator name(s), comma-separated** (`ConditionalExpression,EqualityOperator`). `all` is rejected: a survivor is specific, so its exemption must be too.
- **A reason after the colon.** Stryker treats it as optional, but here it is the claim itself. Without it, there is nothing for a reviewer to evaluate.

## What makes the claim legitimate

A suppression is honest when the mutation produces a program **equivalent by construction** — when no assertion could distinguish the versions and adding a test would test the language rather than the code. In practice, this means a defensive guard for a condition the type system already rules out, or an unreachable fallback cheaper to keep than to prove impossible.

It is *not* legitimate when:

- the behaviour differs only in a way that is difficult to reach from a spec—that is a testability problem, and the fix belongs in the code's seams;
- the difference is visual — nothing in a render body is mutated in the first place (`./SCOPE.md`), so a survivor here is behavioural by definition;
- the mutation reveals a dead branch. Delete the branch. Deleted lines generate no mutants and need no comment defending them.

If your reason would be "no test covers this", the finding is `NO COVERAGE`, not a survivor, and it does not fail this gate.