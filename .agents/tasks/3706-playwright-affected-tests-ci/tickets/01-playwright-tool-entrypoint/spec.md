# 01 — `tools/playwright` tool and the `pnpm test:pw` entrypoint

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 01 of #3706 |
| Blocked by | T00 |

## What to build

`pnpm test:pw [<playwright args>…]` runs Playwright component tests through a new `tools/playwright/` tool
shaped like `tools/code-complexity` and `tools/mutation-testing`: a `run.sh` that compiles `index.ts` with
`tsc` and runs the output, a `--help`, co-located specs, and a `CONTEXT.md`. This ticket delivers the
pass-through path only — every argument other than the tool's own flags goes to `playwright test -c
playwright-ct.config.ts` untouched — plus the pre-run steps the current `tools/scripts/pw.sh` performs
(regenerate `playwright/envs.js` from `playwright/.env.pw`, build the sprite for the `pw` app env), and the
JSON report every run now writes. `tools/scripts/pw.sh` is deleted; `test:pw:local` and `test:pw:ci` are
dropped from `package.json`. The `--changed`/`--base` and `--docker`/`--docker-deps` flags are tickets 02
and 03; `--help` already lists them so the usage text is written once.

## Acceptance criteria

- [ ] `tools/playwright/{run.sh,index.ts,config.ts,tsconfig.json,CONTEXT.md}` exist; `run.sh` mirrors the
      siblings (compile with `tsc -p`, run `dist/playwright/index.js`; `rootDir: ".."` so ticket 02 can
      import `tools/code-complexity/select/diff.ts` and the shared parser from ticket 00).
- [ ] `pnpm test:pw --help` prints a usage block in the siblings' style listing `--changed[=<ref>]`,
      `--base <ref>`, `--docker`, `--docker-deps`, `--help`, and stating that everything else is passed to
      `playwright test`. Flags not yet implemented (02, 03) are parsed but fail with a clear "not implemented
      yet" error rather than being silently passed through.
- [ ] `pnpm test:pw <file.pw.tsx> --project=default -g "<title>"` runs that test and passes; the multi-word
      `-g` value reaches Playwright intact (the old script's quoting gotcha).
- [ ] Before `playwright test` starts, the tool has (a) loaded `playwright/.env.pw` into the process env,
      (b) run `./deploy/scripts/make_envs_script.sh ./playwright/envs.js`, (c) run `pnpm svg:build-sprite`
      with `NEXT_PUBLIC_APP_ENV=pw`. `playwright test` gets `NODE_OPTIONS=--max-old-space-size=8192` as
      today.
- [ ] The `rm -rf ./playwright/.cache` step is present in the source but commented out, with a comment
      stating why (Playwright's own cache invalidation has been reliable; kept so it can be re-enabled if a
      stale CT build is ever observed).
- [ ] `playwright-ct.config.ts`: `outputDir` is `playwright-results`; `reporter` is `[['blob'], ['json',
      { outputFile: 'playwright-results/report.json' }]]` under `CI` and `[['html'], ['json', …]]` otherwise.
      The ignore file swaps `/test-results/` for `/playwright-results/`. After a local run
      `playwright-results/report.json` exists and lists the run's tests with their status.
- [ ] `package.json`: `test:pw` → `./tools/playwright/run.sh`; `test:pw:local` and `test:pw:ci` removed;
      `test:pw:docker*` untouched (ticket 03). `tools/scripts/pw.sh` deleted. `.vscode/tasks.json` tasks that
      used `test:pw:local` now call `test:pw`.
- [ ] Exit code is Playwright's exit code.
- [ ] `index.spec.ts` covers: pass-through of unknown flags and positionals in order, `--help`, and the
      env/pre-run command sequence (spawn calls stubbed).
- [ ] `CONTEXT.md` (per `.agents/rules/docs.md`): a "where to look" table, the pre-run steps as a constraint,
      and a file map; a line for it in `.agents/AGENTS.md`'s per-directory list. `pnpm lint:doc-links`
      clean.

## Details

- Process model: the tool spawns three children in sequence with `spawnSync` and `stdio: 'inherit'` —
  `make_envs_script.sh`, `pnpm svg:build-sprite`, then `playwright test`. Load `.env.pw` with the `dotenv`
  package (already a dependency) rather than shelling through `dotenv-cli`.
- The JSON report goes under `outputDir` because the html reporter deletes `playwright-report/` in its
  `onEnd`, so a second reporter cannot write there; `outputDir` is cleared at run *start*, so a file written
  at run end survives.
- `test:pw:local` exported `NODE_PATH=$(pwd)/node_modules`; nobody remembers why. Drop it and watch the
  first local run — if module resolution breaks, set it inside the tool and record the reason next to it.
- Nothing here should pre-shape the argv beyond splitting the tool's own flags from the pass-through list;
  ticket 02 appends `--only-changed=<sha>`.

## Leaf worklist

- [ ] 1 `[agent]` Scaffold `tools/playwright/` (run.sh, tsconfig, config.ts, index.ts with usage + parser on
      the shared module + pre-run steps + spawn of `playwright test`), `index.spec.ts`
- [ ] 2 `[agent]` Config: `outputDir` + JSON reporter in `playwright-ct.config.ts`, ignore file
- [ ] 3 `[agent]` `package.json` scripts, delete `tools/scripts/pw.sh`, `.vscode/tasks.json` `test:pw:local` refs
- [ ] 4 `[agent]` `CONTEXT.md` + `.agents/AGENTS.md` line; lint, tsc, doc-links; one real local run of a
      single `.pw.tsx` to confirm the report is written
