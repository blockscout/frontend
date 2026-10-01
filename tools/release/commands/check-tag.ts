/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import fs from 'node:fs';
import path from 'node:path';

import { parseArgs } from '../../cli/flags';
import type { PrLabels } from '../check-tag';
import { findUpcoming, findVersionedPrs } from '../check-tag';
import { repoRoot } from '../git';
import { fetchPrLabels, fetchReleaseBodies } from '../github';
import { parseTagOrThrow } from '../versions';

const USAGE = `Usage: pnpm release check-tag <tag>

  fails when the ENV docs in the checkout still say "upcoming", or when the tag's GitHub release lists a PR
  already shipped by another release`;

const ENV_DOCS = [ 'docs/ENVS.md', 'docs/DEPRECATED_ENVS.md' ];

export interface TagCheckSource {
  readonly readDoc: (path: string) => string;
  readonly releaseBodies: (tag: string) => ReadonlyArray<string>;
  readonly prLabels: PrLabels;
}

export interface TagCheck {
  readonly hasRelease: boolean;
  readonly failures: ReadonlyArray<string>;
}

export function parseCheckTagArgs(args: ReadonlyArray<string>): string {
  const { rest } = parseArgs(args, new Map(), {}, { kind: 'reject', usage: USAGE });
  if (rest.length !== 1) {
    throw new Error(USAGE);
  }
  const [ tag ] = rest;
  parseTagOrThrow(tag);
  return tag;
}

export function checkTag(tag: string, source: TagCheckSource): TagCheck {
  const docs = ENV_DOCS.map((docPath) => ({ path: docPath, content: source.readDoc(docPath) }));
  const bodies = source.releaseBodies(tag);
  const upcoming = findUpcoming(docs)
    .map(({ path: docPath, line, text }) => `${ docPath }:${ line } still says "upcoming": ${ text }`);
  const versioned = findVersionedPrs(bodies.join('\n'), source.prLabels, tag)
    .map(({ number, versionLabels }) => `#${ number } is listed in the notes but already shipped in ${ versionLabels.join(', ') }`);
  return { hasRelease: bodies.length > 0, failures: [ ...upcoming, ...versioned ] };
}

export function checkTagCommand(args: ReadonlyArray<string>): number {
  const tag = parseCheckTagArgs(args);
  const root = repoRoot();
  const { hasRelease, failures } = checkTag(tag, {
    readDoc: (docPath) => fs.readFileSync(path.join(root, docPath), 'utf8'),
    releaseBodies: fetchReleaseBodies,
    prLabels: fetchPrLabels,
  });

  if (!hasRelease) {
    console.error(`No GitHub release for ${ tag }; the notes check is skipped.`);
  }
  if (failures.length === 0) {
    console.log(`Tag ${ tag } passes the tag check.`);
    return 0;
  }

  console.error(`Tag ${ tag } fails the tag check:`);
  for (const failure of failures) {
    console.error(`  - ${ failure }`);
  }
  return 1;
}
