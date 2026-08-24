---
name: create-pr
description: >-
  Create or finalize a pull request — three modes: placeholder draft PR at spec time, finalize a draft
  into ready-for-review, or a regular PR right away for work done outside the task workflow.
---
# Create PR

## Prerequisites: GitHub CLI

This workflow uses `gh` to check for existing PRs, fetch issue details, and create the PR. **Follow the check-github-cli skill** first (ensure `gh auth status` succeeds; if not, guide the user to install/configure `gh` and do not proceed). The account needs read access to the repo and write access to create PRs and manage labels.

## Pick the mode

_Note:_ In the command output, format all URLs as clickable Markdown links: `[Link Text](URL)`.

Check the current branch (`git branch --show-current`) and its open PR (`gh pr list --head <BRANCH> --state open`), then:

- **A. Draft placeholder** — no PR exists and the work is *not done yet*: the branch holds a freshly
  written spec from the task workflow (typically invoked from the `to-spec` skill, or the branch's only
  changes are under `.agents/tasks/`). The PR is a placeholder for work to come.
- **B. Finalize draft** — a **draft** PR already exists for the branch and the work is done: reached via the
  `finalize-task` handoff (which has just pruned the task folder down to `spec.md`), or the user asks to
  make it ready for review.
- **C. Regular PR** — no PR exists and the work is already done (a task executed without the spec
  workflow). This is the classic flow.
- A non-draft PR already exists → don't create or update anything; write the description content as a
  summary for the user (per Mode C step 2), tell them the PR is already open, and link to it.

If the signals conflict or are ambiguous, ask the user which mode they mean.

## PR title (all modes)

The title must stand on its own — a reader who has never heard of the parent task should understand what
the PR does from the title alone:

- Describe the change in plain language, scoped **accurately** — derive it from the spec's **Context &
  goal**, not from a breakdown shorthand.
- **No** issue numbers, "step N", or internal codenames/jargon (`lever 3`) in the title — those are
  abstract to an outside reader. The parent-task relationship lives in the **description** (`Resolves #N` +
  the spec link).

## Mode A — Draft placeholder (spec time)

**Reached from `to-spec`** after the developer approved the spec content: that approval already covers this
whole mode, so run steps 1–5 without re-confirming. A direct invocation keeps the confirmation in step 3.

At this stage nothing is implemented, so **do not** describe changes, env vars, or checklists — the
description is a placeholder pointing at the plan:

1. **Prepare the branch** — commit `spec.md` and `questions.md` if needed (with the user's approval), push
   with `-u`.
2. **Compose the placeholder body** (skip the PR template — it describes finished work):
   - `Resolves #<ISSUE_NUMBER>` — the branch is `issue-<number>`, so extract the number from it.
   - One short paragraph: the task's goal, taken from the spec's **Context & goal**.
   - A link to the spec file on this branch: `.agents/tasks/<dir>/spec.md`.
   - A note that this is a **spec-first draft**: the branch will receive the task's work ticket by ticket,
     and the final description will be written when the PR is marked ready for review.
3. **Confirm with the user**, then create as draft: `gh pr create --draft --title "..." --body-file ...`.
   Title per "PR title" above (not "spec for..."; the PR becomes the task's PR, describing the whole task).
4. **Labels** — copy the issue's labels (`gh issue view <N> --json labels`). Skip ENVs/dependencies
   labels — nothing is implemented yet; Mode B adds them from the real diff.
5. Link the created PR in the output.

## Mode B — Finalize a draft into ready-for-review

1. **Prepare the branch** — ensure everything is committed and pushed; verify up-to-dateness with main
   (`git fetch origin main`, `git rev-list --left-right --count origin/main...HEAD`), merge if the user
   wants; resolve conflicts before continuing.
2. **Rewrite the description** following "Writing the description" below — the placeholder body is
   replaced wholesale: `gh pr edit <N> --body-file ...`.
3. **Labels from the real diff** — ENVs label if `./docs/ENVS.md` changed; dependencies label only if the
   **dependency sections** of `package.json` changed (`dependencies`, `devDependencies`,
   `peerDependencies`, `pnpm`/`overrides`) — inspect `git diff origin/main -- package.json` and ignore
   changes confined to `scripts` or other fields; plus the issue's labels if not already copied.
4. **Confirm with the user**, then flip: `gh pr ready <N>`. (On flipping, the Checks workflow runs —
   drafts skip it by design.)
5. Link the PR in the output.

## Mode C — Regular PR (work already done)

1. **Prepare the branch** — as Mode B step 1, plus commit any outstanding changes (with the user's
   approval, clear message). When the work sits on `main`, create the branch first: `issue-<number>` when
   it came from an issue, otherwise a kebab-case slug naming the change.
2. **Write the description** — see "Writing the description" below.
3. **Confirm with the user**, then create: `gh pr create --title "..." --body-file ...` (add `--draft`
   only if the user asked for it).
4. **Labels** — as Mode B step 3.
5. Link the created PR in the output.

## Writing the description (Modes B and C)

- Use the template from `./docs/PULL_REQUEST_TEMPLATE.md` as the base. Read it and fill in each section.
- **Issue number from branch name:** If the branch name matches `issue-\d+`, extract the number, fetch the
  issue (`gh issue view <N>`), and start the **Description** section with `Resolves #<ISSUE_NUMBER>`.
- **Summary of changes:** clear and concise, at most two paragraphs; bullet points if needed. Be precise;
  keep it short. This is the **Description** section.
- **The why, whenever there is no spec to hold it.** A diff shows *what* changed; the Description is the
  only place the reasoning survives, and most PRs through this skill have no spec behind them — work done
  by hand, and tasks small enough to finish inside their own grilling session. Add the problem the change
  solves and any decision a reader would otherwise have to reverse-engineer, sourced from wherever it
  actually is:
  - **This conversation**, when the work happened here — the decisions and the alternatives ruled out are
    already in context; use them.
  - **The issue**, when the branch names one — its body states the problem the diff only implies.
  - **The diff and the surrounding code**, otherwise. Infer the intent and write it plainly, then let the
    user correct it at the confirmation step — that is what the confirmation is for. Where the reasoning
    genuinely cannot be recovered, ask the user for it rather than inventing a rationale.
- **Environment variables:** if any env vars were added, changed, or removed, compare or read
  `./docs/ENVS.md` (and the validator/ENVS docs if relevant) and fill the **Environment variables** section
  with each variable change and its **purpose** (write "None" if there are none):
  - **Bad:** "Added `NEXT_PUBLIC_VIEWS_TX_GROUPED_FEES` environment variable to the documentation."
  - **Good:** "Added `NEXT_PUBLIC_VIEWS_TX_GROUPED_FEES` to group transaction fees into one section on the transaction page."
  - **Good:** "Extended possible values for `NEXT_PUBLIC_VIEWS_TX_ADDITIONAL_FIELDS` with set_max_gas_limit to display the maximum gas price set by the transaction sender."
  - **Good:** "Introduced a new option, `"fee reception"`, for the `NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE` variable."
- **Minimum API version:** fill the **Minimum API version** section from the spec header's **Minimum API
  version** row — it may list several services for a multi-service raise (e.g. "Core API v11.2.4+, Admin RS
  microservice v2.1+"). Mode C or an empty row → infer from the diff or write "None".
