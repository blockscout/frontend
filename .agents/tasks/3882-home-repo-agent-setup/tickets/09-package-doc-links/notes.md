# Notes — ticket 09

Verified in a scratch consumer against home commit `b5b29f53849065a629d29974db34c04ede57ad03`.

- **The dependency specifier** `github:blockscout/frontend-home#<sha>` installs without credentials.
- **The allowlist key is the tarball URL, not the specifier.** pnpm resolves a `github:` dependency to
  `https://codeload.github.com/blockscout/frontend-home/tar.gz/<sha>`, and `allowBuilds` in
  `pnpm-workspace.yaml` wants `frontend-home@https://codeload.github.com/blockscout/frontend-home/tar.gz/<sha>: true`.
  Without it the install stops with `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` and prints the key. Ticket 10's
  bump script writes this form.
- **`prepare` runs under pnpm** (user agent `pnpm/12.4.1`), now that home has `pnpm-lock.yaml` and no
  `package-lock.json`. Measured with a `git+file://` copy of home whose `prepare` recorded the agent.
- **The consumer receives** `package.json`, `README.md` and the tool's `dist`, nothing else.
- **`frontend`'s `src/toolkit/package` exclusion** is the one thing its copy of the tool has that home's
  does not hard-code. Home reads it from `docLinks.exclude` in the consumer's `devkit.config.json`, so
  ticket 10 adds that file.
- Install in the scratch consumer took under 2 s with a warm store; CI time is ticket 10's to measure.
