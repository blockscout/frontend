# Notes — ticket 10

- **CI install time.** In the Checks run on `97fdce907`
  (https://github.com/blockscout/frontend/actions/runs/43941135947), the `Install dependencies` step of
  the Code quality job took 31 s. The same step took 24 to 26 s in the four latest green runs on other
  branches. The run was the first with the changed lockfile, so part of the difference may be a cold
  store. No reason for the tarball fallback.
- **The doc-links step** passed in that run, in about 1 s.
- **The pull request is a draft, so Checks did not run on the push.** The run above was started by
  `workflow_dispatch` on the branch.
- **Local install** with a warm store: about 6 s, the same before and after a bump.
- **The Docker image build installs the dependency too** and was not measured.
- **The license check needed an exclusion** for `frontend-home` in the license report's config: the
  package is not on the registry, so no license is found.
- **The pin is a commit of home's pull request branch**, not of its main branch. Bump it to a main commit
  once blockscout/frontend-home#5 lands, before the branch is deleted.
