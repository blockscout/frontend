---
name: prepare-release
description: Prepare the next release of the application (tag, docs, release notes), then publish the pre-release and request a staging roll-up
disable-model-invocation: true
---
# Prepare Release

## Prerequisites: GitHub CLI

This workflow uses `gh` to fetch releases, compare branches, and draft release notes via the GitHub API. **Follow the check-github-cli skill** first (ensure `gh auth status` succeeds; if not, guide the user to install/configure `gh` and do not proceed). The account needs read access to the repo and, if you publish or draft releases, appropriate write access.

## Overview

Prepare the next release of the application.

## Steps

### 1. Get the next release tag name

- Fetch the latest release from GitHub: `gh release list --limit 1` (or `gh release view` for the latest). Retrieve its tag name (e.g. `v1.2.3`).
- **If the user did not specify which version bump to use:** Compute the next **minor** version per [semantic versioning](https://semver.org) (e.g. `v1.2.3` → `v1.3.0`).
- **If the user specified major or patch:** Compute the next **major** (e.g. `v2.0.0`) or **patch** (e.g. `v1.2.4`) version accordingly.
- Use this tag (e.g. `v1.3.0`) as the release tag for all following steps.

### 2. Update `./docs/ENVS.md` and `./docs/DEPRECATED_ENVS.md`

- In both files, replace every placeholder that contains the text "upcoming" with the next release tag followed by a "+". Examples:
  - `"upcoming"` → `"v1.3.0+"`
  - `"<upcoming>"` → `"v1.3.0+"`
- You can use search-and-replace in the editor or a script (e.g. `sed -i '' 's/upcoming/v1.3.0+/g' ./docs/ENVS.md` and similarly for `DEPRECATED_ENVS.md`; adjust for `<upcoming>` if present). Ensure all such placeholders are updated.

### 3. Create release notes

Perform the following sub-steps **in order**.

- **Reference files:** Use `./RELEASE_NOTES.md` as the template and, for format inspiration, this [example release](https://github.com/blockscout/frontend/releases/tag/v2.3.0).
- **Get release notes draft:** Use the GitHub API to generate draft release notes with main as the target (e.g. `gh api repos/OWNER/REPO/releases/generate-notes -f tag_name=<next-tag> -f target_commitish=main -f previous_tag_name=<latest-release-tag>`). Parse the response to get the list of pull request **numbers** and new contributors. Keep this list; every PR in it must appear in the final notes.
- **Fetch and store PR data (labels and descriptions):** Before editing the release notes file, fetch labels and body for all PRs from the draft **once** and save them to a temporary file so later steps do not hit the GitHub API repeatedly. Use the script that rate-limits requests (authenticated API limit is 5000 requests/hour; the script adds a delay between calls).
  - From the **repository root**, run: `node .agents/skills/prepare-release/fetch-release-prs.js <pr-number-1> <pr-number-2> ... --out release-prs-data.json` with every PR number from the release notes draft. Example: `node .agents/skills/prepare-release/fetch-release-prs.js 2725 2726 2727 --out release-prs-data.json`.
  - The script writes JSON to `release-prs-data.json` in the repository root (format: `{ "prs": [ { "number", "title", "author", "url", "labels", "body" }, ... ] }`). Use this file as the **single source of truth** for labels and descriptions in the next two steps; do not call the GitHub API again when mapping sections or writing the ENV section.
- **Copy and fill the notes file:** Copy `./RELEASE_NOTES.md` to a new file `./RELEASE_NOTES_<release-tag>.md` (e.g. `RELEASE_NOTES_v1.3.0.md`).
- **Map PRs to sections:** For each section in the new file **except** "Changes in ENV variables", add the relevant pull requests. **Use only the data in `release-prs-data.json`** (labels, title, author, url) — do not call the GitHub API again. For each line use the format: `- <pull-request-title> by @<author> in <link-to-pull-request>`. Example: `- API documentation page by @tom2drum in https://github.com/blockscout/frontend/pull/2725`. Capitalize the first letter of the PR title if needed. Assign PRs to sections using each PR’s **labels** from the stored file and this mapping:

  | Section                   | Labels                                      |
  | ------------------------- | ------------------------------------------- |
  | New Features              | feature, enhancement, client feature        |
  | Bug Fixes                 | bug                                         |
  | Performance Improvements  | performance                                 |
  | Dependencies updates      | dependencies                                |
  | Design updates            | design                                      |

If a PR has no matching labels, try to categorize it based on its description (the **body** field in the `release-prs-data.json` file). If the section remains unclear, categorize it as "Other Changes." Never exclude a PR from the notes. The list of PRs in the release notes must match exactly the list from "Get release notes draft." Always double-check this.

- **"Changes in ENV variables" section:**
  - From `release-prs-data.json`, find all PRs whose **labels** include `"ENVs"` (or `ENVs`). Use their **body** field as the PR description.
  - For each of those PRs, strip the "Checklist for PR Author" part from the body if present. Then, summarize the changes to the ENV variables and rephrase them if necessary. If you are unable to determine the changes or are unsure, use the placeholder: "Cannot find any changes in ENVs in PR description."
  - Write the section in this form (grouped by PR number):
    ```
    - <pull-request-number>:
        - <change-1>
        - <change-2>
    ```
  - Examples:
    - #3005
      - Added `NEXT_PUBLIC_AD_BANNER_ENABLE_SPECIFY` to enable the Specify ad provider for users with a connected wallet.
      - Removed the `hype` option from the `NEXT_PUBLIC_AD_BANNER_PROVIDER` variable values.
    - #2968
      - Added `NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_METRICS` to display information on the uptime dashboard page.

- **Final edits in the release notes file:**
  - Update "Full list of the ENV variables" and "Full Changelog" with the correct version tags/links.
  - Update the "New Contributors" section if the "Get release notes draft" response included new contributors.
  - Leave the "Compatibility" section content unchanged.

### 4. Verify with the user (stop and wait)

The release notes draft and the doc changes are now prepared but **nothing has been committed or published**. Hand control back to the user for review:

- Tell the user the path to the release notes draft (`./RELEASE_NOTES_<release-tag>.md`) so they can open and **manually edit** it.
- Show a `git diff` of the doc changes (`docs/ENVS.md` and `docs/DEPRECATED_ENVS.md`) so they can see exactly what changed and edit those files too if needed.
- Explicitly ask the user to reply once everything is in place.
- **Stop and wait.** Do not commit, tag, or push anything until the user confirms.
- After the user confirms, **re-read** `docs/ENVS.md`, `docs/DEPRECATED_ENVS.md`, and the release notes draft, since the user may have edited them.

### 5. Commit and push the docs to `main`

Once the user has confirmed:

- Stage **only the changed files under `docs/`** (typically `docs/ENVS.md` and `docs/DEPRECATED_ENVS.md`). Stage them explicitly by path — **never** `git add -A`.
- **Do not commit** the release notes draft (`RELEASE_NOTES_<release-tag>.md`) or the temp artifact `release-prs-data.json` (the latter is gitignored anyway).
- Commit with the message `chore: prepare release <release-tag>` (e.g. `chore: prepare release v1.3.0`).
- Push **directly to `main`** (branch protection is off for the release author). If there were no doc changes to stage, skip the commit/push and continue.

### 6. Create and publish the pre-release

Publish a pre-release for the `-alpha` variant of the tag. This single command creates and pushes the `-alpha` tag, which fires the `pre-release.yml` workflow (it triggers on a pushed tag matching `v[0-9]+.[0-9]+.[0-9]+-[a-z]+*`).

- Build the alpha tag by appending `-alpha` to the release tag: `<release-tag>-alpha` (e.g. `v1.3.0-alpha`).
- Run:
  ```
  gh release create <release-tag>-alpha \
    --target main \
    --prerelease \
    --title "<release-tag>-alpha" \
    --notes-file ./RELEASE_NOTES_<release-tag>.md
  ```
  - `--prerelease` is GitHub's "Pre-release" release label (the `prerelease` boolean) — it marks the release as non-production-ready.
  - `--target main` makes the tag point at the latest `main` (the commit you just pushed).
  - The notes body is the **draft you prepared** (named for the final `v…` tag, even though the published tag is the `-alpha` one).
- Capture the published release URL from the command output (or `gh release view <release-tag>-alpha --json url -q .url`) — you'll need it for the Slack message.

### 7. Wait for the pre-release workflow to finish (background, auto-resume)

The pushed `-alpha` tag triggers `pre-release.yml`, which builds and publishes a Docker image and usually takes **~30 minutes**. Do **not** block the session watching it in the foreground.

- Find the run for the tag:
  ```
  gh run list --workflow=pre-release.yml --limit 5
  ```
  Identify the run for the `-alpha` tag / the commit you just pushed and capture its `<run-id>`.
- Start a **background** watcher so the session stays interactive (the user can keep chatting; the harness re-invokes you when it exits):
  ```
  gh run watch <run-id> --exit-status --interval 60
  ```
  Run this with `run_in_background: true`. `--exit-status` returns non-zero if the run fails.
- When the watcher exits:
  - **Success (exit 0):** continue to step 8.
  - **Failure (non-zero):** report which job failed with a link to the run (`gh run view <run-id> --web` URL), and **do not** post to Slack. Let the user decide how to proceed.
- **Fallback:** if the background watch dies early (e.g. a network drop over the long run), do a single `gh run view <run-id> --json status,conclusion` to determine the real state before deciding.

### 8. Request a staging roll-up in Slack (draft, then send on approval)

Once the pre-release workflow has finished **successfully**, ask the DevOps team to roll up the new pre-release on staging.

- Build the message from `./slack-message-template.md` (in this skill directory) — it holds the format, the breaking-ENV-change rule, the target channel, and the QA cc. Fill it with the `-alpha` tag, the breaking-ENV list derived per that rule (or `None.`), and the pre-release URL from step 6. The breaking-ENV input comes from the "Changes in ENV variables" section / `release-prs-data.json`.
- **Draft first:** show the user the fully rendered message and **wait for their approval** before sending it to the channel.
