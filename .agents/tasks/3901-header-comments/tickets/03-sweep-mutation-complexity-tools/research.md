# Worklist — 03-sweep-mutation-complexity-tools

75 comment blocks in 33 files, 291 comment lines, as counted when the tickets were written.
A block is listed when it is at the top of its file, is three lines or longer, or is a `/** */` block.
Line numbers drift as the sweep edits a file: work each file from the bottom up, or re-read it.
Licence headers, `@vitest-environment` pragmas, ESLint and TypeScript directives and single-line
`/** @type … */` annotations are already left out.

| File | Line | Lines | Flags |
| --- | --- | --- | --- |
| `tools/code-complexity/analyze.spec.ts` | 30 | 3 |  |
| `tools/code-complexity/analyze.ts` | 14 | 3 |  |
| `tools/code-complexity/analyze.ts` | 20 | 4 |  |
| `tools/code-complexity/coverage/generate.ts` | 11 | 7 |  |
| `tools/code-complexity/coverage/generate.ts` | 66 | 4 |  |
| `tools/code-complexity/coverage/read.ts` | 3 | 3 |  |
| `tools/code-complexity/coverage/read.ts` | 66 | 3 |  |
| `tools/code-complexity/coverage/read.ts` | 73 | 3 |  |
| `tools/code-complexity/coverage/vitest.config.ts` | 5 | 4 |  |
| `tools/code-complexity/index.ts` | 20 | 3 |  |
| `tools/code-complexity/index.ts` | 142 | 7 |  |
| `tools/code-complexity/index.ts` | 161 | 3 |  |
| `tools/code-complexity/index.ts` | 187 | 3 |  |
| `tools/code-complexity/index.ts` | 235 | 3 |  |
| `tools/code-complexity/index.ts` | 265 | 3 |  |
| `tools/code-complexity/measure/complexity.ts` | 3 | 7 |  |
| `tools/code-complexity/measure/complexity.ts` | 35 | 4 |  |
| `tools/code-complexity/measure/complexity.ts` | 71 | 4 |  |
| `tools/code-complexity/measure/complexity.ts` | 162 | 3 |  |
| `tools/code-complexity/measure/complexity.ts` | 210 | 3 |  |
| `tools/code-complexity/measure/complexity.ts` | 239 | 4 |  |
| `tools/code-complexity/measure/crap.ts` | 1 | 4 | top |
| `tools/code-complexity/measure/jsx.ts` | 5 | 5 |  |
| `tools/code-complexity/render/github.ts` | 1 | 3 | top |
| `tools/code-complexity/render/report.ts` | 1 | 2 | top |
| `tools/code-complexity/select/diff.ts` | 6 | 3 |  |
| `tools/code-complexity/select/diff.ts` | 12 | 3 |  |
| `tools/code-complexity/select/diff.ts` | 19 | 3 |  |
| `tools/code-complexity/select/diff.ts` | 31 | 3 |  |
| `tools/code-complexity/select/diff.ts` | 46 | 3 |  |
| `tools/code-complexity/select/scope.ts` | 1 | 12 | top, over-8 |
| `tools/mutation-testing/config.ts` | 22 | 3 |  |
| `tools/mutation-testing/config.ts` | 31 | 4 |  |
| `tools/mutation-testing/eslint/well-formed-disable.mjs` | 1 | 8 | top |
| `tools/mutation-testing/eslint/well-formed-disable.spec.ts` | 8 | 3 |  |
| `tools/mutation-testing/index.spec.ts` | 43 | 3 |  |
| `tools/mutation-testing/index.ts` | 22 | 6 |  |
| `tools/mutation-testing/index.ts` | 57 | 3 |  |
| `tools/mutation-testing/index.ts` | 128 | 4 |  |
| `tools/mutation-testing/index.ts` | 144 | 3 |  |
| `tools/mutation-testing/index.ts` | 202 | 3 |  |
| `tools/mutation-testing/render/findings.ts` | 1 | 4 | top |
| `tools/mutation-testing/render/github.ts` | 1 | 4 | top |
| `tools/mutation-testing/render/github.ts` | 26 | 3 |  |
| `tools/mutation-testing/render/table.ts` | 1 | 2 | top |
| `tools/mutation-testing/render/truncation.ts` | 4 | 3 |  |
| `tools/mutation-testing/select/files.spec.ts` | 99 | 3 |  |
| `tools/mutation-testing/select/files.ts` | 10 | 5 |  |
| `tools/mutation-testing/select/files.ts` | 72 | 3 |  |
| `tools/mutation-testing/select/files.ts` | 89 | 4 |  |
| `tools/mutation-testing/select/files.ts` | 106 | 3 |  |
| `tools/mutation-testing/select/ranges.spec.ts` | 58 | 3 |  |
| `tools/mutation-testing/select/ranges.ts` | 5 | 5 |  |
| `tools/mutation-testing/select/ranges.ts` | 21 | 8 |  |
| `tools/mutation-testing/select/ranges.ts` | 83 | 3 |  |
| `tools/mutation-testing/stryker/invoke.ts` | 11 | 5 |  |
| `tools/mutation-testing/stryker/invoke.ts` | 35 | 4 |  |
| `tools/mutation-testing/stryker/invoke.ts` | 49 | 3 |  |
| `tools/mutation-testing/stryker/invoke.ts` | 63 | 3 |  |
| `tools/mutation-testing/stryker/invoke.ts` | 120 | 3 |  |
| `tools/mutation-testing/stryker/lock.ts` | 5 | 3 |  |
| `tools/mutation-testing/stryker/lock.ts` | 90 | 3 |  |
| `tools/mutation-testing/stryker/report.ts` | 5 | 3 |  |
| `tools/mutation-testing/stryker/report.ts` | 61 | 5 |  |
| `tools/mutation-testing/stryker/report.ts` | 92 | 3 |  |
| `tools/mutation-testing/stryker/report.ts` | 119 | 4 |  |
| `tools/mutation-testing/stryker/report.ts` | 146 | 4 |  |
| `tools/mutation-testing/stryker/report.ts` | 155 | 3 |  |
| `tools/mutation-testing/stryker/results.ts` | 7 | 3 |  |
| `tools/mutation-testing/stryker/results.ts` | 33 | 3 |  |
| `tools/mutation-testing/stryker/stream.ts` | 6 | 4 |  |
| `tools/mutation-testing/stryker/stream.ts` | 29 | 3 |  |
| `tools/mutation-testing/stryker/streaming-reporter.mts` | 10 | 6 |  |
| `tools/mutation-testing/stryker/streaming-reporter.mts` | 29 | 3 |  |
| `tools/mutation-testing/vitest.config.ts` | 5 | 8 |  |
