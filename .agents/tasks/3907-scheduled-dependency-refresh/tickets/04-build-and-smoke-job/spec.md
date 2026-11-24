# 04 — Build and smoke job in the dependency checks

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md) → ticket 04 of #3907 |
| Blocked by | T01, T02 |

## What to build

A second job in the dependency checks that builds the application for production with the `staging`
preset's config, starts it inside the job and runs the smoke set against it. A failed build fails the
job, which is the production-build check; there is no separate build job. A failed run leaves a report a
developer can open.

## Acceptance criteria

- [ ] The job builds, starts the server and runs the smoke set in that order, the build as its own step
      so a build failure is told apart from a smoke failure in the run's summary.
- [ ] The build and the smoke run use the same commands as the local `pnpm test:smoke`.
- [ ] The job has an explicit timeout.
- [ ] The Playwright report and traces are uploaded as an artifact when the smoke run fails.
- [ ] The preset alias is one value in the workflow.
- [ ] The job runs beside the unit job, not chained on it.

## Details

**Browser.** The component tests run in the `mcr.microsoft.com/playwright` container image pinned in
`checks.yml` to the installed Playwright version. Use the same image, or install Chromium in the job;
either way the version follows `@playwright/test` and is not a second pin to maintain by hand if that can
be avoided.

**Secrets.** None. The preset's config comes from the instance over HTTP, as
`tools/dev-server/CONTEXT.md` explains.

**First run.** The workflow cannot be dispatched before it is on `main`, and this pull request does not
touch the lockfile until ticket 06. The first real run, and with it the answer to whether runners reach
`staging`, is confirmed there. Here, verify the job's commands by running them locally in order.

## Leaf worklist

- [ ] 1 `[agent]` Add the build and smoke job to the dependency checks workflow, with the failure artifact
