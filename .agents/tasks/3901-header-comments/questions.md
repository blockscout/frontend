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
