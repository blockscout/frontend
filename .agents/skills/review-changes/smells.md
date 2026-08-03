# Smell baseline

Thirteen code smells the Standards axis carries on top of whatever `.agents/rules/` documents. Each reads
*what it is* → *how to fix*; match them against the diff.

Three rules bind the baseline:

- **The repo overrides.** A documented rule always wins. Where `.agents/rules/` endorses something a smell
  would flag, suppress the smell — `typescript.md` endorsing `switch` on discriminated unions is the
  standing example.
- **Always a judgement call.** Report a smell as a labelled possibility ("possible Data Clumps"), never as
  a violation.
- **Skip what tooling enforces.** ESLint, `tsc` and cspell already ran; their findings are facts, not
  smells.

One defect, one label. Several smells often describe the same hunk (Primitive Obsession and Data Clumps
usually arrive together) — pick the sharper one and drop the rest, or the report inflates.

## The smells

- **Duplicated Code** — the same logic shape appears in more than one hunk or file in the change.
  → extract the shape, call it from both.
- **Data Clumps** — the same few props or params keep travelling together; a type wanting to be born.
  → bundle them into one type, pass that.
- **Primitive Obsession** — a `string` or `number` standing in for a domain concept that already has a
  type here. → use the existing type.
- **Shotgun Surgery** — one logical change forced scattered edits across many files in the diff.
  → gather what changes together into one module.
- **Divergent Change** — one file is edited for several unrelated reasons. → split it so each module
  changes for one reason.
- **Speculative Generality** — props, params, or abstraction added for needs the spec does not state.
  → delete it; inline back until a real need shows. *The highest-yield smell in agent-written code.*
- **Middle Man** — a component or hook that only forwards to another. → cut it, call the real target.
- **Feature Envy** — a module that mostly manipulates another area's data or internals. → move it to the
  data it envies; see `src/slices/CONTEXT.md` on slice ownership.
- **God Component** — one component fetching, shaping, rendering *and* laying out. → extract a hook, or
  split container from presentation.
- **Effect Escape Hatch** — `useEffect` doing what derived state, an event handler, or a react-query
  option already does. → compute at render, handle in the handler, or configure the query.
- **Prop Drilling** — a prop threaded through three or more levels purely to pass along. → context, or
  compose the children where the data already is.
- **Cloned-Sibling Leftovers** — a new file copied from a neighbour, carrying imports, props, labels or
  comments that do not apply to it. → delete what the new file does not use. *Near-invisible in a
  hunk-only read; found by reading the new file whole.*
- **Dead Scaffolding** — exports, props, types or fixtures the change introduces and never uses.
  → delete them. ESLint catches unused locals, not unused exports.
