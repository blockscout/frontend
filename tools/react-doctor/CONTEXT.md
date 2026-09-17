# React Doctor gate

[React Doctor](https://www.react.doctor/docs) catches React bugs ESLint does not: a number before
`&&` rendering a stray `0`, side effects inside state updaters, state synced from props in an
effect. The rule set is `doctor.config.json` at the repo root.

The gate runs on pull requests only and reports only what the branch introduces. The existing
backlog is not gated; a full scan (`pnpm lint:react-doctor`) lists it.

| Question | Answer |
|---|---|
| What would CI say about my branch? | `pnpm lint:react-doctor --scope changed --base origin/main` |
| Why did this rule fire here? | `pnpm lint:react-doctor why path/to/file.tsx:42` |
| What does a rule mean? | `https://www.react.doctor/docs/rules/react-doctor/<rule-name>` |
| Was this rule already tried? | `docs/REJECTED_RULES.md` |
| The finding is wrong. | `// react-doctor-disable-next-line react-doctor/<rule-name>` plus the reason on the same comment |

## Constraints

- **The config is an allowlist.** Every category is off and each rule is enabled by name at `error`,
  with warnings hidden. The tool is pre-1.0 and adds or retunes rules in most releases; with an
  allowlist a version bump cannot fail a PR through a rule nobody reviewed. Do not turn a category on.
- **A rule joins the allowlist only after reading its hits from a full scan.** With every category
  off, a candidate shows nothing until it is named: add it at `error` in `doctor.config.json`, run
  `pnpm lint:react-doctor`, read the hits, then keep it or remove it and add a row to
  `docs/REJECTED_RULES.md`, so the same rule is not re-tried blind.
- **This directory is its own pnpm project, outside the root workspace.** Inside the workspace,
  react-doctor's `jiti` and `lightningcss` become optional peers of eslint, vite and webpack and
  re-key about 1,500 lines of the root lockfile. `run.sh` installs from the local lockfile on
  each run, so the root `pnpm install` never pulls it.
- **Keep the version exact and bump it by hand**: edit `package.json`, run `pnpm install` in this
  directory, then run a full scan and compare the findings before committing.
- **Nothing leaves the machine.** The config and `run.sh` switch off the score API, telemetry, share
  links and the Socket.dev supply-chain scan. Keep them off.
