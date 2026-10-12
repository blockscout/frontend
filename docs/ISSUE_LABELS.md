# Issue and PR labels

Every label in use on `blockscout/frontend`, by what it is for. GitHub shares one label set between
issues and PRs; the "On" column says where a label is meant to go. A label not listed here is unused:
delete it rather than pick it up.

## Category

The rules the PR check enforces are in [RELEASING.md](./RELEASING.md#labels); which release-notes section
each label maps to is in [RELEASING.md](./RELEASING.md#release-notes-sections), and the code source of
truth for both is `tools/release/categories.ts`.

| Label | On | Meaning |
| --- | --- | --- |
| `feature` | both | New substantial feature. |
| `enhancement` | both | Improvement of an existing feature, or a small new one. |
| `client feature` | both | Feature requested by, and specific to, a client chain. |
| `bug` | both | Something isn't working. |
| `performance` | both | Performance improvement. |
| `design` | both | UI and UX changes. |
| `refactoring` | both | Code restructuring without a behaviour change. |
| `tech` | both | Building, testing, and other project tooling. |
| `devops` | both | CI, deployment, infrastructure. |
| `dependencies` | PR | A PR whose sole purpose is a package bump. |
| `chore` | both | Catch-all when nothing above fits. |

## Release mechanics

Read or written by the release workflow, see [RELEASING.md](./RELEASING.md).

| Label | On | Meaning |
| --- | --- | --- |
| `backport` | PR | Set by hand on a merged PR: ship it in the release being prepared. The next `prepare` or `alpha` picks it. Replaced by the version label when the PR is released; a PR that was never picked keeps it. With two lines open, both pick it; once one publishes and stamps its version label, the other's tag is refused until the pick is dropped. |
| `pre-release` | both | Set by `pre-release.yml` on the PRs an alpha shipped and the issues they close; removed by `release.yml` at the final release. |
| `vX.Y.Z` | both | Set by `release.yml` on every PR the final tag shipped and the issues they close. A PR carrying a version label is never relabeled, never picked onto another release branch, and never listed in another release's notes. |
| `release` | PR | A PR of the release mechanics rather than a change to ship; the PR check skips it. |

## Workflow state

| Label | On | Meaning |
| --- | --- | --- |
| `triage` | issue | Needs triage. |
| `available for contribution` | issue | Open to external contributors, as newly submitted issues are; who may take the rest is in [CONTRIBUTING.md](./CONTRIBUTING.md). |
| `task for agent` | issue | Scoped for an AI agent to implement through the task workflow. |
| `epic` | issue | Umbrella issue tracking a set of sub-issues. |
| `need info` | issue | Waiting for more information from the author; `stale-issues.yml` marks it `stale` and then closes it when nothing happens. |
| `stale` | issue | Set by `stale-issues.yml`; do not set by hand. |
| `need design` | issue | Blocked on a design. |
| `need API` | issue | Blocked on a backend change. |
| `PM review` | issue | Needs a decision from the PM. |
| `research` | issue | Research task, no code expected. |
| `duplicate` | issue | Closed as a duplicate. |
| `wontfix` | issue | Closed, will not be worked on. |
| `don't merge` | PR | Not to be merged even if approved. |
| `skip checks` | PR | The Checks and CodeQL workflows do not run while it is set. For long-running drafts; remove it before review. |

## Scope

Orthogonal to the category; add alongside one.

| Label | On | Meaning |
| --- | --- | --- |
| `multichain explorer` | issue | Multichain explorer work. |
| `WaaS Pilot` | issue | Wallet-as-a-Service pilot work. |
| `ENVs` | PR | Adds, changes or deprecates an environment variable (`docs/ENVS.md` changed). |
| `breaking changes` | PR | Not backwards compatible with the previous version; the PR description must say what breaks. |
