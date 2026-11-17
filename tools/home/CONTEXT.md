# Home repo dependency — context

The home repo, [`blockscout/frontend-home`](https://github.com/blockscout/frontend-home), holds the developer
tools this repo shares with the other frontend repositories. It is a dev dependency installed from GitHub
and pinned by commit, and its `prepare` script builds the tools at install. Nothing of a shared tool is in
this tree except its configuration.

## Tools

What a tool checks, how to read its output and how it works are in its own `CONTEXT.md` in home. A tool
gets one row here and nothing more. A wrong finding or a missing feature is fixed in home, and then the
pin is bumped here.

| Command | Runs as | Context in home | Configuration here |
|---|---|---|---|
| `doc-links` | `pnpm lint:doc-links`, and a step of the Checks workflow | [the `doc-links` context](https://github.com/blockscout/frontend-home/blob/main/tools/doc-links/CONTEXT.md) | `doc-links.config.json` at the repo root. `src/toolkit/package` stays excluded: it is published to npm as its own package |

## The pin

Move it with `pnpm home:bump [<commit-or-ref>]`, then commit the three files it changes.

- **The pin is written twice, and `pnpm home:bump` is the only way to change it.** pnpm refuses a git
  dependency's `prepare` script unless `allowBuilds` in `pnpm-workspace.yaml` names the package with its
  exact commit, so the commit is in `package.json` and in that key. Edit one by hand and the install stops
  with `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`.
- **Pin a commit on home's main branch.** A commit of a branch that is later squashed or deleted becomes
  unreachable, and then every install here fails, CI and the Docker image included.
- **Every install builds it, the Docker image's too.** The dependency stage of the `Dockerfile` installs
  dev dependencies, so the image build fetches home from GitHub and runs its `prepare`. A tool that makes
  that step slow is a reason to move home to a release tarball, not to commit build output here.
