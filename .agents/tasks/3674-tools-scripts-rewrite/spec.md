# Rewrite the .mjs scripts under tools/ in TypeScript

| | |
| --- | --- |
| Issue | https://github.com/blockscout/frontend/issues/3674 |
| Feature branch | `issue-3674` |
| PM | — |
| Designer | — |
| Backend | — |
| Minimum API version | — |
| Slack channel | — |

## Context & goal

Three `.mjs` scripts under `tools/` are the only executable logic there that no gate can see. The
`.mjs` extension keeps them out of the root `tsconfig.json` `include`, so `pnpm lint:tsc` never
type-checks them; a `*.spec.mjs` would not be discovered by `vitest.config.ts` without widening
suite-wide test discovery, so they have no tests; and with no tests they report 0% coverage, which
makes the CRAP half of the complexity gate uninformative for exactly the highest-complexity tooling
code in the repo.

Rewriting them in TypeScript brings all three under the type-check and the unit suite, and lets the
complexity gate report something meaningful. While `check-doc-links` is open it also takes a scope
extension: its check surface currently reaches only files named exactly `CONTEXT.md`, so a directory
documenting itself across several markdown files gets one of them checked and the relative
references *inside* the others can break silently.

Blocker issue #3663 (the complexity gate, its caps, and its coverage of `tools/**`) is closed; the
gate is live and already measures `.mjs`.

## Functional requirements

1. `pnpm lint:doc-links`, `pnpm profile:analyze`, `pnpm presets:lint` and `pnpm presets:sync` behave
   identically from a caller's point of view — same arguments, same output, same exit codes.
2. All three tools' sources are TypeScript and are type-checked by `pnpm lint:tsc`.
3. `pnpm test:code-complexity` passes on all three tools: every function is within the cognitive cap
   for its class and within the CRAP cap.
4. Co-located `*.spec.ts` files exercise all three tools, so their reported coverage is real rather
   than 0%. `vitest.config.ts` `include` is unchanged.
5. `pnpm lint:doc-links` checks every markdown file in and below any directory that contains a
   `CONTEXT.md`, nested subdirectories of records included, and resolves their relative references.
   `src/toolkit/package/` is exempt: it is the published npm package wrapper and its readme addresses
   package consumers rather than agents.
6. Every reference in the extended surface resolves — including the two that do not today, in
   `tools/code-complexity/docs/RUNNING.md` and `tools/mutation-testing/docs/RUNNING.md`.
7. Compiled JavaScript is git-ignored; no build artifact is committed.
8. `pnpm dev:preset`, `pnpm dev:local`, `pnpm prod:preset`, the Docker image build and the container
   entrypoint are unaffected.

## Data & API

None. No endpoint, no `service:name` resource, no env var, no feature flag, no analytics event.

## UI inventory

None. No user-visible surface; developer tooling only.

## Implementation decisions

### Layout

- **`tools/doc-links/`** — a new folder replacing `tools/scripts/check-doc-links.mjs`, flat files
  split by concern: surface collection, line stripping, reference resolution, per-line checking,
  reporting, entry. That checker's per-file check function is the task's one real decomposition
  target, and the scope extension lands in its collection step.
- **`tools/dev-server/sync-presets/`** — a subfolder for the preset-list sync tool alone, named for
  the job: `presets/` would read as though the registry lived in it. `registry.json` and
  `envs-rules.json` stay at the `tools/dev-server/` root — the registry's other reader, the env
  fetcher, is not moving, and its path is a contract in the Dockerfile, the container entrypoint,
  several skills and the contributing guide.
- **`tools/profiling/`** keeps its shape; the aggregator stays one module. It breaks no cognitive
  cap, so its lever is coverage, not decomposition.

### Constraints

Not free choices — the rest of how these tools are shaped internally is the implementing agent's
call, judged against the functional requirements and whatever the gate reports at the time:

- **The preset sync tool needs its own `tsconfig.json`**, not the existing `tools/dev-server/` one:
  giving that config an `outDir` relocates the env fetcher's emitted entry and breaks the
  Dockerfile's `COPY` of it.
- **Each tool's CLI invocation lives in its own entry file**, not behind an entry-point guard inside
  the module.
- **No committed real-world DevTools profile export.** Hand-built minimal fixtures instead: an
  export pins the fixture to one DevTools version, and the wire format is what's under test.

### Doc-link scope extension

- Two references in the newly-covered surface don't resolve, both writing `./run.sh` from a `docs/`
  subdirectory where the file sits one level up. Fix them as docs — not by resolving relative paths
  against the `CONTEXT.md` directory, since `./` means "beside this file" everywhere else in the
  instruction surface and special-casing it would weaken the check the extension exists to add.
- The `src/toolkit/package/` exemption (FR5) goes in the script's existing exclusion list as a path,
  not as a `README.md` filename rule: `.agents/rules/docs.md` governs a module `README.md` as a doc
  kind, so a filename rule would pre-emptively unprotect the files that rule expects to be checked.

### Docs

`tools/doc-links/` gets a `CONTEXT.md` — a file map, registered in the per-directory list in
`.agents/AGENTS.md`. Convention rationale stays in per-file header comments rather than moving into
it. Note the loop this closes: the tool then checks its own docs.

`tools/code-complexity/select/scope.spec.ts` asserts scope membership using two of the `.mjs` paths
this task deletes. `.mjs` stays a legitimate in-scope extension so the assertions keep passing, but
swap the strings for names that exist.

## Out of scope

- **Moving the env fetcher** out of `tools/dev-server/` — tempting while restructuring its
  neighbours, but its path is a contract in the Docker build and `COPY`, the container entrypoint,
  four `deploy/tools/*` dev scripts, three `tools/scripts/*.sh` wrappers and a documented skill
  command line. A separate issue if wanted at all.
- **Bringing `deploy/` under the complexity gate** — tracked as issue #3675.
- **Moving the caps** in the complexity gate's config. It is the cheap way to satisfy FR3 and it is
  not available.
