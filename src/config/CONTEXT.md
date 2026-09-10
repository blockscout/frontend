# App config — context

`src/config/index.ts` assembles the app config from the co-located config modules: `src/api/config.ts`,
`src/features/**/config.ts`, `src/slices/*/config.ts`, `src/shell/*/config.ts`, `src/services/*/config.ts`.
Each module turns raw env values into typed, validated data. The aggregator is the only place the app reads
that data from.

## The convention

Three rules. ESLint enforces all of them (`eslint.config.mjs`, the "App config convention" blocks), so a
violation fails before review.

1. **A config module has no export besides its default.** Everything the feature owns lives inside the
   config object, widening its `Feature<Payload>`. `Feature<>` hides the payload when `isEnabled` is
   `false`. A value exported beside the object stays readable while the feature is off, which is the state
   the type exists to rule out. Types and constant lists go to the sibling `types/config.ts`.
2. **Only `src/config` is imported.** App code reads `config.features.<name>`, `config.slices.<name>`,
   `config.shell.<name>`, `config.services.<name>`, `config.apis`, `config.chain`, `config.metadata`. It
   never imports the module itself.
3. **Only config modules read envs.** `src/config/utils/envs.ts` is importable from a `config.ts` or
   `src/config/**`, nowhere else. A value read elsewhere is untyped, unvalidated and invisible to the
   aggregator. It can also differ between the browser and Node. A util that called `getEnvValue` directly
   read one value in the browser and another under Node, and broke an unrelated test suite in a way that
   showed up only as a visual diff.

## Exemptions the rules allow

- **Config-to-config imports.** A config module may import another config module directly, for example a
  feature gated on whether another one is enabled. The aggregator cannot be used from inside a module it
  aggregates.
- **The module's own `config.spec.ts`** imports the module directly and dynamically, under `withEnvs`,
  because the config is a frozen module-level singleton.
- **Type-only imports** of a config module carry no runtime payload and pass.
- **Companions.** `types/config.ts` and `mocks/config.ts` are not config modules and export freely.
- **Outside `src/`.** `playwright/`, `vitest/`, `deploy/` and `tools/` are not checked.

The Node env-validator constraint on these files (no React, browser APIs, or code from other slices and
features) lives in `.agents/rules/architecture.md`.
