# 02 — `multichain-portfolio` feature flag, env validation, docs

| | |
| --- | --- |
| Parent spec | the task's `spec.md` → linked as `../../spec.md`, ticket 02 of #3855 |
| Blocked by | none |

## What to build

The opt-in itself, with nothing rendered yet. A new `multichain-portfolio` feature config is enabled when
the aggregator API is configured (`NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST` and
`NEXT_PUBLIC_MULTICHAIN_CLUSTER`) and the Multichain explorer is not enabled. No new variable. The envs
validator checks the two variables on a single-chain instance too, and `docs/ENVS.md` describes the feature.

## Acceptance criteria

- [x] `config.features.multichainPortfolio` exists; enabled only with both variables set and
      `NEXT_PUBLIC_MULTICHAIN_ENABLED` not `true`. The Multichain explorer feature config is untouched.
- [x] Unit test of the flag: both set → on; one missing → off; Multichain explorer on → off.
- [x] The two variables' rules live in one sub-schema composed by both the default and the multichain
      top-level schemas; the default schema rejects an invalid aggregator host. Validator specs cover it.
- [x] `docs/ENVS.md`: a "Multichain portfolio" feature section with no variable of its own and a
      dependencies table naming the two API variables; the Multichain Aggregator API description no longer
      says the API serves the Multichain explorer only.
- [x] A CSP unit test proves that with the feature on, a single-chain instance allows the aggregator host
      and none of the other cluster chains' API hosts.

## Details

- Spec → "Data & API" → "Gating", and "Implementation decisions" → "Two features, one config file" and
  "CSP".
- The `app` CSP policy already allows every configured API endpoint, and the `multichain` policy keys off
  `multichainConfig()`, which stays `undefined` here — so the CSP criterion is expected to need a test, not
  a policy change.
- Read `deploy/tools/envs-validator/CONTEXT.md` before touching the schemas.
- `NEXT_PUBLIC_MULTICHAIN_STATS_API_HOST` stays a Multichain-explorer-only rule.

## Leaf worklist

- [x] 1 `[agent]` Add the `multichain-portfolio` feature config and register it, with its unit test
- [x] 2 `[agent]` Extract the aggregator variables' sub-schema and compose it into both top-level schemas, with validator specs
- [x] 3 `[agent]` Update `docs/ENVS.md`
- [x] 4 `[agent]` CSP unit test for the single-chain case
