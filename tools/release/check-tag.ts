import { isReleasedElsewhere } from './release-prs';
import { isVersionLabel } from './versions';

export interface Doc {
  readonly path: string;
  readonly content: string;
}

export interface UpcomingMention {
  readonly path: string;
  readonly line: number;
  readonly text: string;
}

export interface VersionedPr {
  readonly number: number;
  readonly versionLabels: ReadonlyArray<string>;
}

// Undefined when the number is an issue: a `#N` reference can name either.
export type PrLabels = (number: number) => ReadonlyArray<string> | undefined;

const UPCOMING = /\bupcoming\b/i;
// Only links into this repository: a backend PR quoted in the notes has a number of its own.
const PR_LINK = /github\.com\/blockscout\/frontend\/pull\/(\d+)\b/g;
const PR_REFERENCE = /(?<![\w&/])#(\d+)\b/g;

export function findUpcoming(docs: ReadonlyArray<Doc>): Array<UpcomingMention> {
  return docs.flatMap(({ path, content }) => content
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((text, index) => ({ path, line: index + 1, text: text.trim() }))
    .filter(({ text }) => UPCOMING.test(text)));
}

export function bodyPrNumbers(body: string): Array<number> {
  const numbers = [ ...body.matchAll(PR_LINK), ...body.matchAll(PR_REFERENCE) ].map(([ , number ]) => Number(number));
  return [ ...new Set(numbers) ].sort((a, b) => a - b);
}

// The tag's own version label does not count: `release.yml` labels the shipped PRs while this check runs.
export function findVersionedPrs(releaseBody: string, prLabels: PrLabels, tag: string): Array<VersionedPr> {
  return bodyPrNumbers(releaseBody).flatMap((number) => {
    const labels = prLabels(number);
    if (labels === undefined || !isReleasedElsewhere(labels, tag)) {
      return [];
    }
    return [ { number, versionLabels: labels.filter(isVersionLabel) } ];
  });
}
