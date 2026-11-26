# Smoke set — context

Playwright tests (`*.smoke.ts`) that drive a real browser through a production build of a preset, against that
instance's real backend. The usage is at the top of `./run.sh`.

## Where to look

| Question | Answer |
| --- | --- |
| Where does CI run the set? | the `build_and_smoke` job of `.github/workflows/dependency-checks.yml` |
| Where is a failed run's report? | `report/` (html) and `results/` (a trace per failed test), both git-ignored. CI uploads the two as the `smoke-report` artifact |
| Why a fake wallet, `staging` and the PostHog stub? | "Implementation decisions" in `.agents/tasks/3907-scheduled-dependency-refresh/spec.md` |
| What is left to a person? | the real wallet checklist in `docs/DEPENDENCIES.md` |

## Constraints

- **Every test imports `test` and `expect` from `./fixture.ts`.** Its auto fixtures fail a test on an uncaught
  exception or a failed request to the app, and answer PostHog's capture requests. A test built on
  `@playwright/test` gets neither: errors pass unseen, and its PostHog events reach the real project, because
  the smoke server turns PostHog's bot filter off.
- **A server-only env goes in `webServer.env` of `./playwright.config.ts`.** It beats every env file,
  `.env.local` included. If the preset sets the same env, merge into the preset's value, the way the config
  does for `NEXT_PUBLIC_POSTHOG_CONFIG_OVERRIDES`. A plain value drops the preset's.
