/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import { ENV_DOCS, replaceUpcoming } from '../check-tag';
import type { FileChange } from '../git';
import { commitFiles, createBranch, fetchBranch, hasLocalRef, hasRemoteRef, push, REMOTE, remoteBranch, resolveCommit, showFile } from '../git';
import { createDraftPreRelease, listReleases } from '../github';
import { releaseNotes } from '../notes';
import { findLinePreRelease } from '../pre-release';
import { releaseSourceAt } from '../release-source';
import type { Line } from '../versions';
import { formatLine, minorTag, parseLineOrThrow, releaseBranch } from '../versions';
import { parsePhaseArgs } from './args';
import { readNotesTemplate } from './notes';
import type { Step } from './report';
import { logReleaseNotes, runSteps } from './report';

const USAGE = `Usage: pnpm release prepare <vX.Y> [--dry-run]

  cuts release/vX.Y from main with "upcoming" in the ENV docs released as vX.Y.0+, pushes it, and creates
  the line's draft pre-release vX.Y.0 with its notes`;

export interface PrepareArgs {
  readonly line: Line;
  readonly dryRun: boolean;
}

export interface EnvDocUpdate extends FileChange {
  readonly count: number;
}

export function parsePrepareArgs(args: ReadonlyArray<string>): PrepareArgs {
  const { target, dryRun } = parsePhaseArgs(args, USAGE);
  return { line: parseLineOrThrow(target), dryRun };
}

export function prepareCommitMessage(tag: string): string {
  return `chore: prepare release ${ tag }`;
}

export function releaseEnvDocs(readDoc: (docPath: string) => string, tag: string): Array<EnvDocUpdate> {
  return ENV_DOCS
    .map((docPath) => ({ path: docPath, ...replaceUpcoming(readDoc(docPath), tag) }))
    .filter(({ count }) => count > 0);
}

// A docs commit is the only commit made on a release branch alone, so without "upcoming" there is none.
export function branchStep(branch: string, base: string, docs: ReadonlyArray<EnvDocUpdate>, tag: string): Step {
  const from = `${ remoteBranch('main') } (${ base.slice(0, 10) })`;
  if (docs.length === 0) {
    return { title: `Cut ${ branch } at ${ from }; the ENV docs say "upcoming" nowhere, so no docs commit`, run: () => createBranch(branch, base) };
  }

  const message = prepareCommitMessage(tag);
  const replaced = docs.map(({ path: docPath, count }) => `${ docPath } (${ count })`).join(', ');
  return {
    title: `Cut ${ branch } at ${ from } plus the commit "${ message }", "upcoming" → ${ tag }+ in ${ replaced }`,
    run: () => createBranch(branch, commitFiles(base, docs, message)),
  };
}

function assertLineIsNew(line: Line, branch: string): void {
  const ref = `refs/heads/${ branch }`;
  if (hasLocalRef(ref) || hasRemoteRef(ref)) {
    throw new Error(`${ branch } already exists, locally or on ${ REMOTE }; a line is prepared once`);
  }
  const preRelease = findLinePreRelease(listReleases(), line);
  if (preRelease !== undefined) {
    throw new Error(`Line ${ formatLine(line) } already has the pre-release ${ preRelease.tagName }: ${ preRelease.url }`);
  }
}

export function prepareCommand(args: ReadonlyArray<string>): number {
  const { line, dryRun } = parsePrepareArgs(args);
  const tag = minorTag(line);
  const branch = releaseBranch(line);

  fetchBranch('main');
  assertLineIsNew(line, branch);
  const base = resolveCommit(remoteBranch('main'));
  const docs = releaseEnvDocs((docPath) => showFile(base, docPath), tag);
  const notes = releaseNotes(tag, releaseSourceAt(base), readNotesTemplate());
  logReleaseNotes(tag, notes);

  runSteps([
    branchStep(branch, base, docs, tag),
    { title: `Push ${ branch } to ${ REMOTE }`, run: () => push(`refs/heads/${ branch }`) },
    {
      title: `Create the draft pre-release ${ tag } on ${ branch } with the notes`,
      run: () => console.log(createDraftPreRelease({ tagName: tag, target: branch, body: notes.markdown }).url),
    },
  ], dryRun);

  if (dryRun) {
    console.log(notes.markdown);
  }
  return 0;
}
