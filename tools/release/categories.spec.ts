import { describe, expect, it } from 'vitest';

import { CATEGORIES, CATEGORY_LABELS, DEPENDENCIES_LABEL } from './categories';

describe('CATEGORIES', () => {
  it('lists the release-notes sections in order, each with its labels', () => {
    expect(CATEGORIES).toEqual([
      { section: 'New Features', labels: [ 'feature', 'enhancement', 'client feature' ] },
      { section: 'Bug Fixes', labels: [ 'bug' ] },
      { section: 'Performance Improvements', labels: [ 'performance' ] },
      { section: 'Dependencies Updates', labels: [ 'dependencies' ] },
      { section: 'Design Updates', labels: [ 'design' ] },
      { section: 'DX & Tooling', labels: [ 'refactoring', 'tech', 'devops' ] },
      { section: 'Other Changes', labels: [ 'chore' ] },
    ]);
  });

  it('maps every label to exactly one section', () => {
    const labels = CATEGORIES.flatMap(({ labels }) => labels);
    expect(new Set(labels).size).toBe(labels.length);
  });
});

describe('CATEGORY_LABELS', () => {
  it('is every label of the mapping and nothing else', () => {
    expect([ ...CATEGORY_LABELS ].sort()).toEqual([
      'bug', 'chore', 'client feature', 'dependencies', 'design', 'devops', 'enhancement', 'feature', 'performance', 'refactoring', 'tech',
    ]);
  });

  it('includes the dependencies label', () => {
    expect(CATEGORY_LABELS.has(DEPENDENCIES_LABEL)).toBe(true);
  });
});
