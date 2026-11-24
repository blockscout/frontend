# Home repo dependency — context

The home repo, [`blockscout/frontend-home`](https://github.com/blockscout/frontend-home), holds the developer
tools and configs this repo shares with the other frontend repositories. It is a dev dependency installed
from GitHub and pinned by commit, and its `prepare` script builds the tools at install. Nothing of a shared
tool or config is in this tree except what is this repo's own.

## What comes from home

What a tool checks, how to read its output and how it works are in its own `CONTEXT.md` in home. Each gets
one row here and nothing more. A wrong finding or a missing feature is fixed in home, and then the pin is
bumped here.

| What | Runs as | Context in home | Configuration here |
|---|---|---|---|
| `doc-links` | `pnpm lint:doc-links`, and a step of the Checks workflow | [the `doc-links` context](https://github.com/blockscout/frontend-home/blob/main/tools/doc-links/CONTEXT.md) | `doc-links.config.json` at the repo root. `src/toolkit/package` stays excluded: it is published to npm as its own package |
| The cspell base config | `pnpm lint:cspell`, the pre-commit hook, and a step of the Checks workflow | [the cspell config context](https://github.com/blockscout/frontend-home/blob/main/configs/cspell/CONTEXT.md) | `cspell.jsonc` at the repo root: the import, `gitignoreRoot`, the ignored paths and the words only this repo uses |
| `home-bump` | `pnpm home:bump` | [the pin context](https://github.com/blockscout/frontend-home/blob/main/tools/home-bump/CONTEXT.md) | None |

## The pin

Move it with `pnpm home:bump [<commit-or-ref>]`, then commit the three files it changes. Why the pin is
written twice, which commit to pin and what to do when the command fails are in
[the pin context](https://github.com/blockscout/frontend-home/blob/main/tools/home-bump/CONTEXT.md).

- **Every install builds it, the Docker image's too.** The dependency stage of the `Dockerfile` installs
  dev dependencies, so the image build fetches home from GitHub and runs its `prepare`. A tool that makes
  that step slow is a reason to move home to a release tarball, not to commit build output here.
