# Dependency updates

Renovate opens the dependency pull requests on a schedule, the dependency checks test each one, and a
person merges it: nothing merges by itself. This page is the routine for reviewing them together with the
vulnerability alerts, and the manual check a wallet stack pull request needs.

What Renovate opens, when and in which groups is in `.github/renovate.json`, and the workflow that runs it
is `.github/workflows/renovate.yml`. What the dependency checks run, and on which pull requests, is in
`.github/workflows/dependency-checks.yml`. The overrides, the audit ignore list and the minimum release
age are settings of `pnpm-workspace.yaml`, each with the rule for its entries in the comment above it.

## The weekly review

Each week, review the [Dependabot alerts](https://github.com/blockscout/frontend/security/dependabot)
together with the lockfile maintenance pull request (the refresh), before it merges:

1. Triage each open alert of high or critical severity for a runtime dependency (below). An alert whose
   vulnerable version the refresh takes out of the lockfile needs nothing: it closes when the refresh
   merges. Alerts of medium and low severity, and alerts for development dependencies only, are left to
   the refreshes.
2. Review each security override for removal: drop it once the parent named on its line no longer pins a
   version below the floor.
3. Review each audit ignore entry for removal: once the fix its reason waits for has shipped, triage the
   advisory again and drop the entry with the fix the triage leads to.
4. Drop each temporary release age exemption whose version has passed the minimum release age (below).

Make these changes on the refresh's branch, so that its dependency checks cover them. Renovate stops
updating a branch once someone else pushes to it, and asking it to rebase then discards those commits.

The week's other pull requests merge once their dependency checks are green, a wallet stack one after its
checklist (below).

## Triage an alert

Find the parent that holds the vulnerable version, then take the first row that fits:

| When | Do |
| --- | --- |
| A release of the parent takes the patched version | Bump the parent; for a transitive parent, the direct dependency above it. A major is requested on the Dependency Dashboard (below). |
| No release of the parent does, and a patched version is in the same major as the one the parent pins (the same minor, below 1.0) | Add a ranged override to `pnpm-workspace.yaml`, written the way the comment above the security overrides says. |
| The parent declares the dependency and never imports it | Add a removal override, written the same way. |
| No fix can reach it | Accept the advisory: an entry in the audit ignore list with its reason, and the alert dismissed on GitHub as a tolerable risk with the same reason. The reason says why this app can live with it and which upstream release ends it. |

An override across a major forces a breaking change on a parent that was not written for it, so an
advisory whose only fix is a new major of the dependency is accepted until the parent moves.

## Fixes younger than the minimum release age

The minimum release age holds back fixes too: pnpm resolves no younger version, and Renovate waits as
long before it proposes one. A fix younger than the age waits for the first refresh that finds it
old enough.

A fix for a critical advisory does not wait. It gets a temporary exemption, in a pull request of its own:

1. Add the version the fix needs as `<package>@<version>` to `minimumReleaseAgeExclude`, below the
   permanent entries, with the advisory on its line. Exempt the version, not the package name: a name exempts every
   later release too.
2. Make the fix the triage table names, in the same pull request.
3. Remove the entry in the first refresh after that version has passed the minimum release age. Removed
   earlier, pnpm can no longer resolve the version the fix needs.

## When the audit fails

The audit runs in the dependency checks of every pull request that changes `pnpm-lock.yaml`, a feature
pull request that adds a package included. It reads the live advisory database, so it can fail on an
advisory published since the last refresh, in a package the pull request did not touch.

The dependency checks are not required for merging, so this is policy: a pull request does not merge with
the audit red. Fix the advisory in the same pull request, through the triage table, or accept it there
with an ignore entry and its reason. The audit step's log lists the advisories, and the step's command
runs the same audit locally.

## Requesting a major update

A major update, like every update the Renovate config holds for approval, is listed on the Dependency
Dashboard issue instead of being opened. Tick its box there to ask for it. The next Renovate run opens the
pull request; start the Renovate workflow by hand for it to open at once.

## Wallet stack pull requests

The wallet stack pull request and the `@lifi/widget-light` one move versions that the `@lifi/widget-light`
patch in `patches/` and the `peerDependencyRules` of `pnpm-workspace.yaml` name exactly (the wallet stack
rules of `.github/renovate.json` say why). On the pull request's branch, move the rules to the new
versions, and redo the patch when `@lifi/widget-light` itself moves.

The smoke set connects an injected test wallet only, so a real wallet is checked by hand before the merge:

1. Build and start the pull request's branch: `pnpm prod:preset staging`.
2. Connect a real browser extension wallet from the header: its address shows there.
3. Disconnect, open the connect dialog again and choose WalletConnect: the QR code renders.
4. Connect again and open `/essential-dapps/swap`: the LI.FI widget loads and takes the connected wallet.
