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
- **B. Finalize draft** — a **draft** PR already exists for the branch and the work is done (spec's last
  box checked, or the user asks to make it ready for review).
- **C. Regular PR** — no PR exists and the work is already done (a task executed without the spec
  workflow). This is the classic flow.
- A non-draft PR already exists → don't create or update anything; write the description content as a
  summary for the user (per Mode C step 2), tell them the PR is already open, and link to it.

If the signals conflict or are ambiguous, ask the user which mode they mean.

## Mode A — Draft placeholder (spec time)

At this stage nothing is implemented, so **do not** describe changes, env vars, or checklists — the
description is a placeholder pointing at the plan:

1. **Prepare the branch** — commit the spec if needed (with the user's approval), push with `-u`.
2. **Compose the placeholder body** (skip the PR template — it describes finished work):
   - `Resolves #<ISSUE_NUMBER>` when the branch matches `issue-\d+` (ad-hoc spec branches have no issue —
     omit).
   - One short paragraph: the task's goal, taken from the spec's **Context & goal**.
   - A link to the spec file on this branch (`.agents/tasks/<dir>/spec.md`).
   - A note that this is a **spec-first draft**: the branch will receive the task's work subtask by
     subtask, and the final description will be written when the PR is marked ready for review.
3. **Confirm with the user**, then create as draft: `gh pr create --draft --title "..." --body-file ...`.
   Title = the task title (not "spec for..."; the PR will become the task's PR).
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
   approval, clear message).
2. **Write the description** — see "Writing the description" below.
3. **Confirm with the user**, then create: `gh pr create --title "..." --body-file ...` (add `--draft`
   only if the user asked for it).
4. **Labels** — as Mode B step 3.
5. Link the created PR in the output.

## Writing the description (Modes B and C)

- Use the template from `./docs/PULL_REQUEST_TEMPLATE.md` as the base. Read it and fill in each section.
- **Issue number from branch name:** If the branch name matches `issue-\d+`, extract the number, fetch the
  issue (`gh issue view <N>`), and start the **"Description and Related Issue(s)"** section with
  `Resolves #<ISSUE_NUMBER>`.
- **Summary of changes:** clear and concise, at most two paragraphs; bullet points if needed. Be precise;
  keep it short.
- **Environment variable changes:** if any env vars were added, changed, or documented, compare or read
  `./docs/ENVS.md` (and the validator/ENVS docs if relevant) and add a separate section listing each
  variable change and its **purpose**:
  - **Bad:** "Added `NEXT_PUBLIC_VIEWS_TX_GROUPED_FEES` environment variable to the documentation."
  - **Good:** "Added `NEXT_PUBLIC_VIEWS_TX_GROUPED_FEES` to group transaction fees into one section on the transaction page."
  - **Good:** "Extended possible values for `NEXT_PUBLIC_VIEWS_TX_ADDITIONAL_FIELDS` with set_max_gas_limit to display the maximum gas price set by the transaction sender."
  - **Good:** "Introduced a new option, `"fee reception"`, for the `NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE` variable."
- **Checklist:** keep the "Checklist for PR Author" section from the template and check the items that
  apply (e.g. tested locally, tests added, ENVS/docs/validator updated if env vars changed).
- Always **ask the user for confirmation or changes** before creating/updating the PR.
