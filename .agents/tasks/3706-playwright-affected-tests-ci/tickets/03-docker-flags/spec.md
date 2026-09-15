# 03 — `--docker` / `--docker-deps`: the same run inside the Playwright image

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #3706 |
| Blocked by | T01 |

## What to build

`pnpm test:pw --docker [<args>…]` runs the identical `pnpm test:pw <args>` inside the pinned Playwright
image with the Linux `node_modules_linux` mounted over `node_modules`, which is how CI-matching screenshots
are produced on a Mac. `pnpm test:pw --docker-deps` installs those Linux dependencies into
`node_modules_linux` (what `tools/scripts/pw.docker.deps.sh` does today). The two shell scripts are
deleted; `test:pw:docker` and `test:pw:docker:deps` stay in `package.json` as aliases of the flags. The
image tag is derived from the installed `@playwright/test` version, so a Playwright upgrade cannot leave
the image behind.

## Acceptance criteria

- [x] `--docker` strips itself from the argv, checks `node_modules_linux/.modules.yaml` exists (else exits 1
      with the "install them with `pnpm test:pw --docker-deps`" message), and runs `docker run --rm
      --ipc=host -v <cwd>:/work/ -v <cwd>/node_modules_linux:/work/node_modules -w /work/ <image> bash -c
      '<corepack enable + prepare pnpm@<packageManager version>> && PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false
      pnpm test:pw <remaining args>'`. `-it` is added only when `process.stdin.isTTY`, so an agent or CI
      caller without a terminal does not hit "the input device is not a TTY".
- [x] `--docker-deps` runs the equivalent of `tools/scripts/pw.docker.deps.sh` inside the same image with
      the `blockscout-pnpm-linux` store volume; it is exclusive with every other flag and arg (error
      otherwise).
- [x] The image is `mcr.microsoft.com/playwright:v<version>-noble` with `<version>` read from
      `node_modules/@playwright/test/package.json`; the pnpm version comes from `package.json`'s
      `packageManager` field. Neither is hardcoded in the tool. `config.ts` carries the image *name* and the
      `-noble` suffix with a comment pairing it with `container.image` in `.github/workflows/checks.yml`.
- [x] `package.json`: `test:pw:docker` → `pnpm test:pw --docker`, `test:pw:docker:deps` → `pnpm test:pw
      --docker-deps`; `tools/scripts/pw.docker.sh` and `tools/scripts/pw.docker.deps.sh` deleted.
- [x] `pnpm test:pw --docker <one .pw.tsx> --update-snapshots` completes on a Mac and rewrites that file's
      `__screenshots__` (then `git checkout` them — no baseline changes are committed by this ticket).
- [x] Specs: the docker argv is built by a pure function (`buildDockerCommand(args, { tty, image, pnpm })`)
      and tested for the arg passthrough, TTY toggle, and the deps variant.

## Details

- Inside the container `pnpm test:pw` resolves through the mounted repo, so the inner run is the plain
  ticket-01 path — `--changed` (ticket 02) works inside Docker unchanged because `.git` is mounted with the
  repo.
- `node_modules_linux` is already ignored at the repo root; nothing to add.

## Leaf worklist

- [x] 1 `[agent]` `--docker` / `--docker-deps` flags, `buildDockerCommand`, image/pnpm version derivation;
      specs
- [x] 2 `[agent]` `package.json` aliases, delete the two shell scripts
- [x] 3 `[agent]` One real `--docker` run of a single file with `--update-snapshots`, revert the screenshots;
      `CONTEXT.md` "how do I update screenshots?" row; lint
