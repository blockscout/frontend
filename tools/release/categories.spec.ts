import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import type { Category } from './categories';
import { CATEGORIES, CATEGORY_LABELS, DEPENDENCIES_LABEL } from './categories';

// The rows of the table whose header is "Section | Labels", the labels read off their backticks.
function parseSectionTable(markdown: string): Array<Category> {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const header = lines.findIndex((line) => /^\|\s*Section\s*\|\s*Labels\s*\|$/.test(line.trim()));
  if (header === -1) {
    throw new Error('No "| Section | Labels |" table in docs/RELEASING.md');
  }
  const rows: Array<Category> = [];
  for (const line of lines.slice(header + 2)) {
    const cells = line.trim().split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length !== 2) {
      break;
    }
    const [ section, labels ] = cells;
    rows.push({ section, labels: [ ...labels.matchAll(/`([^`]+)`/g) ].map(([ , label ]) => label) });
  }
  return rows;
}

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

describe('docs/RELEASING.md', () => {
  const doc = fs.readFileSync(path.resolve(__dirname, '../../docs/RELEASING.md'), 'utf8');

  it('reproduces the mapping, in section order', () => {
    expect(parseSectionTable(doc)).toEqual(CATEGORIES);
  });

  it('names the module as the source of truth', () => {
    expect(doc).toContain('`tools/release/categories.ts`');
  });
});
