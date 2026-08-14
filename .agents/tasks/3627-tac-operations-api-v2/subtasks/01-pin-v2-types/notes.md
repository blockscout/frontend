# 01 — Notes

## The lockfile carries one hunk unrelated to the pin

`pnpm install` also wrote `deprecated: Active development of CryptoJS has been discontinued.` under
`crypto-js@4.2.0` in `pnpm-lock.yaml`. That is registry metadata pnpm refreshes on any install, not a
consequence of this pin — hand-reverting it only means the next install writes it back. Worth a line in the
PR body so a reviewer does not read it as scope creep.

## The pin needed no `pnpm-workspace.yaml` change

`@blockscout/tac-operation-lifecycle-types` is already listed under `minimumReleaseAgeExclude`, so a
freshly published beta installs without tripping the release-age hold that would otherwise reject it.

## `1.2.0` exists but is not the version to use

npm reports `1.2.0` as available and `pnpm install` says so too. It was published after the v2 protos
merged but before the `compile:proto` fix, so it ships no v2 module — the reason this subtask pins a beta
that sorts *below* the previous `1.1.0` pin rather than upgrading forward.
