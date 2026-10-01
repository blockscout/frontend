// The one source of truth for how a PR's category label places it in the release notes. Order is
// section order in the notes; within a section, label order is irrelevant.

export interface Category {
  readonly section: string;
  readonly labels: ReadonlyArray<string>;
}

export const CATEGORIES: ReadonlyArray<Category> = [
  { section: 'New Features', labels: [ 'feature', 'enhancement', 'client feature' ] },
  { section: 'Bug Fixes', labels: [ 'bug' ] },
  { section: 'Performance Improvements', labels: [ 'performance' ] },
  { section: 'Dependencies Updates', labels: [ 'dependencies' ] },
  { section: 'Design Updates', labels: [ 'design' ] },
  { section: 'DX & Tooling', labels: [ 'refactoring', 'tech', 'devops' ] },
  { section: 'Other Changes', labels: [ 'chore' ] },
];

export const CATEGORY_LABELS: ReadonlySet<string> = new Set(CATEGORIES.flatMap(({ labels }) => labels));

// Only for PRs whose sole purpose is a package bump, so it never shares a PR with another category.
export const DEPENDENCIES_LABEL = 'dependencies';

export const RELEASE_LABEL = 'release';

// The section of a PR that carries no category label, e.g. one merged before the PR check existed.
export const CATCH_ALL_LABEL = 'chore';
