/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import type { DocsPickPlan } from '../docs-picks';
import { docsCommits, planDocsPicks } from '../docs-picks';
import {
  createTag,
  fetchBranch,
  hasRemoteRef,
  isAncestor,
  listCommits,
  listTags,
  mergeBase,
  push,
  pushBranch,
  REMOTE,
  remoteBranch,
  resolveCommit,
  showFile,
} from '../git';
import { fetchPrLabels, listReleases, publishRelease } from '../github';
import { releaseNotes } from '../notes';
import { findReleasePreRelease } from '../pre-release';
import type { Commit } from '../release-prs';
import { releaseSourceAt } from '../release-source';
import type { Version } from '../versions';
import { latestAlphaTag, parseFinalTagOrThrow, releaseBranch } from '../versions';
import { parsePhaseArgs } from './args';
import { checkTag } from './check-tag';
import { readNotesTemplate } from './notes';
import { checkoutBranch, pickCommit } from './release-branch';
import type { StepRunner } from './report';
import { logList, logReleaseNotes, stepRunner } from './report';
import { assertTagIsNew, watchTagRun } from './tag-run';

const USAGE = `Usage: pnpm release publish <vX.Y.Z> [--dry-run]

  tags the latest alpha of release/vX.Y.Z as vX.Y.Z once it passes the tag check, pushes the tag, turns the
  release's pre-release into the final release marked latest with regenerated notes, cherry-picks the
  release's docs commits onto main and watches the release.yml run`;

const WORKFLOW = 'release.yml';
const MAIN = 'main';

export interface PublishArgs {
  readonly tag: string;
  readonly version: Version;
  readonly dryRun: boolean;
}

export function parsePublishArgs(args: ReadonlyArray<string>): PublishArgs {
  const { target, dryRun } = parsePhaseArgs(args, USAGE);
  return { tag: target, version: parseFinalTagOrThrow(target), dryRun };
}

export function describeCommit({ sha, message }: Commit): string {
  return `${ sha.slice(0, 10) } ${ message.split('\n', 1)[0] }`;
}

export function docsConflictMessage(commit: Commit, files: ReadonlyArray<string>): string {
  return `Cherry-picking the docs commit ${ describeCommit(commit) } onto ${ MAIN } conflicts in ${ files.join(', ') }; ` +
    'resolve the conflicts, run "git cherry-pick --continue" and re-run the command, which resumes after this commit';
}

// The approved alpha is the branch head: anything after it never ran on staging.
export function approvedAlpha(tag: string, branch: string, head: string, alphaTag: string | undefined, alphaSha: string | undefined): string {
  if (alphaTag === undefined) {
    throw new Error(`${ tag } has no alpha tag; cut one with "pnpm release alpha ${ tag }-alpha.1"`);
  }
  if (alphaSha === undefined) {
    throw new Error(`${ alphaTag } is not on ${ branch }; cut another alpha of what is there`);
  }
  if (alphaSha !== head) {
    throw new Error(`${ branch } has moved past ${ alphaTag } (${ alphaSha.slice(0, 10) }) to ${ head.slice(0, 10) }; cut another alpha of what is there`);
  }
  return alphaTag;
}

function logDocsPlan({ picks, skipped }: DocsPickPlan): void {
  logList(`Docs commits to cherry-pick onto ${ MAIN }`, picks.map(describeCommit));
  logList(`Docs commits already on ${ MAIN }`, skipped.map(({ commit, sha }) => `${ describeCommit(commit) }: picked as ${ sha.slice(0, 10) }`));
}

function docsPlanAt(head: string, previousTag: string, tag: string): DocsPickPlan {
  const main = remoteBranch(MAIN);
  const docs = docsCommits(listCommits(previousTag, head), tag);
  return planDocsPicks(docs, listCommits(mergeBase(head, main), main));
}

function returnDocsToMain(steps: StepRunner, plan: DocsPickPlan, dryRun: boolean): void {
  if (plan.picks.length === 0) {
    return;
  }
  checkoutBranch(steps, MAIN, dryRun);
  for (const commit of plan.picks) {
    steps.run(`Cherry-pick ${ describeCommit(commit) } onto ${ MAIN }`, () => pickCommit(commit.sha, (files) => docsConflictMessage(commit, files)));
  }
  steps.run(`Push ${ MAIN } to ${ REMOTE }`, () => pushBranch(MAIN));
}

export function publishCommand(args: ReadonlyArray<string>): number {
  const { tag, version, dryRun } = parsePublishArgs(args);
  const branch = releaseBranch(version);

  if (!hasRemoteRef(`refs/heads/${ branch }`)) {
    throw new Error(`${ branch } is not on ${ REMOTE }; cut it with "pnpm release prepare ${ tag }"`);
  }
  fetchBranch(branch);
  fetchBranch(MAIN);
  assertTagIsNew(tag);
  const head = resolveCommit(remoteBranch(branch));
  const alpha = latestAlphaTag(version, listTags());
  const alphaSha = alpha !== undefined && isAncestor(alpha, head) ? resolveCommit(alpha) : undefined;
  const alphaTag = approvedAlpha(tag, branch, head, alpha, alphaSha);
  const preRelease = findReleasePreRelease(listReleases(), version);

  const notes = releaseNotes(tag, releaseSourceAt(head), readNotesTemplate());
  logReleaseNotes(tag, notes);
  const { failures } = checkTag(tag, { readDoc: (docPath) => showFile(head, docPath), releaseBodies: () => [ notes.markdown ], prLabels: fetchPrLabels });
  if (failures.length > 0) {
    logList(`\nTag ${ tag } fails the tag check, nothing tagged or published`, failures);
    return 1;
  }
  const docsPlan = docsPlanAt(head, notes.previousTag, tag);
  logDocsPlan(docsPlan);

  const steps = stepRunner(dryRun);
  steps.run(`Tag ${ branch } at ${ head.slice(0, 10) } (${ alphaTag }) as ${ tag }`, () => createTag(tag, head));
  steps.run(`Push ${ tag } to ${ REMOTE }`, () => push(`refs/tags/${ tag }`));
  const publishTitle = `Publish the pre-release ${ preRelease.tagName } as the final release ${ tag } marked latest, with the notes regenerated, ` +
    `which fires ${ WORKFLOW }: ${ preRelease.url }`;
  steps.run(publishTitle, () => {
    console.log(publishRelease(preRelease.id, { tagName: tag, target: head, body: notes.markdown }).url);
  });
  returnDocsToMain(steps, docsPlan, dryRun);
  steps.run(`Watch the ${ WORKFLOW } run of ${ tag }`, () => watchTagRun(WORKFLOW, tag, 'release'));
  steps.finish();

  if (dryRun) {
    console.log(notes.markdown);
  }
  return 0;
}
