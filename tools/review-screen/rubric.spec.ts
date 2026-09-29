import { existsSync } from 'node:fs';
import { matchesGlob, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import type { Rule } from './rubric';
import { MAX_RULES, MIN_RULES, RULES } from './rubric';

const REPO_ROOT = resolve(import.meta.dirname, '../..');

const REPO_PATH_SHAPES = [
  'src/slices/tx/components/TxDetails.tsx',
  'src/api/utils/build-url.ts',
  'tools/review-screen/rubric.ts',
  '.agents/rules/code-quality.md',
  'src/api/CONTEXT.md',
  'docs/ENVS.md',
  'tools/cli/README.md',
];

const MAX_ENTRY_LENGTH = 160;

describe('rubric', () => {
  it('has between 8 and 10 rules', () => {
    expect(MIN_RULES).toBe(8);
    expect(MAX_RULES).toBe(10);
    expect(RULES.length).toBeGreaterThanOrEqual(MIN_RULES);
    expect(RULES.length).toBeLessThanOrEqual(MAX_RULES);
  });

  it('gives every rule a unique id', () => {
    const ids = RULES.map((rule) => rule.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  describe.each(RULES.map((rule) => [ rule.id, rule ] as const))('%s', (_id: string, rule: Rule) => {
    it('has a kebab-case id', () => {
      expect(rule.id).toMatch(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/);
    });

    it('cites a rule file that exists in the repo', () => {
      expect(existsSync(resolve(REPO_ROOT, rule.cites))).toBe(true);
    });

    it('uses a valid glob that matches a repo-relative path', () => {
      expect(() => matchesGlob('a', rule.glob)).not.toThrow();
      expect(REPO_PATH_SHAPES.filter((path) => matchesGlob(path, rule.glob))).not.toEqual([]);
    });

    it('asks a single affirmative yes/no question', () => {
      expect(rule.question).toMatch(/^Does .+\?$/);
      expect(rule.question).not.toMatch(/\bnot\b/);
    });

    it('keeps examples and not_for as arrays of short strings', () => {
      for (const list of [ rule.examples, rule.not_for ]) {
        expect(Array.isArray(list)).toBe(true);
        for (const entry of list as Array<unknown>) {
          expect(typeof entry).toBe('string');
          expect((entry as string).length).toBeLessThanOrEqual(MAX_ENTRY_LENGTH);
        }
      }
    });
  });
});
