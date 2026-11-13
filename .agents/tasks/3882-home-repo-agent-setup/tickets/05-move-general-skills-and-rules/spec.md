# 05 — Move the general skills and rules to home

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 05 of #3882 |
| Target repo | home (`blockscout/frontend-home`) |
| Blocked by | T01 |

## What to build

`grilling` and `update-glossary` are home skills, and the `adr` and `docs` rules are home rules, each
current with `frontend`'s version. Home's own documents follow the two rules, and both skills work from
a home session against the active child without edits to how they name paths.

The review trio is ticket 07, the unit-test rule ticket 06, and the frozen copies in `frontend` ticket 08.

## Acceptance criteria

- [ ] Home's `grilling`, `update-glossary`, `adr` and `docs` match `frontend`'s current versions, apart
  from the changes listed below.
- [ ] The prototype's wording about a consumer reading shared files from a submodule mount is gone from
  the moved files and from home's guidance on writing a shared file.
- [ ] Root-relative paths in the moved files resolve in the active child; a path meant for home itself
  says so.
- [ ] Home's rules load on a matching read in a home session, for a home document and for a `frontend`
  document.
- [ ] Home's existing documents pass the `docs` rule, and `doc-links` passes in home.

## Details

- **Where this lands.** Run the session inside the `frontend` clone nested in the home clone, on
  `issue-3882`, with the home root (`..`) added to the session: `implement-ticket` and these ticket files
  are there, and a session started at the home root cannot invoke it until ticket 02 lands. The work is
  committed in home, on a branch of its own with a pull request that links the issue. The leaf boxes and
  the `progress.md` tick are the only changes committed in `frontend`.
- The prototype already holds older copies of `update-glossary`, `adr` and `docs`; overwrite them from
  `frontend`, then apply the home wording.
- In a home session the frozen rule in `frontend` loads alongside the home original. This double load is
  accepted.

## Leaf worklist

- [ ] 1 `[agent]` Bring the two skills and two rules to home from `frontend`'s current versions
- [ ] 2 `[agent]` Reword for the home layout and the active child; make home's own documents pass
