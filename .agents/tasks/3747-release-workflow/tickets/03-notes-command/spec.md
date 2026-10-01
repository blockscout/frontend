# 03 — The `notes` command

| | |
| --- | --- |
| Parent spec | [`../../spec.md`](../../spec.md), ticket 03 of #3747 |
| Blocked by | T02 |

## What to build

`notes <tag>` prints the release notes markdown for a tag from the labeled PR set, so the operator never
edits a generated list by hand. A minor (`vX.Y.0`) lists the PRs merged to `main` since
`merge-base(main, previous minor tag)` that carry no version label; a patch lists the PRs picked onto the
branch since the previous tag. Sections come from the T01 mapping; empty sections are omitted. The
template moves from the repo root into the module.

## Acceptance criteria

- [ ] `RELEASE_NOTES.md` moves to `tools/release/notes-template.md`; the root file is gone.
- [ ] Pure `renderNotes(prs, meta)` groups PRs by the first matching category label (unlabeled → Other
      Changes), one line per PR `- <Title> by @<author> in <url>`, title capitalised, empty sections dropped.
- [ ] "Changes in ENV variables" is built from the PR bodies' "Environment variables" sections, grouped by
      PR number, omitted when every PR says "None"; "Compatibility" lists only services whose minimum version a
      PR body raises, at the highest version named; "New Contributors" and "Full Changelog" use the previous
      tag. Each is a pure function with specs.
- [ ] `notes <tag>` resolves the PR set via T02's `releasePrs` and prints the markdown; `--out <file>`
      writes it.
- [ ] Specs: minor vs patch query, the version-label exclusion, a PR with two mapping labels lands in one
      section.

## Details

- "Full list of the ENV variables" links `docs/ENVS.md` at the tag.
- The `prepare-release` skill's own section-mapping table is deleted in T08; this ticket owns the mapping
  use.

## Leaf worklist

- [x] 1 `[agent]` Move the template, `renderNotes` + section builders with specs
- [x] 2 `[agent]` `notes` subcommand
