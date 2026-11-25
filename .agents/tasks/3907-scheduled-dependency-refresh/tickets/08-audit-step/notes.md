# 08 — Notes

<!-- cspell:ignore mrhx xvch r5fr rjxr -->

## The command

`pnpm audit --prod --audit-level high`, the step's command, run locally on pnpm 12.4.1 against the
committed lockfile. `--audit-level` sets the exit code, not only what is printed: the same tree exits 1
without it, on moderate advisories alone.

- **On this branch.** Exit 0: "11 vulnerabilities found, Severity: 11 moderate, 1 ignored: 1 high". The
  ignored one is GHSA-mrhx-c7xc-m3w5 (`zod`), read from `audit.ignore` in `pnpm-workspace.yaml`.
- **Without the ignore entry.** With `audit.ignore` emptied, the same command exits 1 on
  GHSA-mrhx-c7xc-m3w5, high, reached from `wagmi` through `@reown/appkit-wallet`.
- **Development dependencies.** Without `--prod`, the command reports 20 moderate advisories and fails on
  none.

## A known-vulnerable version, added locally

Each added to `package.json`, resolved with `pnpm install --lockfile-only`, and reverted with `git
checkout -- package.json pnpm-lock.yaml`. Neither change was committed.

- **A development dependency.** `minimist` 1.2.5 in `devDependencies` (GHSA-xvch-5gv4-984h, critical). The
  step's command still exits 0; without `--prod` it exits 1 on that advisory.
- **A runtime dependency.** `lodash` 4.17.20 in `dependencies` as well. The step's command exits 1 on two
  high advisories: GHSA-35jh-r3h4-6jhm and GHSA-r5fr-rjxr-66jc.
