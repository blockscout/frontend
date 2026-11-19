# Open questions — Define which header comments the code-quality rule allows and align the existing ones

### Q01 — Does the sweep cover files that are not JavaScript or TypeScript?

- Owner: developer (tom)
- Status: `resolved`
- Resolved when: shell scripts, workflow YAML and the `Dockerfile` are each in or out of requirement 12
- Slack: none, answered in session
- Answer: out of scope; the rule and the lint check cover JavaScript and TypeScript only (2026-11-18)

### Q02 — Does the sweep cover `public/`?

- Owner: developer (tom)
- Status: `resolved`
- Resolved when: `public/` is in or out of requirements 12 and 13
- Slack: none, answered in session
- Answer: out of scope; it is ignored by ESLint and its comments are vendored code (2026-11-18)

### Q03 — When is the lint rule registered, given the repository fails it until the sweep is done?

- Owner: developer (tom)
- Status: `resolved`
- Resolved when: the ticket that registers the rule at `error` is named
- Slack: none, answered in session
- Answer: ticket 02 registers it at once; the full lint run is red until ticket 09, accepted because all tickets land in one pull request (2026-11-18)

### Q04 — Does the sweep cover generated files?

- Owner: developer (tom)
- Status: `resolved`
- Resolved when: files written by a generator, such as `src/shared/router/nextjs-routes.d.ts`, are in or out of requirements 11–13
- Slack: none, answered in session
- Answer: out of scope for the sweep and the lint check, as `public/` is in Q02; a generated file is left untouched, because its generator writes its comments back on the next run (2026-11-19)

### Q05 — Does the rule allow a comment that points at where code, types or data came from?

- Owner: developer (tom)
- Status: `resolved`
- Resolved when: a one-line pointer to an upstream file, a spec, vendor docs or a data table is allowed or banned by the "Comments" section
- Slack: none, answered in session
- Answer: allowed, as a third exception, the source pointer: one line, labeled with what the source is, such as `// The EIP-6963 spec - <link>`; the pointers the sweep removed are restored (2026-11-19)
