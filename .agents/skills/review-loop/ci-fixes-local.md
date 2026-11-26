# CI fixes — what this repo adds

The local part of home's `ci-fixes.md` in the `review-loop` skill: the procedures for the gates only this
repo has. The escape in that file binds every procedure here.

## Playwright screenshot mismatches

Every other Playwright failure — an unmocked request, a timeout, an assertion on text or a role, a failed
mount — is a plain fix under the escape. A **screenshot mismatch** has a baseline question:

1. **Reproduce in Docker**, the only run whose pixels match CI (`.agents/rules/tests-visual.md` has the
   command), and **view the diff image** — the expected, actual and diff files sit together, and the
   `Read` tool renders images.
2. **Decide what the diff is.** Match the changed region to the PR's diff and to the task spec's
   Functional Requirements (`.agents/tasks/<issue>-<slug>/spec.md`; on a non-task PR, the PR body).
   - The diff **is** a requirement — the spec asks for this change, and the pixels show it and nothing
     else → **update the baseline** from the Docker run, and nothing else in that commit. The commit
     message **cites the requirement** by number and phrase, e.g. `Update Holders baseline for FR3
     (balance column shows USD value)`. A baseline from a plain local run is never committed.
   - Anything else — a diff the spec does not ask for, a diff larger than the requirement, a change you
     can explain only as "it moved", a baseline for presentation the spec does not name → **`needs-human`**.
     The question names the test, the image paths and what the spec does and does not say.
