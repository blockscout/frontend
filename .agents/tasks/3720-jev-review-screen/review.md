# Review — 3720-jev-review-screen · branch

## Rounds

- **1** — 2026-09-28, Claude Fable 5.1. blocker 0 · major 4 · nit 20. Outcome: blocked.

## Findings

| id | severity | axis | location |
| --- | --- | --- | --- |
| F1 | major | spec | `.agents/skills/review-changes/axes.md:85` |
| F2 | major | correctness | `tools/review-screen/select/change.ts:61` |
| F3 | major | standards | `.agents/skills/review-changes/axes.md:101` |
| F4 | major | standards | `tools/review-screen/select/hunks.ts:12` |
| F5 | nit | standards | `tools/review-screen/index.ts:61` |
| F6 | nit | spec | `tools/review-screen/sidecar.ts:100` |
| F7 | nit | correctness | `tools/review-screen/sidecar.ts:101` |
| F8 | nit | spec | `tools/review-screen/config.ts:15` |
| F9 | nit | spec | `tools/review-screen/grid/standards.ts:109` |
| F10 | nit | spec | `.agents/skills/review-changes/axes.md:76` |
| F11 | nit | standards | `.agents/skills/review-changes/SKILL.md:193` |
| F12 | nit | standards | `.agents/GLOSSARY.md:46` |
| F13 | nit | standards | `.agents/skills/review-changes/SKILL.md:181` |
| F14 | nit | standards | `tools/review-screen/select/hunks.ts:41` |
| F15 | nit | standards | `tools/review-screen/grid/spec.ts:118` |
| F16 | nit | standards | `tools/review-screen/rubric.spec.ts:25` |
| F17 | nit | standards | `tools/review-screen/index.ts:63` |
| F18 | nit | standards | `tools/review-screen/origins/parse.ts:56` |
| F19 | nit | standards | `tools/review-screen/CONTEXT.md:47` |
| F20 | nit | correctness | `tools/review-screen/grid/spec.ts:150` |
| F21 | nit | correctness | `tools/review-screen/select/spec.ts:48` |
| F22 | nit | correctness | `tools/review-screen/grid/standards.ts:113` |
| F23 | nit | correctness | `tools/review-screen/config.ts:6` |
| F24 | nit | correctness | `tools/review-screen/index.ts:159` |

### F1 · major · spec · `.agents/skills/review-changes/axes.md:85`

**Claim.** FR8: `--origins` "records each suspect's fate (confirmed / dropped with reason / …)". The `jev` axis returns drops as prose lines — `drop: <rule> <path>:<line> | FR<n> — <reason>` — and `SKILL.md` step 5 forwards "the `jev` axis's drop list verbatim"; the Origins dispatch says "Write both tables to one file, as given". But `origins/parse.ts` reads only a JSON array or pipe tables (`| suspect | fate | reason |`): a verbatim `drop:` line never parses, so every dropped suspect is recorded as `not reported` and the axis's reason is lost. The conversion step is nowhere.

**Fix.** Have the `jev` axis emit drops directly as `| suspect | fate | reason |` rows (fate `dropped`), so "verbatim" is literally true; or tell the Origins dispatch explicitly to translate each `drop:` line into that row.

**Status:** open

### F2 · major · correctness · `tools/review-screen/select/change.ts:61`

**Claim.** Renamed files are scored whole. `getChangedFiles` runs `git diff --name-only <base> --` with git's default rename detection, so a rename is listed under its new path only; `readHunks` (`select/hunks.ts:106`) then runs `git diff --unified=3 --no-color <base> -- <file>` whose single pathspec excludes the old path, so git cannot pair the rename and emits the file as one `@@ -0,0 +1,N @@` hunk. Every moved-but-unchanged line becomes an `added` line id, the standards grid scores code that predates the change (against the "hunks, not whole files" decision in the spec and `CONTEXT.md`), and the locate step can name an untouched line.

**Fix.** Diff the whole change once (`git diff -U<n> --no-color <base> --`, no per-file pathspec), split on `diff --git` headers and key hunks by the new path; or pass every listed path in one pathspec so rename pairing survives.

**Status:** open

### F3 · major · standards · `.agents/skills/review-changes/axes.md:101`

**Claim.** "Write both tables to one file, as given, and run: `pnpm review:screen --origins <sidecar path> --findings <file>`" names no location for the file — **Rule without a mechanism** (`prose-smells.md`). An agent's default is the cwd, i.e. the checkout; an untracked findings file there breaks the clean-tree precondition `SKILL.md` step 1 sets for the next `first` round. The tool already accepts `--findings -` (stdin, `index.ts:48`/`:69`), which the brief never mentions.

**Fix.** Say where: pipe the tables over stdin (`--findings -` via a heredoc), or name a path outside the repo (`mktemp`, the session scratchpad).

**Status:** open

### F4 · major · standards · `tools/review-screen/select/hunks.ts:12`

**Claim.** `StateLine` is a bag of optionals — `kind: 'context' | 'added' | 'removed'` next to `line: number | undefined` — so every consumer casts: `lineId(line.line as number)` at lines 117, 119 and 162. `.agents/rules/typescript.md` "Discriminated unions": "Use discriminated unions to prevent the 'bag of optionals' problem"; `renderLine` already switches on `kind`, so the union is the natural shape.

**Fix.** `type StateLine = { kind: 'added' | 'context'; line: number; text: string } | { kind: 'removed'; text: string }`; the three `as number` casts and the `line: undefined` literals in the specs go away.

**Status:** open

### F5 · nit · standards · `tools/review-screen/index.ts:61`

**Claim.** `USAGE` says `--calibration … so --report leaves it out of the pilot's numbers`, `CONTEXT.md:60` says "`--report` filters on that field", `sidecar.ts:58` says "`--report` leaves it out" — but no `--report` flag exists (`FLAGS` at `index.ts:79` rejects it as unknown). FR14's `--report` is ticket 07, still unchecked in `progress.md`, so this is expected WIP drift; `docs.md`: "The code is the only source of truth for what it does", and `CONTEXT.md:16` routes "How do I run it?" to `--help`. Fine if 07 lands on this branch before merge, stale if the pilot ships without it.

**Fix.** Land ticket 07 on this branch, or phrase the three sites as "a later report step" until it exists.

**Status:** open

### F6 · nit · spec · `tools/review-screen/sidecar.ts:100`

**Claim.** FR8 names the sidecar "by date, branch, scope and ticket", and `sidecarFileName` does exactly that — so two `first` rounds on the same day, branch and scope overwrite each other: cells, suspects and the earlier `origins` block. Both are routine pilot flows: `/review-changes md --scope branch` then `/review-changes pr` (both `--scope branch`, no ticket) the same day, and two concurrent reviewers under `--as`. The ~10-review dataset silently loses runs; `CONTEXT.md` records it as a gotcha rather than fixing it. Whether the spec's naming is meant to be exhaustive is a design call.

**Fix.** Add a time or run-id segment (or the `--as` tag) to the file name, or refuse to overwrite an existing sidecar that carries `origins`.

**Status:** open

### F7 · nit · correctness · `tools/review-screen/sidecar.ts:101`

**Claim.** `name.date.toISOString().slice(0, 'YYYY-MM-DD'.length)` names the sidecar by the UTC date, while the `CONTEXT.md` gotcha about "the same day" overwriting and the calibration notes reason in local days. In Europe a run after midnight local carries yesterday's date, and one at 02:00 collides with the previous evening's; `sidecar.spec.ts:22` (`23:30Z` → `2026-09-28`) pins the UTC reading.

**Fix.** Build the date from local `getFullYear/getMonth/getDate`, or state UTC in the `CONTEXT.md` gotcha.

**Status:** open

### F8 · nit · spec · `tools/review-screen/config.ts:15`

**Claim.** FR3: "each Functional Requirement is scored per touched file". `SPEC_GRID_EXCLUDE = '.agents/tasks/**'` (applied at `index.ts:204` via `specGridFiles`) drops the task folder from the spec grid — behaviour the spec never asked for. The rationale in `CONTEXT.md` is sound, but it is a design decision made during tickets 03/05, not in the spec, and `notes.md` does not record it as developer-accepted.

**Fix.** Add the exclusion to the spec's Implementation decisions, or drop it and let the `jev` axis handle spec-file cells via its drop reasons.

**Status:** open

### F9 · nit · spec · `tools/review-screen/grid/standards.ts:109`

**Claim.** FR2: "A cell over its threshold gets a second, `choice` call over the changed line ids to locate the offending line." A removal-only window has no new-side changed lines (`changedIds: []`, `hunks.spec.ts:121-122`), yet it is still scored on the standards grid and, when over threshold, `if (windowRef.changedIds.length === 0)` makes it a suspect at `windowRef.firstLine` — an unchanged context line. Every rubric question asks whether "the changed code adds/uses/builds …" something, so such a suspect can only be dropped ("the flagged line is unchanged context").

**Fix.** Skip windows with no `changedIds` on the standards grid, or exclude them from `bestCells`.

**Status:** open

### F10 · nit · spec · `.agents/skills/review-changes/axes.md:76`

**Claim.** FR12: "A tool failure never fails a review." The brief ends the axis only on "A `skipped` or `failed` status, or no suspect in either list". A non-zero exit — `main().catch` at `index.ts:290-293`, e.g. `git merge-base main HEAD` failing when `main` is absent locally, or a non-`TypeSafeError` thrown mid-pool — leaves the `jev` subagent with no instruction and no sidecar path; `SKILL.md`'s "one has failed and you have noted which" is the only fallback.

**Fix.** One sentence in the brief: a non-zero exit is reported as `status: failed — <stderr>` with no sidecar, and the axis stops.

**Status:** open

### F11 · nit · standards · `.agents/skills/review-changes/SKILL.md:193`

**Claim.** "Suspects, confirmed and dropped come from the axis's return, the origin split from the `--origins` JSON." Two sources for one line: the `--origins` JSON already carries a fate per suspect (`confirmed` / `merged` / `dropped`), and after step 4's anchor check drops a `jev` finding the axis's own count says confirmed while the tool records `dropped: not reported` — **Duplication** (`prose-smells.md`). Also an **Incomplete case split** at line 194: a run that is `ok` with zero suspects has `reason: undefined` in the JSON, so "carries the reason instead" has nothing to carry.

**Fix.** Take all four numbers from the `--origins` JSON (`suspects[].fate`, `findings[].origin`); say what the line prints for `ok` with no suspects.

**Status:** open

### F12 · nit · standards · `.agents/GLOSSARY.md:46`

**Claim.** "also the name of the fourth `review-changes` axis and of the sidecar folder. Returns probabilities, not claims — a subagent verifies every suspect before it becomes a finding." "fourth" is the axis count this same diff deliberately removed from `code-reviewer.md` (ticket 06: "description no longer counts the axes") — **Sediment** in waiting. The last sentence restates `axes.md:62-64` and `CONTEXT.md:7-8` — **Duplication**; the glossary header limits rows to disambiguation and etymology, and the folder mention brushes its "paths intentionally not listed" rule.

**Fix.** "TypeSafe's typed-judgment model behind the `review-screen` tool; also the name of the `review-changes` axis that runs it." Drop the rest.

**Status:** open

### F13 · nit · standards · `.agents/skills/review-changes/SKILL.md:181`

**Claim.** "the final table in the shape its Origins section gives — `| id | axis | location | sources |`, where a requirement finding with no line writes its `FR<n>` as the location" points at `axes.md` *and* restates it. The `FR<n>`-as-location rule now lives in four places: `axes.md:83`, `axes.md:114`, here, and `tools/review-screen/CONTEXT.md:70-73`; the column list in three plus the `USAGE` text. **Shotgun Surgery** (`prose-smells.md`: "a pointer that restates drifts, and the restatement is the copy that goes stale").

**Fix.** Point only: "the final table in the shape the Origins section of `axes.md` gives, and the `jev` axis's drop list verbatim."

**Status:** open

### F14 · nit · standards · `tools/review-screen/select/hunks.ts:41`

**Claim.** **Duplicated Code** with `tools/code-complexity/select/diff.ts`, the module this tool already imports from: `HUNK_HEADER` (line 41 vs `diff.ts:43`, same regex minus one group) and `maxBuffer: 64 * 1024 * 1024` (line 109 vs `diff.ts:15`). `code-quality.md` "Magic numbers": "If the same unexplained value must stay in sync at more than one call site, one constant is the share point." The tool also spawns git three ways — a `git()` helper in `change.ts:39`, inline `execFileSync` in `hunks.ts:106` (with the buffer) and `sidecar.ts:92` (without) — and `change.spec.ts:20` and `sidecar.spec.ts:18` re-declare the same `git()` test helper.

**Fix.** Export `git()` (with its `maxBuffer`) and `HUNK_HEADER` from `../code-complexity/select/diff.ts`, or give the tool one `select/git.ts`; share the spec helper the same way.

**Status:** open

### F15 · nit · standards · `tools/review-screen/grid/spec.ts:118`

**Claim.** `scoreWindowTask` here (lines 118-137) and in `standards.ts:75-88` are the same shape — build named `noul` questions, `recorder.timed('noul', …)`, push one cell per answer — and the same clump `(client, config, recorder)` travels as a `ScreenContext` in one and three loose params in the other. **Duplicated Code** / **Data Clumps** (`smells.md`). Relatedly, `splitCap` / `shareCap` (lines 85-116) concern both grids yet sit in the spec grid — `CONTEXT.md` has to answer "Where is the cap shared? `./grid/spec.ts`" because the file name does not.

**Fix.** One `scoreWindow(target, window, questions, context)` in `grid/shared.ts` keyed by a `(id → question)` map; move `splitCap` / `shareCap` beside it.

**Status:** open

### F16 · nit · standards · `tools/review-screen/rubric.spec.ts:25`

**Claim.** `expect(MIN_RULES).toBe(8); expect(MAX_RULES).toBe(10);` asserts two constants equal their own literals — `tests-unit.md` "Tautological tests: expected value restates the implementation". `MIN_RULES` / `MAX_RULES` (`rubric.ts:12-13`) are exported for this spec only; nothing else imports them — **Dead Scaffolding** (`smells.md`: exports the change introduces and never uses).

**Fix.** `expect(RULES.length).toBeGreaterThanOrEqual(8)` / `toBeLessThanOrEqual(10)` in the spec; delete the two exports.

**Status:** open

### F17 · nit · standards · `tools/review-screen/index.ts:63`

**Claim.** `USAGE` prints "Without TYPESAFE_API_KEY in the environment the run is skipped" while `CONTEXT.md:40-42` sets the constraint "no agent instruction names the variable. Keep it that way — an agent told the variable's name will try to set it", and `CONTEXT.md:16` routes "How do I run it?" to `--help`. Whether help output counts as an agent instruction is the author's call; the `jev` brief's reader is the same agent.

**Fix.** "Without an API key in the environment the run is skipped" in `USAGE`, or say in `CONTEXT.md` that `--help` is the one exempt place.

**Status:** open

### F18 · nit · standards · `tools/review-screen/origins/parse.ts:56`

**Claim.** `// A standards suspect is named `<rule> <file>:<line>`, a spec suspect by its requirement id.` restates the two return lines of `parseSuspectRef` below it; likewise line 139 `// Every pipe table in the text, its rows keyed by the lower-cased header cells.` restates `markdownTables`. `code-quality.md` "Comments": allowed only when it explains *why* the obvious code is wrong; "Do not add JSDoc that restates the name or types."

**Fix.** Delete both.

**Status:** open

### F19 · nit · standards · `tools/review-screen/CONTEXT.md:47`

**Claim.** "**The `spec` block in the output has its own status.** `no-spec` when …; `skipped` when …; `failed` when …" walks the `SpecRecord` union that `sidecar.ts:21-33` already states, with its own comment. `docs.md` "What the code and the environment already say": "Control flow, signatures, … types. The reader opens the file." Same for the gotcha at line 86 ("A `choice` question takes at most 255 options"), a copy of the comment on `config.ts:28`, and the symbol names `SPEC_THRESHOLD` (44), `SPEC_GRID_EXCLUDE` (79), `EntryType` (89) — `docs.md` "Point at directories and files, not at symbols".

**Fix.** Cut the status bullet to its one keepable line ("only the API failure also fails the run; a bad spec path still gets the review its standards grid") and point at `./sidecar.ts`; drop the 255 gotcha; name `./config.ts` / `./rubric.ts` instead of the symbols.

**Status:** open

### F20 · nit · correctness · `tools/review-screen/grid/spec.ts:150`

**Claim.** With a spec but no file left in the spec grid (a diff touching only `.agents/tasks/**`, or only binary/deleted files), `recorder.cells` is empty, `bestByRequirement` returns nothing and `selectSpecSuspects` yields `suspects: []` under `status: 'ok'` — "every requirement addressed", the opposite of the `CONTEXT.md` rule that "a requirement no file seems to address becomes a suspect". `spec.spec.ts:184` (`screenSpec([], REQUIREMENTS …)` → `suspects: []`) enshrines it.

**Fix.** In `screenSpec`, seed a cell per requirement with score 0 (or report `spec.status` as `no-files` with a reason) when `files` is empty.

**Status:** open

### F21 · nit · correctness · `tools/review-screen/select/spec.ts:48`

**Claim.** `current = { id: `FR${ item[1] }`, … }` takes the number as written, so a spec using Markdown's all-`1.` list style (or any repeated number) produces duplicate ids: `Object.fromEntries(requirements.map(...))` in `grid/spec.ts:127` collapses them into one question, every duplicate records the same score, and the rest of the requirements are never asked about — silently.

**Fix.** In `readSpec`, return `status: 'failed'` with a reason when ids repeat (or number sequentially and keep the written number in `text`).

**Status:** open

### F22 · nit · correctness · `tools/review-screen/grid/standards.ts:113`

**Claim.** When `windowRef.changedIds.length === 1` the locate step still issues a `choice` call whose only option is the one line — a request whose answer is known before it is sent, and whose acceptance by the API (a single-label choice) is unverified; a rejection would end the run as `failed` via `runPool`.

**Fix.** Treat one changed id like zero: `if (windowRef.changedIds.length <= 1) { located.push({ …, line: parseLineId(changedIds[0]) ?? firstLine }); return; }`.

**Status:** open

### F23 · nit · correctness · `tools/review-screen/config.ts:6`

**Claim.** `STANDARDS_THRESHOLD_OVERRIDES: Readonly<Record<string, number>>` is keyed by free strings; `thresholdFor` (`config.thresholdOverrides[rule] ?? config.defaultThreshold`) silently falls back to the default on a typo or after a rule is renamed in `rubric.ts`, so the override calibrated in ticket 05 can vanish without any signal.

**Fix.** Add a `rubric.spec.ts` case asserting every override key is a `RULES` id.

**Status:** open

### F24 · nit · correctness · `tools/review-screen/index.ts:159`

**Claim.** The orchestration the `jev` brief relies on — `statusOf` (`skipped` without a client, `failed` on either grid's failure), `specRecordOf` (four branches), and "every run writes its sidecar" — has no test: `index.spec.ts` covers `parseArgs` and `--origins` only, and the grid specs stop at `screenStandards` / `screenSpec`. A regression that made a missing key throw, or a bad `--spec` fail the run, would pass the suite.

**Fix.** Export `screen` / `buildRecord` and add cases with `{ ok: false }` client, a `failed` spec source, and a grid failure, asserting the status, reason and spec record.

**Status:** open
