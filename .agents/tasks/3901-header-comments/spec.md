# Define which header comments the code-quality rule allows and align the existing ones

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3901 |
| Feature branch | `issue-3901` |
| Demo | none |

## Context & goal

The "Comments" section of the code-quality rule forbids every comment except one that explains why the
obvious code is wrong. The repository nevertheless holds about 680 top-level comment blocks outside
specs, most of them written while that rule was in force, and some documents name a module's header
comment as the only description of a helper. The review of #3889 hit the contradiction and deferred it
here.

A reading of about 150 of the multi-line blocks found three kinds:

- **Why-notes**, about a third: why the obvious code is wrong. Already allowed.
- **Caller contracts**, about a tenth: when a shared helper applies, what the caller must do around the
  call, what the call changes. Worth allowing.
- **Narration**, about half: how a subsystem fits together, who calls the module today, how it used to
  work, a walk through the implementation, a restatement of the name and types. Some of it is already
  false: a path to a directory that was since moved, references to a previous implementation, the same
  paragraph retold in five files next to a `CONTEXT.md` that covers it.

What separates the comments that stay true from those that rot is what they are coupled to. A statement
about the file's own contract becomes false only when that file is edited, so the comment is in the same
diff. A statement about other files becomes false through an edit somewhere else, and nobody sees it.

The goal: the rule says which header comments are allowed by that test, a lint check holds the part of
it that can be checked mechanically, and the existing comments follow the rule.

## Functional requirements

### The rule

1. The "Comments" section keeps its opening ban and names exactly two exceptions: the why-comment, as it
   is today, and the header comment.
2. A header comment tells a caller what the name and the signature cannot, and states only what can
   become false through an edit to the same file. This locality test is the criterion; the
   allowed / not-allowed table from the issue's draft is given as examples of it.
3. A header comment is allowed only on a module that is imported from outside its own directory: a
   shared util, a test helper, a setup file, a script. A component or a page gets none.
4. At most one header comment per exported declaration, placed above it, and at most one at the top of
   the file for a contract of the module as a whole.
5. A header comment may name an alternative module or the area's `CONTEXT.md` as a bare pointer. It does
   not describe what that file does.
6. The call-sample test from the issue's draft is in the rule as drafted.
7. The rule forbids JSDoc: "Do not write JSDoc (`/** */`). A header comment is an ordinary comment like
   any other." It prescribes no delimiter beyond that.
8. The rule states that an export whose name and signature tell the caller everything gets no header
   comment, and that this is the usual case.

### The lint check

9. `pnpm lint:eslint` fails on a comment longer than 8 prose lines, whatever its delimiter and wherever
   it sits: top level, inside a function body, inside JSX, in a spec. Indented call-sample lines and
   bare separator lines are not counted.
10. `pnpm lint:eslint` fails on a `/** */` block. The one exemption is a single-line
    `/** @type … */` annotation in a JavaScript file, which TypeScript reads.
11. Both checks pass on the whole repository when the task lands.

### The sweep

12. Every comment block that is at the top of a file or is three lines or longer, across the repository,
    either passes the rule or is trimmed or removed. This includes spec files and the comment runs inside
    function bodies that exceed the cap.
13. Every `/** */` block is removed, or rewritten as an ordinary comment when its content passes the
    rule.
14. Cross-file narration is deleted. A line of it moves to the area's `CONTEXT.md` only when it passes
    the constraint or gotcha test of the docs rule and that `CONTEXT.md` does not already say it.
15. When a block neither clearly passes nor clearly fails, it is deleted, unless it records a trap
    someone actually hit: a browser quirk, a library bug, a linked issue. Such a block is kept and
    trimmed to the why.
16. Commented-out code is deleted.
17. A document that points at a header comment the sweep removed is corrected in the same change. The
    pointers from the Vitest `CONTEXT.md` to the helper and setup headers stay valid: those headers
    remain the one home of that information.
18. No code behaviour changes: apart from the lint rule and its registration, the diff touches comments
    and documents only.

## Implementation decisions

- The rule change is made in the frontend repository's own code-quality rule. It is not a frozen copy,
  and no home-repo rule or skill changes: the standards axis of the review already reads this rule, so
  review enforcement needs no separate work.
- The two lint checks are one custom ESLint rule, registered in the root ESLint config the way the
  existing custom rules are, with its own spec.
- Delimiter is free apart from the JSDoc ban, because `//` cannot be written inside JSX or
  mid-expression, and ESLint directive comments use the block form.
- The JSDoc form was considered for header comments above exports, for editor hover, and rejected: one
  comment form keeps the rule short, and neither agents nor a reader who can jump to the definition
  depend on hover.
- The module-kind limit is kept on top of the locality test as a cap on sprawl; it is phrased by who
  imports the module, not by which directory the module is in, so a feature's shared runtime module is
  not excluded by its address.
- The sweep is split into tickets by area, with the rule and the lint check first. All tickets land
  together in one pull request.
- Largest areas of the sweep, for sizing the tickets: the mutation-testing, code-complexity and
  design-readout tools, the toolkit, the wallet-connection feature, the Rollbar service, the early-fetch
  primer, the Vitest helpers.

## Out of scope

- A lint check that the file paths named in comments exist. Deferred: it needs a marker syntax to tell a
  real pointer from a sample path or a product name.
- Comments of one or two lines that are not at the top of a file, including old hand-written ones. The
  rule's "do not rewrite comments you did not have to touch" holds for them. Commented-out code and
  JSDoc blocks of any length are the exceptions, per requirements 13 and 16.
- Files under `.agents/tasks/`.
- Licence headers, `@vitest-environment` pragmas and ESLint or TypeScript directive comments.
- Changes to the home repository's rules and skills.
