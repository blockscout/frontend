# Research — drag-and-drop library for the column selector

Date: 2026-10-06. Host: React 19.1.4, Next 16.3.5, Chakra 3.36.1 (popover and drawer content is
portalled, `lazyMount` + `unmountOnExit`). Need: reorder ~10 rows of a vertical list inside a Chakra
Popover (desktop) / Drawer (mobile); each row has a checkbox, a label and a handle; touch required; the
new order is reported as an array on drop. Three candidates (dnd-kit counted once, both lines looked at).

Sources: npm registry + the npm downloads API (downloads week 2026-09-28..10-04), GitHub REST API, bundlephobia,
a local esbuild build (minified ESM, react external, gzip) of the imports a sortable list needs.

## Rubric

Weights reflect what can block this ticket: the host container and React 19 first, then touch, a11y
and the animation the mockup draws, then size and effort.

| Criterion (weight) | dnd-kit legacy `core` 6.3.1 + `sortable` 10.0.0 | `@dnd-kit/react` 0.5.0 | pragmatic-dnd 4.0.0 | `@hello-pangea/dnd` 18.0.1 |
| --- | --- | --- | --- | --- |
| Works inside Chakra Popover / Drawer (3) | 4 — rows move via relative transforms; only `DragOverlay` needs a portal, not used | 2 — open #2145 (2026-10-06): Firefox dispatches the post-drop click to `body`, outside-click closes the popover on drop | 4 — native preview, no containing-block issue; unverified in Chakra v3 | 2 — `position: fixed` item breaks under transformed ancestors (#847 shadcn popover, #560); needs `renderClone` |
| React 19 / StrictMode / Next (3) | 3 — peer `>=16.8`, no runtime bug; TS-types friction (#1511); stable `DndContext id` needed for hydration | 2 — open StrictMode bug #2116, fix PR #2117 unmerged | 3 — core has no React dep; drop-indicator "not tested against React 19"; transitive `@atlaskit/tokens` peer warnings reported | 4 — React 19 shipped in 18.0.0, no open bugs |
| Touch in the mobile drawer (2) | 4 — `TouchSensor` delay/tolerance; `touch-action: none` on the handle | 4 — same, per-pointer-type constraints | 2 — native HTML5 long-press, not configurable; Android reliability complaints unanswered (#204) | 4 — long-press, scroll-aware |
| Keyboard + screen-reader built in (2) | 5 | 5 | 2 — no keyboard drag; docs recommend a "move up/down" menu | 5 |
| Sibling-shift animation like the mockup ghost (2) | 5 | 5 | 2 — drop-indicator line only, needs Atlassian design tokens | 5 |
| Bundle, minzipped, sortable-list imports (2) | 4 — 16.6 kB | 2 — 37.8 kB | 5 — ~8.7 kB (+ Compiled CSS) | 2 — 31.6 kB (redux inside) |
| Glue effort (1) | 4 — ~50–70 LOC | 5 — ~35–50 LOC | 2 — ~100–160 LOC + a11y menu | 4 — ~40–60 LOC |
| Maintenance / future-proofing (2) | 2 — no publish since 2024-12-05; author closes legacy issues pointing at the rewrite; 33M downloads/week | 3 — active (last commit 2026-09-12) but 0.x, API churn pre-1.0, fresh 0.5.0 bugs | 4 — weekly releases; read-only mirror, no external PRs; 4.0.0 removed deprecated import paths with no upgrade guide (#243) | 2 — no release in 20 months; bot-only commits |
| Deps / CSP hygiene (1) | 5 — MIT, tslib only | 5 — MIT | 3 — Apache-2.0; indicator pulls `@compiled/react` + `@atlaskit/tokens` | 2 — Apache-2.0; redux + react-redux; runtime `<style>` injection, CSP issue #934 closed not_planned |
| **Weighted total (max 90)** | **68** | 58 | 54 | 58 |

## Decision

`@dnd-kit/core` + `@dnd-kit/sortable` (+ `@dnd-kit/utilities` for the `CSS` helper). The one feature
needed — a vertical sortable with a handle — has been frozen and battle-tested for years, it is the only
candidate with no known blocker in our exact host (portalled Chakra popover and drawer), and the move to
`@dnd-kit/react` is a documented migration (`DndContext → DragDropProvider`, `arrayMove → move`) once
#2116 and #2145 are fixed. Each runner-up has a direct hit on this use case: `@dnd-kit/react` closes the
popover on drop in Firefox, pragmatic has neither keyboard sorting nor row animation, `@hello-pangea/dnd` fights
`position: fixed` inside Chakra's positioner.

## Facts per candidate

### dnd-kit legacy (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`)

- Versions: core 6.3.1 (2024-12-05), sortable 10.0.0 (2024-12-04), utilities 3.2.2 (2023-11-06).
  https://registry.npmjs.org/@dnd-kit/core
- Repo https://github.com/clauderic/dnd-kit — 17.7k stars, 90 open issues, MIT. Legacy issues bulk-closed
  2026-02-16 with "opened against a previous version… major rewrite" (#1511, #1870).
- React 19: peer `react >=16.8.0`; #1511 reports a TS error on `SortableContext` under React 19 types
  (2025-10) with a `.d.ts` augmentation workaround; no runtime bug. StrictMode fixed in 2022 (#788).
- Size: bundlephobia core 14.2 kB gz, sortable 3.7, utilities 1.6; local esbuild of the sortable-list
  import set 48.4 kB min / 16.6 kB gz. https://bundlephobia.com/package/@dnd-kit/core@6.3.1
- Touch: `PointerSensor` / `TouchSensor` with `activationConstraint`; docs: `touch-action: none` on the
  handle is the only reliable way to stop iOS Safari scrolling.
  https://dndkit.com/legacy/api-documentation/sensors/touch
- A11y: `KeyboardSensor` + `sortableKeyboardCoordinates`; live region + off-screen instructions via
  `aria-describedby`, customisable. https://dndkit.com/legacy/guides/accessibility
- Host: `useSortable` positions rows with relative CSS transforms (unaffected by containing blocks).
  `DragOverlay` is `position: fixed` and offsets under a transformed ancestor (#464) — avoided here.
- SSR: `aria-describedby="DndDescribedBy-N"` counter causes a hydration mismatch unless `DndContext`
  gets a stable `id` (secondary source: https://zenn.dev/knmr216/articles/d4e24316f253b8).
- Glue: `DndContext` + sensors + `SortableContext` + per-row `useSortable` (`setNodeRef`, `attributes`,
  `listeners` on the handle, `CSS.Transform.toString`, `transition`) + `onDragEnd → arrayMove`.
  https://dndkit.com/legacy/presets/sortable/overview/

### `@dnd-kit/react` 0.5.0 (rewrite)

- Published 2026-06-11; beta 0.5.1 2026-09-12; peer `react ^18 || ^19`; still 0.x, no 1.0 date
  (discussion #1842 unanswered). https://registry.npmjs.org/@dnd-kit/react
- Open: #2116 StrictMode destroys the provider manager (maintainer confirmed root cause 2026-08-09, fix
  PR #2117 unmerged); #2145 (2026-10-06) Firefox post-drop click goes to `body`, outside-click dismissal
  closes popovers on drop; #1638 scaled ancestor inside `popover` ignored.
- Size: bundlephobia 33.1 kB gz; local esbuild `DragDropProvider` + `useSortable` + `move`
  116.6 kB min / 37.8 kB gz (no tree-shaking gain).
- Feedback plugin animates siblings and promotes the source to the top layer; whether the overlay is
  portalled is undocumented. Migration guide: https://dndkit.com/react/migration

### `@atlaskit/pragmatic-drag-and-drop` 4.0.0 (+ hitbox 3.0.0, react-drop-indicator 4.2.4, live-region 2.1.0)

- Core 4.0.0 2026-09-24; near-weekly releases from the Atlassian monorepo mirror; Apache-2.0; repo does
  not accept PRs; many issues unanswered. 3.0.0 moved entry points, 4.0.0 removed the deprecated shims,
  no upgrade guide (#243). https://github.com/atlassian/pragmatic-drag-and-drop
- React 19: core has no React peer dep; drop-indicator peer `^18.2 || ^19` but "we don't currently test
  against React 19" (#181, 2025-03-26); transitive `@atlaskit/tokens` peer warnings reported.
- Size: local esbuild element adapter + hitbox + reorder 23.8 kB min / 7.4 kB gz; drop-indicator +
  live-region 1.35 kB gz plus a Compiled CSS import; indicator colours come from Atlassian tokens.
- Built on native HTML5 DnD: touch starts after the platform long-press (not configurable), native drag
  preview, no CSS transform on the draggable (Safari). Open touch reports #204, #14, #143, #13.
  https://atlassian.design/components/pragmatic-drag-and-drop/web-platform-design-constraints
- No built-in keyboard drag; guidelines prescribe a menu with move up/down and `announce()`.
  https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines/
- No sibling animation during drag; drop-indicator line + optional post-drop flash only.

### `@hello-pangea/dnd` 18.0.1

- 18.0.1 2025-02-09 (18.0.0 added React 19, PR #883); no release in 20 months; 4.0k stars; commits are
  Renovate bumps; Apache-2.0. https://github.com/hello-pangea/dnd
- Size: bundlephobia 28.8 kB gz; local esbuild 31.6 kB gz; deps redux, react-redux, css-box-model.
- Dragged item is `position: fixed`: breaks under transformed ancestors (#847 shadcn popover, #560, #867);
  fix is `renderClone` + `getContainerForClone` (https://github.com/hello-pangea/dnd/blob/main/docs/guides/reparenting.md).
- Runtime `<style>` injection; CSP issue #934 closed not_planned (a `nonce` prop exists).
- Touch long-press, keyboard and screen-reader support built in; nested scroll containers unsupported.

## Not verified

- Behaviour of any candidate inside Chakra v3 Popover / Drawer specifically (evidence is from Radix /
  shadcn / Mantine / Chakra v2 reports). Whether the Zag/Floating-UI positioner keeps a persistent
  `transform` (which is what makes `position: fixed` children misbehave) was not checked; the chosen
  approach does not depend on it.
- Whether `@dnd-kit/react`'s overlay is portalled to `document.body`.
- Current `@atlaskit/tokens@20` React peer range under pnpm + React 19.1.
