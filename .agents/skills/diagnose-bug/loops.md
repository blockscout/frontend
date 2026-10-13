# Feedback-loop ladder

The rungs of step 2 of the `diagnose-bug` skill, cheapest first. Stop at the first one that goes red;
climb when a rung cannot reach the bug. A rung's agent-runnable command is what later steps re-run.

| Rung | Reaches | The loop |
| --- | --- | --- |
| **Vitest spec** | logic, hooks, component state, data mapping, fetch handling | A `*.spec.ts(x)` beside the code, per `.agents/rules/tests-unit.md`: `render` from `vitest/lib`, `fetchMock` for the API, `withEnvs` for an instance's config branch, `mockSocket` for live updates. `pnpm test:vitest <path>`. |
| **Playwright component test** | what jsdom cannot do: layout, real browser APIs, a provider stack the spec cannot fake | A `*.pw.tsx` with `mockApiResponse` / `mockEnvs`, asserting on the DOM (`toHaveText`, visibility), never on a screenshot. `pnpm test:pw <path>`. |
| **Dev server in a browser** | the whole page against the reporter's instance: routing, SSR, config, third-party scripts | `pnpm dev:preset <alias> --port <n>`; the alias is the instance in `tools/dev-server/registry.json` — add it there when missing, then `pnpm presets:sync`. Drive it with the Playwright MCP browser: navigate, snapshot, console messages, network requests. Red is the symptom in the snapshot, console or network list; the same navigate-and-inspect sequence is the re-run. First load takes up to a minute. A bug only in production builds (hydration, SSR-only) uses `pnpm prod:preset`. |
| **Data** | whether the frontend is even the place | Resolve the request with the `resolve-api-url` skill and `curl` it. A payload already wrong at the API, or a config value the instance really serves, clears the frontend: **Not a frontend bug**. |
| **Bisect** | a regression between two known states | A release tag or a commit is a rev (the instance's `/node-api/config` reports its tag or SHA). `git bisect run` with a rung-1 or rung-2 command as the script. |
| **Differential** | one instance or version against another | The same page or the same request on two instances (`registry.json` has production and staging aliases), or two revs; diff the outputs. |

A rung that needs a human to click is not a loop: the artifacts to ask for are in step 9.
