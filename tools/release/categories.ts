export interface Category {
  readonly section: string;
  readonly labels: ReadonlyArray<string>;
}

// Order is section order in the release notes; within a section, label order is irrelevant.
export const CATEGORIES: ReadonlyArray<Category> = [
  { section: 'New Features', labels: [ 'feature', 'client feature' ] },
  { section: 'Enhancements', labels: [ 'enhancement' ] },
  { section: 'Bug Fixes', labels: [ 'bug' ] },
  { section: 'Design Updates', labels: [ 'design' ] },
  { section: 'Performance Improvements', labels: [ 'performance' ] },
  { section: 'Dependencies Updates', labels: [ 'dependencies' ] },
  { section: 'DX & Tooling', labels: [ 'refactoring', 'tech', 'devops' ] },
  { section: 'Other Changes', labels: [ 'chore' ] },
];

export const CATEGORY_LABELS: ReadonlySet<string> = new Set(CATEGORIES.flatMap(({ labels }) => labels));

// Only for PRs whose sole purpose is a package bump, so it never shares a PR with another category.
export const DEPENDENCIES_LABEL = 'dependencies';

export const RELEASE_LABEL = 'release';

// The section of a PR that carries no category label, e.g. one merged before the PR check existed.
export const CATCH_ALL_LABEL = 'chore';
