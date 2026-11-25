# Set up scheduled dependency refreshes and the checks that make them safe to merge

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3907 |
| Feature branch | `issue-3907` |
| Demo | none |

## Context & goal

Dependency updates have no recurring process. The lockfile is refreshed by hand, so vulnerability alerts for
transitive dependencies pile up between clean-ups. A scheduled refresh fixes that only if a pull request
that changes nothing but dependencies is checked well enough to tell whether a bump broke the app, and
today it is not:

- Unit tests are selected by changed files, so a lockfile-only pull request runs none and passes.
- No pull request check builds the application for production.
- Component visual tests run in full on a lockfile change but mock the network. Nothing exercises the flows
  that lean hardest on third-party packages against a real backend.
- The existing end-to-end workflow is dead: nothing calls it.

The goal: dependency pull requests arrive on a schedule, each one is checked by a full unit run, a
production build, a smoke run against a real backend and a vulnerability audit, and the team has a written
routine for the alerts a refresh cannot clear.

## Functional requirements

**Dependency checks**

1. A pull request that changes the lockfile triggers a dedicated set of dependency checks. A pull request
   that leaves the lockfile untouched does not.
2. The dependency checks can also be started by hand on any branch.
3. The dependency checks run the full unit suite, not the change-scoped selection.
4. The dependency checks build the application for production; a failed build fails the check.
5. The dependency checks are not required for merging into `main`. The regular pull request checks behave
   as before.

**Smoke run**

6. The dependency checks run a smoke set in a real browser against the production build, started inside
   the CI job with the config of the `staging` preset and talking to that instance's real backend.
7. The smoke set covers: the home page showing real stats, a transaction page and an address page showing
   real data, the API documentation page rendering, the wallet modal opening and listing wallets, a
   connection through an injected test wallet ending with the connected address shown in the header, and
   the analytics initialization request being sent.
8. A smoke test fails on an uncaught page exception and on a failed request to the application's own
   origin. Browser console output is not asserted. Known third-party exceptions are listed in one
   allowlist.
9. The smoke set runs locally with one command, against the same kind of build.

**Scheduled refresh**

10. A lockfile maintenance pull request is opened weekly without manual work.
11. Non-major updates of direct dependencies arrive weekly, grouped in one pull request.
12. A major update is opened only when someone asks for it.
13. Every update of a direct wallet stack dependency, patch and minor included, stays out of the grouped
    pull request: `@lifi/widget-light` arrives in a pull request of its own, the rest of the wallet stack
    together in one.
14. No dependency pull request merges without a human.
15. The existing minimum release age applies to every scheduled pull request.
16. A scheduled pull request passes the pull request template and category check as opened, carrying the
    `dependencies` label.

**Vulnerabilities**

17. Open alerts of high and critical severity for runtime dependencies are at zero.
18. The dependency checks fail when the lockfile holds a runtime dependency with a known vulnerability of
    high or critical severity that is not explicitly ignored with a reason.
19. Every security override names the parent that pins the vulnerable version and is a range, not an exact
    version.

**Routine**

20. The triage routine is documented: alerts are reviewed weekly together with the refresh pull request;
    when to bump the parent, add a ranged override, or dismiss an alert with a reason; that overrides are
    reviewed for removal on each refresh; that a fix younger than the minimum release age waits, except a
    critical one, which gets a temporary exemption.
21. The same document holds the manual checklist for a wallet stack pull request: connecting a real wallet.

**Clean-up**

22. The dead end-to-end workflow and the disabled reference to it in the pre-release workflow are gone.

## Data & API

No API changes and no new environment variables. The smoke run reads the `staging` preset's config and
backend the same way the local production build does.

## UI inventory

No UI changes.

## Implementation decisions

- **Trigger.** The lockfile is the single trigger for the dependency checks. Every dependency edit in the
  manifest or in the workspace overrides rewrites it, and the Playwright runner's full-run trigger already
  follows the same rule.
- **A separate workflow.** The dependency checks live in their own workflow and the regular checks
  workflow is not changed. Its change-scoped unit run stays empty on a lockfile-only pull request, which is
  harmless next to the full run.
- **Build and smoke share a job.** The smoke run needs the production build, so one job builds, starts the
  server and runs the smoke set. The build failing is the production-build check; there is no separate
  build job.
- **Smoke tooling.** Plain Playwright tests with their own config, apart from the component test runner:
  Chromium only, retries to absorb backend flakiness, no screenshots.
- **Smoke preset.** `staging`. Whether GitHub runners reach that instance is confirmed by the first run;
  the fallback is `eth_sepolia`.
- **Wallet probe.** A fake wallet provider is injected into the page before the app loads, so the app
  lists it as an installed wallet and the connect flow runs end to end. No real browser extension: it
  needs a headed browser and breaks with every wallet release.
- **Refresh tool.** Self-hosted Renovate, run by a scheduled workflow in the repository (Q01). It opens
  its pull requests with a token DevOps provides as a repository secret, so they trigger the checks.
- **Renovate rules.** Lockfile maintenance on Mondays. Wallet group: `wagmi`, `viem`, `@wagmi/*`,
  `@reown/*`, `@walletconnect/*`, `@lifi/widget-light`. The group holds patches too, because the
  `@lifi/widget-light` patch is written against exact `wagmi` and `viem` versions. `@lifi/widget-light` gets a
  pull request of its own, since each of its bumps means redoing that patch; the rest moves together, since
  Reown AppKit pins exact versions of its own packages and of WalletConnect. Transitive wallet
  packages that float within a range still move with lockfile maintenance; the smoke wallet probe covers
  them. No automerge anywhere. Immediate security pull
  requests are off: an advisory published between refreshes surfaces on the next refresh pull request.
- **Pull request shape.** Renovate applies the `dependencies` label and a body that carries the template
  headings. The pull request check gets no exemption for a bot author.
- **Audit.** Runtime dependencies only, high and critical. It runs only inside the dependency checks,
  because it reads the whole lockfile against the live advisory database and would fail pull requests
  unrelated to the advisory. A failure is fixed in the same pull request.
- **Order.** The check gaps first, then the smoke set, then the scheduled refresh, then the backlog, and
  the audit last: enabled earlier it would fail every dependency pull request until the backlog is empty.
- **Backlog.** The first refresh clears what the declared ranges allow. The rest is handled per package by
  the triage routine. At spec time all open high-severity runtime alerts are for transitive dependencies
  and all have a patched version.

## Out of scope

- The home repo's lockfile. A follow-up issue once this setup has proven itself.
- Making the dependency checks required, or running them on pull requests that do not touch the lockfile.
- Automerge of any dependency pull request.
- Immediate security pull requests from Renovate.
- A real wallet extension in the automated smoke run.
- An SLA for alerts of medium and low severity or for development dependencies; refreshes clear them.
- Reviving the old end-to-end suite or testing against a deployed review instance.
