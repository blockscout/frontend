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
import type { ReleaseNotes } from '../notes';
import { releaseNotes } from '../notes';
import { findReleasePreRelease } from '../pre-release';
import type { Commit } from '../release-prs';
import { releaseSourceAt } from '../release-source';
import type { Version } from '../versions';
import { latestAlphaTag, parseFinalTagOrThrow, releaseBranch } from '../versions';
import { parsePhaseArgs } from './args';
import { checkTag } from './check-tag';
import { readNotesTemplate } from './notes';
import type { LocalBranchState } from './release-branch';
import { checkoutBranch, checkoutPlan, pickCommit, readLocalBranchState } from './release-branch';
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

// The tag on origin is where an earlier run got to: it published and stopped at the docs picks or the main
// push, and the re-run does not tag or publish again. A tag elsewhere than the head is not this release.
export function publishState(tag: string, branch: string, taggedSha: string | undefined, head: string): 'new' | 'published' {
  if (taggedSha === undefined) {
    return 'new';
  }
  if (taggedSha !== head) {
    throw new Error(`${ tag } is on ${ REMOTE } at ${ taggedSha.slice(0, 10) }, not at the head of ${ branch } (${ head.slice(0, 10) })`);
  }
  return 'published';
}

function logDocsPlan({ picks, skipped }: DocsPickPlan): void {
  logList(`Docs commits to cherry-pick onto ${ MAIN }`, picks.map(describeCommit));
  logList(`Docs commits already on ${ MAIN }`, skipped.map(({ commit, sha }) => `${ describeCommit(commit) }: picked as ${ sha.slice(0, 10) }`));
}

// Planned against the main the checkout will use: after the operator continued a stopped pick, the local main
// is ahead of origin with that commit, which its trailer then skips rather than picks onto itself again.
function docsPlanAt(head: string, previousTag: string, tag: string, main: string): DocsPickPlan {
  const docs = docsCommits(listCommits(previousTag, head), tag);
  return planDocsPicks(docs, listCommits(mergeBase(head, main), main));
}

// A local main ahead of origin holds a continued pick that is not pushed yet, so it goes even with nothing
// left to pick.
export function needsMainPush({ picks }: DocsPickPlan, mainState: LocalBranchState): boolean {
  return picks.length > 0 || mainState === 'ahead';
}

function returnDocsToMain(steps: StepRunner, plan: DocsPickPlan, mainState: LocalBranchState, dryRun: boolean): void {
  if (!needsMainPush(plan, mainState)) {
    return;
  }
  checkoutBranch(steps, MAIN, dryRun);
  for (const commit of plan.picks) {
    steps.run(`Cherry-pick ${ describeCommit(commit) } onto ${ MAIN }`, () => pickCommit(commit.sha, (files) => docsConflictMessage(commit, files)));
  }
  steps.run(`Push ${ MAIN } to ${ REMOTE }`, () => pushBranch(MAIN));
}

interface Release {
  readonly tag: string;
  readonly version: Version;
  readonly branch: string;
  readonly head: string;
  readonly notes: ReleaseNotes;
}

function checkRelease({ tag, head, notes }: Release): boolean {
  const { failures } = checkTag(tag, { readDoc: (docPath) => showFile(head, docPath), releaseBodies: () => [ notes.markdown ], prLabels: fetchPrLabels });
  if (failures.length > 0) {
    logList(`\nTag ${ tag } fails the tag check, nothing tagged or published`, failures);
  }
  return failures.length === 0;
}

function releaseSteps(steps: StepRunner, { tag, version, branch, head, notes }: Release): void {
  const alpha = latestAlphaTag(version, listTags());
  const alphaSha = alpha !== undefined && isAncestor(alpha, head) ? resolveCommit(alpha) : undefined;
  const alphaTag = approvedAlpha(tag, branch, head, alpha, alphaSha);
  const preRelease = findReleasePreRelease(listReleases(), version);

  steps.run(`Tag ${ branch } at ${ head.slice(0, 10) } (${ alphaTag }) as ${ tag }`, () => createTag(tag, head));
  steps.run(`Push ${ tag } to ${ REMOTE }`, () => push(`refs/tags/${ tag }`));
  const publishTitle = `Publish the pre-release ${ preRelease.tagName } as the final release ${ tag } marked latest, with the notes regenerated, ` +
    `which fires ${ WORKFLOW }: ${ preRelease.url }`;
  steps.run(publishTitle, () => {
    console.log(publishRelease(preRelease.id, { tagName: tag, target: head, body: notes.markdown }).url);
  });
}

export function publishCommand(args: ReadonlyArray<string>): number {
  const { tag, version, dryRun } = parsePublishArgs(args);
  const branch = releaseBranch(version);

  if (!hasRemoteRef(`refs/heads/${ branch }`)) {
    throw new Error(`${ branch } is not on ${ REMOTE }; cut it with "pnpm release prepare ${ tag }"`);
  }
  fetchBranch(branch);
  fetchBranch(MAIN);
  const head = resolveCommit(remoteBranch(branch));
  const state = publishState(tag, branch, hasRemoteRef(`refs/tags/${ tag }`) ? resolveCommit(tag) : undefined, head);
  if (state === 'new') {
    assertTagIsNew(tag);
  }

  const notes = releaseNotes(tag, releaseSourceAt(head), readNotesTemplate());
  logReleaseNotes(tag, notes);
  const release: Release = { tag, version, branch, head, notes };
  if (state === 'new' && !checkRelease(release)) {
    return 1;
  }
  const mainState = readLocalBranchState(MAIN);
  const docsPlan = docsPlanAt(head, notes.previousTag, tag, checkoutPlan(MAIN, mainState).ref);
  logDocsPlan(docsPlan);

  const steps = stepRunner(dryRun);
  if (state === 'new') {
    releaseSteps(steps, release);
  } else {
    console.error(`${ tag } is already on ${ REMOTE } at the head of ${ branch } and published; resuming with the docs commits.`);
  }
  returnDocsToMain(steps, docsPlan, mainState, dryRun);
  steps.run(`Watch the ${ WORKFLOW } run of ${ tag }`, () => watchTagRun(WORKFLOW, tag, 'release'));
  steps.finish();

  if (dryRun) {
    console.log(notes.markdown);
  }
  return 0;
}
