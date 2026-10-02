import { upperFirst } from 'es-toolkit';

import type { Category } from './categories';
import { CATCH_ALL_LABEL, CATEGORIES } from './categories';
import type { FirstContribution } from './notes-sections';
import { compatibilityRows, envChanges, newContributors, parseFirstContributions } from './notes-sections';
import type { ReleasePrs, ReleasePullRequest, ReleaseSource } from './release-prs';
import { releasePrs } from './release-prs';

export interface NotesMeta {
  readonly tag: string;
  readonly previousTag: string;
  readonly template: string;
  readonly firstContributions: ReadonlyArray<FirstContribution>;
}

const CATCH_ALL = CATEGORIES.find(({ labels }) => labels.includes(CATCH_ALL_LABEL)) as Category;

// Walked in section order, not the PR's label order, so a PR labeled with two categories (possible
// before the PR check existed) lands in the same section whatever order GitHub returns its labels in.
export function categoryOf(labels: ReadonlyArray<string>): Category {
  return CATEGORIES.find((category) => category.labels.some((label) => labels.includes(label))) ?? CATCH_ALL;
}

function prLine({ title, author, url }: ReleasePullRequest): string {
  return `- ${ upperFirst(title.trim()) } by @${ author } in ${ url }`;
}

const COMMENT = /<!--[\s\S]*?-->\n?/g;
const BLOCK_START = /^(?:## |---$)/;
const PLACEHOLDER = /\{\{([^{}]+)\}\}/g;

function templateBlocks(template: string): Array<string> {
  const blocks: Array<Array<string>> = [ [] ];
  for (const line of template.replace(/\r\n?/g, '\n').replace(COMMENT, '').split('\n')) {
    if (BLOCK_START.test(line)) {
      blocks.push([]);
    }
    blocks[blocks.length - 1].push(line);
  }
  return blocks.map((lines) => lines.join('\n').trim()).filter((block) => block !== '');
}

function placeholderValue(values: ReadonlyMap<string, string>, key: string): string {
  const value = values.get(key);
  if (value === undefined) {
    throw new Error(`Unknown placeholder {{${ key }}} in the release notes template`);
  }
  return value;
}

function fillBlock(block: string, values: ReadonlyMap<string, string>): string | undefined {
  const keys = [ ...block.matchAll(PLACEHOLDER) ].map(([ , key ]) => key);
  if (keys.some((key) => placeholderValue(values, key) === '')) {
    return undefined;
  }
  return block.replace(PLACEHOLDER, (_, key: string) => placeholderValue(values, key));
}

export function fillTemplate(template: string, values: ReadonlyMap<string, string>): string {
  const blocks = templateBlocks(template)
    .map((block) => fillBlock(block, values))
    .filter((block) => block !== undefined);
  return `${ blocks.join('\n\n') }\n`;
}

export function renderNotes(prs: ReadonlyArray<ReleasePullRequest>, meta: NotesMeta): string {
  const sections = CATEGORIES.map((category): [ string, string ] => [
    `prs:${ category.section }`,
    prs.filter(({ labels }) => categoryOf(labels) === category).map(prLine).join('\n'),
  ]);
  const values = new Map([
    [ 'tag', meta.tag ],
    [ 'previous_tag', meta.previousTag ],
    ...sections,
    [ 'env_changes', envChanges(prs) ],
    [ 'compatibility', compatibilityRows(prs) ],
    [ 'new_contributors', newContributors(prs, meta.firstContributions) ],
  ]);
  return fillTemplate(meta.template, values);
}

export interface NotesSource extends ReleaseSource {
  readonly generatedNotes: (tag: string, previousTag: string) => string;
}

export interface ReleaseNotes extends ReleasePrs {
  readonly markdown: string;
}

export function releaseNotes(tag: string, source: NotesSource, template: string): ReleaseNotes {
  const release = releasePrs(tag, source);
  const firstContributions = parseFirstContributions(source.generatedNotes(tag, release.previousTag));
  return {
    ...release,
    markdown: renderNotes(release.prs, { tag, previousTag: release.previousTag, template, firstContributions }),
  };
}
