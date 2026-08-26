# code-complexity — context

A CI gate that flags code which is both complex and under-tested before it merges, scoped to
what a PR actually changes so it never blocks on pre-existing debt. This ticket (01) ships the
cyclomatic-complexity half; coverage and the CRAP score arrive in a later ticket.

## Running it

```bash
pnpm test:code-complexity                       # gate functions the diff touches vs origin/main
pnpm test:code-complexity --base <ref>          # diff against a different base ref
pnpm test:code-complexity --max-complexity <n>  # override the complexity cap
pnpm test:code-complexity <path...>             # focused mode: score every function in these files
```

`run.sh` compiles the tool with the repo-local TypeScript (emitting to `dist/`, git-ignored) and
runs it — the same compile-on-run pattern as `tools/dev-server/fetch.sh`, so no global toolchain
is needed. The parser is the `typescript` compiler API (`ts.createSourceFile` + `ts.SyntaxKind`);
there is no type-checker and no external service.

Thresholds are defaults in `config.ts`, overridable by flags — CI carries no threshold numbers,
so a local run and a CI run gate identically.

## What counts toward complexity

Per-function cyclomatic complexity starts at **1** and adds **1** for each of:

- `if` and `else if` (each `if` node; a bare `else` adds nothing)
- `for`, `for..of`, `for..in`
- `while`, `do..while`
- each `case` clause
- `catch`
- a ternary (`? :`)
- each `&&`, `||`, `??`, and their compound-assignment forms `&&=`, `||=`, `??=`
- each optional-chaining `?.` (property access, element access `?.[]`, and call `?.()`), since it
  short-circuits like a branch

**Not counted:** a bare `else`, `default:`, the `switch` statement itself, and JSX
(`JsxElement` / `JsxSelfClosingElement` / `JsxFragment`). A `&&`/`||`/`??` written *inside* a JSX
expression container still counts — it is a logical operator, not JSX structure.

This matches the counting of the current ESLint `complexity` rule. Note that a developer can write
`?.` where the value is never nullish (a redundant guard); the tool still counts it, because it
counts syntax, not proven reachability. Whether that over-counts in practice is revisited during
threshold calibration (issue #3663, ticket 04).

Every function is its own unit: nested functions, arrow functions, methods, accessors, and the
constructor each start their own count of 1, and a branch counts toward the innermost enclosing
function. Code at module scope belongs to no function and is not reported.

## Scope

- **Files:** `src/**` `.ts`/`.tsx`, excluding specs (`*.spec.*`, `*.pw.tsx`, `*.pwstory.tsx`),
  declaration files (`*.d.ts`), the toolkit build output (`src/toolkit/package/**`), and anything
  outside `src/` (so `tools/`, `deploy/` fall out for free).
- **Functions (diff mode):** only functions a changed line falls within are gated. A changed line
  is any new-side line of the diff between the working tree and the merge-base of the branch and
  the base ref — this captures the branch's own commits plus uncommitted edits. Functions in a
  changed file that the diff did not touch are listed in the table but never flagged.
- **Focused mode** bypasses diff-scoping entirely and scores every function in the given files.
