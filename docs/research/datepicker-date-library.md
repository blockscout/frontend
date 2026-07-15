# Can we keep dayjs for the new DatePicker instead of adopting `@internationalized/date`?

Research notes, 2026-07-14. Facts checked locally on branch `tom2drum/date-picker` (HEAD `6deeb7d88`), `@chakra-ui/react` 3.36.0, `dayjs` ^1.11.21. Bundle sizes measured with the repo's own esbuild 0.25.12 (`--bundle --minify`, gzip via `gzip -c | wc -c`).

## TL;DR / Recommendation

**Yes — keep dayjs app-wide. Convert at the DatePicker wrapper boundary via ISO strings, using the `parseDate` helper that `@chakra-ui/react` already re-exports. Do not add `@internationalized/date` to `package.json`, and do not import it in app code.**

1. **`@internationalized/date` is unavoidable.** It is a *hard* dependency of `@ark-ui/react` (pinned `3.12.2`), which is a hard dependency of `@chakra-ui/react` 3.36.0; the Zag date-picker machine statically imports it. The moment the DatePicker is in the bundle (it is, on this branch), so is `@internationalized/date` — regardless of what app code imports. There is no adapter mechanism to swap it for dayjs; the machine's internals are hardwired to `CalendarDate`/`DateFormatter`.
2. **The marginal bundle cost is small and already paid.** The subset of `@internationalized/date` the picker actually pulls in measures **17.4 kB min / 5.9 kB gzip** (non-Gregorian calendars verified tree-shaken away) — about 16% of the whole date-picker machine graph (115 kB min / 36 kB gzip). Avoiding it saves nothing; it ships with the component either way.
3. **The component's own props are typed in `DateValue` and accept nothing else** (`value`, `defaultValue`, `min`, `max`, `focusedValue`). But every boundary crossing has a string/`Date` escape hatch: `onValueChange` details include `valueAsString: string[]` (ISO), the API object exposes `valueAsDate: Date[]`, and the re-exported `parseDate` converts ISO strings and JS `Date`s into `DateValue`. So a wrapper can present a dayjs/ISO-string interface with ~4 lines of conversion.
4. **Boundary conversion is the ecosystem's beaten path.** The Ark UI maintainer's own react-hook-form integration example keeps plain strings in form state and converts with `parseDate` at the component boundary; Chakra/Ark/Zag docs never instruct installing or adopting `@internationalized/date` in app code.
5. **The "two date libraries" concern is moot.** dayjs is imported in 55 files via our `src/shared/date-and-time/dayjs.ts` wrapper (7.7 kB min / 3.4 kB gzip core; 19.4 kB / 7.0 kB with our seven plugins) and is not going anywhere; the picker's internal `@internationalized/date` subset ships regardless. Both coexist at a total cost of ~13 kB gzip, most of which we'd pay under any alternative. Suggested guard so it stays a boundary detail: add `@internationalized/date` to the `no-restricted-imports` list in `eslint.config.mjs` (message: "convert at the DatePicker wrapper; use parseDate/DateValue re-exported from @chakra-ui/react"). Note that pnpm's strict layout already blocks direct imports today — see §1.

---

## 1. Dependency chain: is `@internationalized/date` a hard dependency?

Verified in the installed tree (not just docs):

| Package (installed) | Declares | Evidence |
|---|---|---|
| `@chakra-ui/react` 3.36.0 | `dependencies: { "@ark-ui/react": "5.37.2" }` | `node_modules/@chakra-ui/react/package.json` |
| `@ark-ui/react` 5.37.2 | `dependencies: { "@internationalized/date": "3.12.2", "@zag-js/date-picker": "1.41.2", "@zag-js/date-utils": "1.41.2", … }` — a **hard (non-peer) dependency, exact-pinned** | `node_modules/.pnpm/@ark-ui+react@5.37.2_…/node_modules/@ark-ui/react/package.json` |
| `@zag-js/date-picker` 1.41.2 | `peerDependencies: { "@internationalized/date": ">=3.0.0" }` (Ark satisfies it) | `node_modules/.pnpm/@zag-js+date-picker@1.41.2_…/package.json` |
| `@zag-js/date-utils` 1.41.2 | same peer dependency, no regular deps | `node_modules/.pnpm/@zag-js+date-utils@1.41.2_…/package.json` |

So: **install-time, it is always present** (`@internationalized/date@3.12.2` is in `pnpm-lock.yaml` via Ark). **Bundle-time**, all three packages declare `"sideEffects": false` and ship ESM, so if the app never imported the DatePicker, the machine and `@internationalized/date` would tree-shake out of the client bundle. This branch imports it (`src/toolkit/chakra/date-picker.tsx`, used by `src/toolkit/pages/design-system/tabs/DatePicker.tsx`), so it ships. The Zag source imports it statically — e.g. `@zag-js/date-picker/dist/date-picker.parse.mjs` begins `import { CalendarDate, parseDate } from "@internationalized/date"` — there is no injection point for a different date library.

Zag's docs confirm this is by design: "The date picker is built on top of the `@internationalized/date` library" ([zagjs.com date-picker](https://zagjs.com/components/react/date-picker)).

**pnpm detail that decides the app-code question for us:** `@internationalized/date` is *not* hoisted to the root `node_modules` (`ls node_modules/@internationalized` → does not exist; it lives only under `node_modules/.pnpm/`). App code physically cannot `import '@internationalized/date'` without adding it to our `package.json`. We don't need to: `@chakra-ui/react` re-exports everything the boundary needs (§2).

## 2. API surface: what needs `DateValue`, what accepts strings/`Date`

From the installed type definitions (`@zag-js/date-picker/dist/date-picker.types.d.mts`; Chakra's `DatePicker.Root` props extend these):

| Prop / callback | Type | String/`Date` alternative? |
|---|---|---|
| `value`, `defaultValue` | `DateValue[]` | No — construct via `parseDate` |
| `min`, `max` | `DateValue` | No — same |
| `focusedValue`, `defaultFocusedValue` | `DateValue` | No — same |
| `isDateUnavailable` | `(date: DateValue, locale: string) => boolean` | receives `DateValue` |
| `format` | `(date: DateValue, details: { locale, timeZone }) => string` | **returns a string** — this is where dayjs display formatting can plug in |
| `parse` | `(value: string, details) => DateValue \| undefined` | **receives a string** — dayjs can do the lenient parsing, then hand back `parseDate(iso)` |
| `onValueChange` | `(details: { value: DateValue[]; valueAsString: string[]; view }) => void` | **`valueAsString` is ISO 8601** (`CalendarDate.toString()` → `"2026-07-14"`) |
| API object (`useDatePickerContext()` / context render-prop) | exposes `valueAsDate: Date[]`, `valueAsString: string[]`, `focusedValueAsDate: Date`, `setValue(DateValue[])` | native-`Date` reads built in |

`DateValue` is `CalendarDate | CalendarDateTime | ZonedDateTime` (`@zag-js/date-utils/dist/types.d.mts`), i.e. the `@internationalized/date` classes ([Adobe docs](https://react-aria.adobe.com/internationalized/date/)).

**The conversion helper is already exported from Chakra.** `@ark-ui/react/date-picker` re-exports Zag's `parse` as `parseDate`, and `@chakra-ui/react` re-exports it at the root (verified: `require('@chakra-ui/react').parseDate` is a function; `DateValue` and `DatePickerValueChangeDetails` types are re-exported too — `node_modules/@chakra-ui/react/dist/types/components/date-picker/index.d.ts`). Its full source (`date-picker.parse.mjs`):

```js
import { CalendarDate, parseDate } from "@internationalized/date";
function parse(value) {
  if (Array.isArray(value)) return value.map((v) => parse(v));
  if (value instanceof Date)
    return new CalendarDate(value.getFullYear(), value.getMonth() + 1, value.getDate());
  return parseDate(value); // ISO 8601 date string, e.g. "2026-07-14"
}
```

So it accepts `string | Date | (string | Date)[]`.

## 3. Converting at the wrapper boundary — pattern and precedent

The clean shape for `src/toolkit/chakra/date-picker.tsx` (or a thin app-side wrapper above it, since the toolkit package shouldn't depend on the app's dayjs instance):

```tsx
import { parseDate, type DatePickerValueChangeDetails } from '@chakra-ui/react';
import dayjs from 'src/shared/date-and-time/dayjs';

// in  → picker: ISO date string (or dayjs) → DateValue
<DatePicker.Root
  value={ selected ? [ parseDate(selected /* 'YYYY-MM-DD' */) ] : [] }
  min={ parseDate(dayjs(minTs).format('YYYY-MM-DD')) }
  onValueChange={ (d: DatePickerValueChangeDetails) => onChange(d.valueAsString[0]) } // ISO out
/>
```

- **dayjs → picker:** `dayjs(x).format('YYYY-MM-DD')` → `parseDate(...)`. Prefer the explicit string over passing a JS `Date`: `parse(Date)` reads *local* `getFullYear/getMonth/getDate`, so a UTC-midnight timestamp viewed from a negative-offset timezone becomes the previous day. Formatting with dayjs (and choosing `.utc()` or local deliberately) keeps that decision in our code.
- **picker → dayjs:** `details.valueAsString[0]` (ISO `YYYY-MM-DD`) → `dayjs(...)`; or `value[0].toDate(timeZone)` / the API's `valueAsDate` when a JS `Date` is wanted. `CalendarDate` is date-only — time-of-day/timezone semantics are attached at conversion, which is exactly the boundary decision we want dayjs to own.

Precedent for this pattern (no official "dayjs adapter" exists anywhere in the chain):

- The **Ark UI maintainer's recommended react-hook-form integration** keeps plain strings in form state and converts only at the component: `value={field.value.map(parseDate)}` / `onValueChange={(d) => field.onChange(d.valueAsString)}` ([chakra-ui/ark discussion #2592](https://github.com/chakra-ui/ark/discussions/2592)). The asker in that thread formats for display with date-fns from `date.toString()` — third-party date libs at the boundary, unremarked-on by the maintainer.
- **Chakra's docs** only say "Date values are provided using objects from `@internationalized/date`" and never instruct installing it or using it outside the component; examples import from `@chakra-ui/react` ([chakra-ui.com date-picker docs](https://chakra-ui.com/docs/components/date-picker); docs source `apps/www/content/docs/components/date-picker.mdx` in chakra-ui/chakra-ui).
- **Zag's docs** describe `parse` ("Parses an ISO 8601 date string") and custom `format`/`parse` context options for exactly this kind of interop ([zagjs.com](https://zagjs.com/components/react/date-picker)).
- A web search for a dayjs/date-fns adapter in ark-ui/zag/chakra turns up only community wrappers of *other* pickers (e.g. `chakra-datetime-picker` wraps dayjs for Chakra v2) — nothing suggesting the internal library is swappable, and no issues complaining about the dual-library situation.

## 4. Bundle-size impact (measured)

esbuild `--bundle --minify --format=esm` against this repo's installed versions; gzip = `gzip -c | wc -c`:

| Entry bundled | Minified | Gzip |
|---|---|---|
| The exact named imports Zag pulls from `@internationalized/date` (`CalendarDate`, `DateFormatter`, `parseDate`, `toCalendar`, `toCalendarDateTime`, `today`, `startOf/endOf Month/Week`, `isSameDay`) | **17,426 B** | **5,904 B** |
| Full `@internationalized/date` barrel (`export *`) | 33,661 B | 11,162 B |
| Entire `@zag-js/date-picker` machine graph (incl. the above + zag core deps) | 115,238 B | 36,307 B |
| `dayjs` core | 7,733 B | 3,381 B |
| `dayjs` + the 7 plugins our `src/shared/date-and-time/dayjs.ts` registers | 19,448 B | 6,967 B |

Notes:

- Tree-shaking works: the 13 non-Gregorian calendars (Buddhist, Ethiopic, Hebrew, Islamic, Persian, Japanese, …) are absent from both the subset and the full machine bundle (grep of the minified output: 0 hits). `@internationalized/date` declares `"sideEffects": false`. This matches Adobe's own claim: "8 kB minified and compressed with Brotli" for everything, "2.8 kB" using only the Gregorian calendar ([Adobe docs](https://react-aria.adobe.com/internationalized/date/)).
- Numbers are esbuild estimates, not a Next.js production-build diff, but the ordering is what matters: the `@internationalized/date` share (~6 kB gzip) is a sixth of the date-picker machine we're adopting anyway, and comparable to the dayjs footprint we already ship on every page.
- **Nothing is saved by avoiding either library.** Dropping dayjs app-wide (55 importing files, a tuned relative-time/locale config in `src/shared/date-and-time/dayjs.ts`, and an eslint rule funnelling all imports through it) would be a large rewrite to *maybe* save ~7 kB gzip while forcing `@internationalized/date` + `Intl` idioms everywhere; adding `@internationalized/date` to app code saves nothing either, since the picker's copy is bundled regardless and dayjs stays for relative time, durations, UTC formatting, etc.

## 5. Direct answers

1. **Hard dependency?** Yes — hard dep of `@ark-ui/react` (exact-pinned), peer dep of the Zag date packages, statically imported by the machine. In our bundle iff the DatePicker is used; on this branch, it is. (§1)
2. **Value/API types?** `value`/`defaultValue`/`min`/`max`/`focusedValue` require `DateValue` objects; `format`/`parse` are string-facing customization hooks; `onValueChange` supplies ISO strings alongside; the API object supplies `Date`s. `parseDate` (re-exported from `@chakra-ui/react`) converts `string | Date` in. (§2)
3. **Boundary conversion sane?** Yes — it's the maintainer-demonstrated pattern; convert via ISO `YYYY-MM-DD` strings, not JS `Date`, to avoid local-timezone day-shift. (§3)
4. **Bundle impact?** Picker's `@internationalized/date` subset ≈ 5.9 kB gzip, unavoidable; dayjs (already shipped) ≈ 7 kB gzip with plugins; no realistic saving on either side. (§4)
5. **Is using both a problem?** No. They never meet except at the wrapper, the combined cost is ~13 kB gzip mostly already paid, and every alternative (rewriting the app onto `@internationalized/date`, or forking the picker off it) is strictly worse. Keep the boundary honest with an eslint `no-restricted-imports` entry for `@internationalized/date` (pnpm already enforces it mechanically).

## Not verified

- Chakra docs example imports were checked via the docs page and the `date-picker.mdx` source summary, not every individual example file; the runtime re-export of `parseDate` from `@chakra-ui/react` was verified directly against the installed package instead.
- No official statement *for or against* third-party date libraries exists in Chakra/Ark/Zag docs — the recommendation in §3 is inferred from the maintainer's discussion answer and the API design (string escape hatches), not an explicit endorsement.
- Bundle numbers are esbuild-minified estimates on the installed packages, not measured out of a Next.js production build (chunking/scope-hoisting will shift absolute numbers slightly, not the conclusion).

## Sources

Repo facts (paths as installed at HEAD `6deeb7d88`):

- `node_modules/@chakra-ui/react/package.json`, `dist/types/components/date-picker/index.d.ts`
- `node_modules/.pnpm/@ark-ui+react@5.37.2_…/node_modules/@ark-ui/react/package.json`, `dist/components/date-picker/index.d.ts`
- `node_modules/.pnpm/@zag-js+date-picker@1.41.2_…/node_modules/@zag-js/date-picker/package.json`, `dist/date-picker.types.d.mts`, `dist/date-picker.parse.mjs`
- `node_modules/.pnpm/@zag-js+date-utils@1.41.2_…/node_modules/@zag-js/date-utils/package.json`, `dist/types.d.mts`
- `pnpm-lock.yaml` (`@internationalized/date@3.12.2` resolution), `src/shared/date-and-time/dayjs.ts`, `src/toolkit/chakra/date-picker.tsx`, `eslint.config.mjs` (`RESTRICTED_MODULES`)

External:

- Chakra UI v3 DatePicker docs: <https://chakra-ui.com/docs/components/date-picker>
- Ark UI DatePicker docs (API reference, `parseDate` usage in min/max example): <https://ark-ui.com/docs/components/date-picker>
- Zag.js date-picker docs ("built on top of `@internationalized/date`", `parse` helper): <https://zagjs.com/components/react/date-picker>
- `@internationalized/date` docs (design, size claims, `toDate`/`fromDate`/`parseDate`): <https://react-aria.adobe.com/internationalized/date/>
- Ark UI maintainer's RHF integration (strings in state, `parseDate` at boundary): <https://github.com/chakra-ui/ark/discussions/2592>
