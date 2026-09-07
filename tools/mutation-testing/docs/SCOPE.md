# Mutation testing — what it measures, and deliberately does not

Every boundary below is intentional, so nobody has to rediscover it by trial and error. The rules live in code — `../select/` for files and lines, `../stryker.config.json` for mutators—while this page explains the reasoning.

## Only files with a co-located Vitest spec

A file is mutated only when `X.spec.ts` or `X.spec.tsx` sits beside `X.ts` or `X.tsx`.

The question is: “Would a bug here be caught?” A file untouched by unit tests would produce only mutants nothing could kill, drowning meaningful findings in duplicates. The CRAP gate already reports that condition: an untested `behavior` function has 0% coverage and fails the PR.

A new file without a spec is therefore the CRAP gate’s responsibility, not this one.

## Only lines outside a `jsx` render body

Markup is not behaviour. A render-body mutant changes what the component draws, which no Vitest assertion in this repo is designed to detect. The Playwright screenshot suite covers that, but Stryker cannot run it (below). Such mutants would be unkillable in principle.

`behavior` code is mutated wherever it lives. The classifier is the complexity gate’s (`../../code-complexity/measure/complexity.ts`), so `KIND` in complexity reports always agrees with mutability here.

## Only the five logic mutator classes

Conditional expressions, equality operators, logical operators, arithmetic operators, and boolean literals. Everything else is disabled at *generation* time, not filtered from the report afterward.

This is based on sampling, not preference. Of 22 survivors sampled across the full mutator set, roughly one-third were unkillable by any Vitest test worth writing: React dependency arrays, theme-variable objects, and colour-token string literals—visual or idiomatic rather than behavioural.

If an excluded class hides a real bug, that is the ratchet — and why the set lives in committed configuration rather than being assembled at runtime.

## Not Playwright, not visuals

Stryker’s Vitest runner cannot execute Playwright tests, and its browser mode is explicitly unsupported. The screenshot suite is not measured, and a green run here says nothing about rendering.

## Not a mutation score threshold

The gate is exactly “no survivor on a changed line.” There is no percentage threshold.

## Not the whole repo, in CI

CI runs only diff-scoped mutation testing. Before the mutator restriction above, the full eligible set took 17 min 29 s locally, which is unsuitable per PR, and no scheduled workflow runs it. It remains reproducible on demand with `pnpm test:mutation-testing`.