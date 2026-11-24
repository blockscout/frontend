# Open questions — Set up scheduled dependency refreshes and the checks that make them safe to merge

### Q01 — Can the hosted Renovate app be installed on `blockscout/frontend`?

- Owner: DevOps (Nick)
- Status: `resolved`
- Resolved when: the app is installed with access to `blockscout/frontend`; or it is refused, with the
  reason, which switches the refresh to the scheduled-workflow fallback
- Slack: https://blockscout.slack.com/archives/D056MNUR1K8/p1795518256021539
- Answer: no hosted app; Renovate runs self-hosted from a scheduled workflow in the repository, with a
  token DevOps provides as the `RENOVATE_TOKEN` secret (2026-11-24)
