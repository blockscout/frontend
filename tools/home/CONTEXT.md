# Home repo dependency — context

The home repo, [`blockscout/frontend-home`](https://github.com/blockscout/frontend-home), holds the developer
tools this repo shares with the other frontend repositories. It is a dev dependency installed from GitHub
and pinned by commit, and its `prepare` script builds the tools at install. Nothing of a shared tool is in
this tree except its configuration.

It supplies one command today: `doc-links`, which resolves the cross-references in the agent instruction
surface (markdown links, heading anchors, and the file and directory paths written in backticks). It runs
as `pnpm lint:doc-links` and as a step of the Checks workflow.

| Question | Answer |
|---|---|
| How do I move the pin? | `pnpm home:bump [<commit-or-ref>]`, then commit the three files it changes |
| `lint:doc-links` reports a reference. | The reference names nothing: fix the path, or mark it as an illustration with one of the forms the failure output prints |
| The finding is wrong, or the tool needs a change. | The source, its specs and its own [`CONTEXT.md`](https://github.com/blockscout/frontend-home/blob/main/tools/doc-links/CONTEXT.md) are in home. Change it there, then bump the pin here |
| How do I keep a directory out of the check? | `exclude` in `doc-links.config.json` at the repo root |

## Constraints

- **The pin is written twice, and `pnpm home:bump` is the only way to change it.** pnpm refuses a git
  dependency's `prepare` script unless `allowBuilds` in `pnpm-workspace.yaml` names the package with its
  exact commit, so the commit is in `package.json` and in that key. Edit one by hand and the install stops
  with `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`.
- **Pin a commit on home's main branch.** A commit of a branch that is later squashed or deleted becomes
  unreachable, and then every install here fails, CI and the Docker image included.
- **Every install builds it, the Docker image's too.** The dependency stage of the `Dockerfile` installs
  dev dependencies, so the image build fetches home from GitHub and runs its `prepare`. A tool that makes
  that step slow is a reason to move home to a release tarball, not to commit build output here.
- **`src/toolkit/package` stays excluded.** It is published to npm as its own package, so its documents
  are not part of this repo's instruction surface.
