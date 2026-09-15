# Notes — upstream Playwright issue draft

## Decision: not filed

The developer chose not to post the report, and not to open a feature request either:

- Playwright 1.63.0 release notes freeze `@playwright/experimental-ct-react` / `-react17` / `-vue` ("will
  no longer be updated") in favour of the stories model in plain `@playwright/test` (1.62+).
- In the stories model Playwright does no bundling; tests reference stories by string id, so no import
  edge links a test to its component. On upstream `main`, `--only-changed` is the git diff filtered
  through the Node-side import graph of the test files, and a component edit reaches no test.
- microsoft/playwright#40691 (closed May 2026) states the maintainers' position: source-to-test mapping
  "isn't derivable" for Playwright and is "not something we can paper over". A request to support
  `--only-changed` for stories would get that answer. microsoft/playwright#41242 (`forceRerunTriggers`
  with `--only-changed`) was closed for lack of a use case.
- Not blocking today: 1.62.x still ships the CT packages. When the migration off them comes, the
  affected-test mapping becomes ours (git diff → our module graph → story files → tests mounting those
  ids), and `tools/playwright/adr/0001` gets revisited then. Deliberately not opened as a question now.

The draft and reproduction below are kept for the record.

## Reproduction log

Scratch project (not this repo): two components, two `*.pw.tsx` tests, `@playwright/experimental-ct-react`
+ `@playwright/test` pinned to `1.57.0`, a git repo with two commits where the second edits
`src/Greeting.tsx` only. Reproduced on macOS 26.6.2 / Node 22.14.0.

| Command | Result |
| --- | --- |
| `playwright test -c playwright-ct.config.ts` | 2 passed |
| `... --only-changed=HEAD~1` | `Running 1 test` (Greeting.pw.tsx), passed |
| `... --only-changed=HEAD~1 --list` | `Total: 0 tests in 0 files` |
| `... --list` | 2 tests |

Same 0-vs-1 split with a cold and a warm `playwright/.cache`, and on `1.62.1` (the last release that
ships the CT packages). When the *test file* itself is edited, `--list` does list it, because git sees the
test file directly; the gap is only the component → test dependency mapping.

Root cause, read from `playwright/lib/runner/testRunner.js` (`runAllTestsWithConfig`): list mode runs only
`createLoadTask` + `createReportBeginTask`, skipping `createGlobalSetupTasks` and so
`createPluginSetupTasks`. The CT plugin's `instance` is therefore undefined when the load task calls
`plugin.instance?.populateDependencies?.()`, the Vite bundle is never built, no component dependencies are
recorded, and `detectChangedTestFiles` only sees changed test files. Upstream `main` has the same list-mode
task list.

The scratch repro (2 commits, README with the steps) lived in the session scratchpad and was not pushed
anywhere; the `<gh-user>` placeholder in the draft was never substituted.

## Draft (not posted)

**Repository:** `microsoft/playwright` · **Type:** Bug · **Labels:** none · **Project board:** none

**Title:** `[Bug]: --only-changed --list lists 0 tests in component testing when only a component changed`

**Body:**

````markdown
## Description

In component testing (`@playwright/experimental-ct-react`), `playwright test --only-changed=<ref>` correctly
selects the tests whose *components* changed, but adding `--list` to the same command lists 0 tests. The
two flags disagree about which tests are affected, so `--list` cannot be used to preview an
`--only-changed` run (the workaround suggested in #33324).

The cause is that list mode never sets up plugins. In `runAllTestsWithConfig` the `listOnly` task list is
`[createLoadTask, createReportBeginTask]`; `createGlobalSetupTasks` (and with it `createPluginSetupTasks`)
is skipped. The CT plugin's `instance` is still undefined when the load task calls
`plugin.instance?.populateDependencies?.()`, so the Vite bundle is never built, no component → test
dependencies are recorded, and `detectChangedTestFiles` only sees test files that git reports as changed.

## Steps to Reproduce

Minimal repo: https://github.com/<gh-user>/playwright-ct-only-changed-list — two components, two
`*.pw.tsx` tests, two commits. The second commit edits `src/Greeting.tsx` only.

1. `git clone https://github.com/<gh-user>/playwright-ct-only-changed-list && cd playwright-ct-only-changed-list`
2. `npm install && npx playwright install chromium`
3. `npx playwright test -c playwright-ct.config.ts --only-changed=HEAD~1`
   → `Running 1 test using 1 worker` (`src/Greeting.pw.tsx`), passes
4. `npx playwright test -c playwright-ct.config.ts --only-changed=HEAD~1 --list`
   → `Total: 0 tests in 0 files`

Same result with a cold and a warm `playwright/.cache`. Editing the test file itself instead of the
component makes `--list` list it, because git sees the test file directly.

## Expected Behavior

`--only-changed=<ref> --list` lists exactly the tests that `--only-changed=<ref>` would run — here,
`Greeting.pw.tsx`.

## Actual Behavior

```
$ npx playwright test -c playwright-ct.config.ts --only-changed=HEAD~1 --list
Listing tests:
Total: 0 tests in 0 files
```

## Additional Context

- Reproduced on 1.57.0 and 1.62.1. Upstream `main` still builds the same list-mode task list, so the
  behaviour is not fixed there.
- Plain `--list` (without `--only-changed`) lists all tests as expected.
- A fix could be to run the plugin setup tasks (or at least `populateDependencies`) in list mode whenever
  `--only-changed` is set, so the same dependency map backs both code paths.
- I understand the experimental CT packages are frozen as of 1.63. Filing for the record since 1.62.x is
  the last line that ships them, and the `--list`/`--only-changed` disagreement is still surprising there.

## Environment

System:
  OS: macOS 26.6.2
  CPU: (8) arm64 Apple M2
Binaries:
  Node: 22.14.0
  npm: 10.9.2
npmPackages:
  @playwright/experimental-ct-react: 1.57.0 => 1.57.0
  @playwright/test: 1.57.0 => 1.57.0
````
