# code-complexity — the scoring model

How a function's two scores are computed, and where the model diverges from the references it is
based on. Read this when a score surprises you, or before changing how anything is counted.

The caps in `./config.ts` are calibrated against this exact model, so a change here invalidates them
— see `./CALIBRATION.md`. The decisions behind the divergences are recorded in `./adr/`.

Both scores are produced on **one** walk of the syntax tree in `./complexity.ts`, using the
`typescript` compiler API (`ts.createSourceFile` + `ts.SyntaxKind`). There is no type-checker and no
external service, which is what makes some of the approximations below necessary.

## Cognitive Complexity — the readability gate

CC follows the SonarSource model: flat control flow scores cheap, nesting is penalised
progressively, and boolean runs collapse. A function starts at **0** and accrues:

| Construct | Increment |
| --- | --- |
| `if`, `for`, `for..of`, `for..in`, `while`, `do`, `catch`, ternary (`? :`), `switch` | `1 + nesting²` |
| `else`, `else if` | `+1` (no nesting penalty; the chain stays at its base level) |
| a run of like boolean operators (`&&` / `\|\|`) | `+1` per run |
| direct self-recursion (name match) | `+1` |
| labelled `break` / `continue` | `+1` |

**Nesting** is increased by `if` (its then-branch), `else`/`else if` (their body), ternary (its
branches), the loops, `catch` (its body), and `switch` (its cases). Each of those nesting structures
pays `1 + nesting²` for itself and deepens the level for what it contains, so a construct three
levels in costs `1 + 9`. `switch` gets exactly **one** increment (carrying the nesting penalty)
regardless of how many `case`s it has — unlike cyclomatic, which counts every `case`.

### A worked example

```ts
function classify(items, mode) {
  const out = [];
  for (const item of items) {                    // for-of, nesting 0 → +1
    if (!item.active) continue;                  // if, nesting 1     → +2
    if (mode === 'strict' && item.score > 0) {    // if, nesting 1     → +2
      switch (item.kind) {                       // && run (flat)     → +1
        case 'a':                                // switch, nesting 2 → +5
          out.push(item.a ?? item.b);            // ??                → +0
          break;
        default:
          if (item.fallback) {                   // if, nesting 3     → +10
            out.push(item.fallback);
          }
      }
    }
  }
  return out;
}
```

**CC 21** — over the `behavior` cap. **Cyclomatic 8**, which is the whole point: eight independent
paths is unremarkable, but the shape is hard to read.

Read the accounting: the innermost `if` costs `+10` on its own, half the function's score, purely for
sitting at depth 3. The two `if`s at depth 1 cost `+2` each. Flattening the deepest level by one
would save `5` (`1 + 3²` becomes `1 + 2²`); flattening the `switch` out of the second `if` would take
far more off. The `&&` costs `+1` however deep it sits, and the `??` costs nothing.

That is the model's thesis in one function: **breadth is cheap, depth is not.**

### Boolean sequences

A maximal run of the *same* operator costs `+1`; switching operator starts a new run. `a && b && c` =
`+1`; `a && b || c` = `+2` (an `&&` run and a `||` run). Parentheses break a run. Boolean increments
carry no nesting penalty. Compound logical assignments (`&&=`, `||=`) are not sequence operators and
add nothing to CC.

### Recursion is approximate

With no type-checker, self-recursion is detected by name match — a call whose callee is the bare
identifier the function is bound to. This catches direct self-recursion in a function declaration, a
named function expression, or a `const f = () => … f() …` arrow. It does not catch `this.method()`,
destructured or aliased calls, or indirect and mutual recursion. A documented approximation, not a
bug. Labelled `break`/`continue` is exact (purely syntactic).

### `?.` and `??` are not counted

Optional chaining is excluded per ADR 0001 — CC's model does not treat it as a branch or a nesting
structure, so the exclusion carries over for free. Null-coalescing (`??`, `??=`) is excluded because
the SonarSource white paper itself ignores it as readable shorthand, in the same class as `?.`
(ADR 0002). Cyclomatic complexity still counts `??` — the two scores diverge here on purpose.

### Per-function units, and the nesting reset

Every function is its own unit: nested functions, arrows, methods, accessors and the constructor each
start their own count, and both nesting and increments accrue only to the innermost enclosing
function. **Nesting resets to 0 at a nested-function boundary** — a control structure inside a
callback is scored relative to that callback, not to the component around it.

Constructs at module scope belong to no function and are ignored, matching ESLint's per-function
reporting.

### Contributions

Every increment is recorded as a `{ line, amount, reason, nesting }` contribution, in walk order.
That record is what lets a violation annotation name the sites that cost the most and point at the
deepest nesting pocket, rather than just reporting a number.

## Cyclomatic complexity — the CRAP input

Not a gate on its own. It counts independent paths ≈ tests needed, which makes it the correct input
to CRAP and a poor readability signal: it scores a flat `switch` the same as an equivalent nested
`if` chain, and is blind to nesting. That is why CC, not cyclomatic, is the decomposition gate.

It starts at 1 and mirrors ESLint's `complexity` rule — `if`/`else if`, the loops, every `case`
(`default` excluded), `catch`, ternary, and `&&`/`||`/`??` including their compound-assignment forms
— with `?.` as the one deliberate divergence (ADR 0001).

Because CC governs decomposition, the only fix for a CRAP failure is added coverage, never lowering
`c`. So `CX` is not a default report column; it appears only under `--verbose`, for calibration and
tool debugging.

## CRAP

CRAP (Change Risk Anti-Patterns) combines **cyclomatic** complexity with test coverage — CC never
feeds CRAP:

```
CRAP = c²·(1 − cov)³ + c
```

where `c` is the function's cyclomatic complexity and `cov` is its line-coverage fraction (0..1).
Well-covered code scores near its complexity (`cov = 1` gives exactly `c`); the cubic `(1 − cov)`
term makes complex, untested code explode. At 0% coverage the score is `c² + c`.

### The coverage join

Per-function coverage is read from a v8/istanbul `coverage-final.json` (the v8 provider emits the
istanbul shape). A function's coverage is the fraction of *coverable* lines in its line range that
were executed — a line is coverable when it carries a statement, and its hit count is the highest
among the statements starting on it, exactly as istanbul's `getLineCoverage()` computes it. A
function with no coverable lines counts as fully covered, so CRAP reduces to its complexity.

## Divergences from the reference models

Three, and only these:

1. **Nesting is quadratic, not linear** (ADR 0002). SonarSource charges `1 + nesting`. This is the
   divergence with teeth — identical at depths 0 and 1, biting only from the third level in, so flat
   and shallow code is untouched while genuinely-nested code accelerates away. That is what decouples
   breadth from nesting and lets one cap forgive wide-but-shallow logic while still catching the
   nested tail. No linear cap can separate the two.
2. **Per-function units with a nesting reset** (above). SonarSource instead adds a nesting level when
   descending into a nested function and rolls its complexity up into the parent. Ours matches how
   cyclomatic is reported here. This is the main *structural* divergence.
3. **`?.` and `??` are excluded** (ADR 0001, 0002) — from CC; cyclomatic still counts `??`.

### On comparing against `eslint-plugin-sonarjs`

CC was validated by diffing against that plugin's `cognitive-complexity` rule during calibration. The
plugin was installed temporarily; it is **not** a committed dependency and **not** in the eslint
config. The exercise confirmed the *shape* of the model — which constructs increment, where nesting
deepens, how `switch` and `else if` are treated — and the scores agreed on flat and shallow code.

Numeric parity is **not** expected and is not a regression test. Nesting-heavy code reads higher here
by design: at calibration a hook built from nested `switch` trees scored 23 here against the linear
model's 15. One gotcha if you re-run it: the pinned oracle version (`eslint-plugin-sonarjs@4.2.0`)
itself diverges from the written SonarSource model on boolean operators — it scores pure `||` chains
as 0 and collapses any expression containing `&&` to a single `+1`. We implement the written model and
treat it as authoritative.
