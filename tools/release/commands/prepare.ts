/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import { prepareCommitMessage } from '../docs-picks';
import {
  createBranchAt,
  fetchBranch,
  hasLocalRef,
  hasRemoteRef,
  isAncestor,
  listCommits,
  listTags,
  mergeBase,
  pushBranch,
  REMOTE,
  remoteBranch,
  resolveCommit,
  switchBranch,
} from '../git';
import { createDraftPreRelease, listReleases } from '../github';
import { releaseNotes } from '../notes';
import { findLinePreRelease } from '../pre-release';
import type { Commit } from '../release-prs';
import { cherryPickSources } from '../release-prs';
import { releaseSourceAt } from '../release-source';
import type { ReleaseBase, Version } from '../versions';
import { formatLine, parseFinalTagOrThrow, releaseBase, releaseBranch } from '../versions';
import { parsePhaseArgs } from './args';
import { readNotesTemplate } from './notes';
import type { BranchView } from './release-branch';
import { assertCheckoutReady, checkoutBranch, checkoutView, refView, updateReleaseBranch } from './release-branch';
import type { StepRunner } from './report';
import { logReleaseNotes, stepRunner } from './report';

const USAGE = `Usage: pnpm release prepare <vX.Y.Z> [--dry-run]

  cuts release/vX.Y.Z from main (Z = 0) or from vX.Y.(Z-1) (a patch), picks the merged "backport" PRs onto
  it, releases "upcoming" in the ENV docs as vX.Y.Z+, pushes the branch and creates the draft pre-release
  vX.Y.Z with its notes`;

export interface PrepareArgs {
  readonly tag: string;
  readonly version: Version;
  readonly dryRun: boolean;
}

export function parsePrepareArgs(args: ReadonlyArray<string>): PrepareArgs {
  const { target, dryRun } = parsePhaseArgs(args, USAGE);
  return { tag: target, version: parseFinalTagOrThrow(target), dryRun };
}

export function baseRef(base: ReleaseBase): string {
  return base.kind === 'main' ? remoteBranch('main') : base.tag;
}

export function cutStepTitle(branch: string, start: string, sha: string, resumed: boolean): string {
  const at = `${ start } (${ sha.slice(0, 10) })`;
  return resumed ?
    `Switch to ${ branch }, cut at ${ at } by an earlier run that stopped; resuming` :
    `Cut ${ branch } at ${ at }`;
}

// Whether the branch is on origin says where a stopped run got to: a push that went through, followed by a
// draft call that did not, leaves the branch there with no pre-release, and the re-run picks up from it.
function releaseState(version: Version, tag: string, branch: string): 'new' | 'pushed' {
  if (hasRemoteRef(`refs/tags/${ tag }`)) {
    throw new Error(`${ tag } is already released`);
  }
  const preRelease = findLinePreRelease(listReleases(), version);
  if (preRelease !== undefined) {
    const open = `${ preRelease.tagName } (${ preRelease.url })`;
    throw new Error(`Line ${ formatLine(version) } has the open pre-release ${ open }; publish it before preparing ${ tag }`);
  }
  return hasRemoteRef(`refs/heads/${ branch }`) ? 'pushed' : 'new';
}

// A minor's cut point on main moves on with every merge, so a resumed branch is recognised by what sits
// past its fork point instead: nothing but picks and the release's docs commit.
export function isPicksOnly(commits: ReadonlyArray<Commit>, tag: string): boolean {
  const docsSubject = prepareCommitMessage(tag);
  return commits.every(({ message }) => cherryPickSources(message).length > 0 || message.split('\n', 1)[0] === docsSubject);
}

interface CutPoint {
  readonly sha: string;
  readonly resumed: boolean;
}

function cutPoint(base: ReleaseBase, branch: string, tag: string): CutPoint {
  const start = baseRef(base);
  if (!hasLocalRef(`refs/heads/${ branch }`)) {
    return { sha: resolveCommit(start), resumed: false };
  }
  const deleteHint = `delete it with "git branch -D ${ branch }" and re-run`;
  if (base.kind === 'tag') {
    if (!isAncestor(start, branch)) {
      throw new Error(`${ branch } exists locally but does not descend from ${ start }; ${ deleteHint }`);
    }
    return { sha: resolveCommit(start), resumed: true };
  }
  const fork = mergeBase(branch, start);
  if (!isPicksOnly(listCommits(fork, branch), tag)) {
    throw new Error(`${ branch } exists locally with commits that are neither picks from main nor the docs commit of ${ tag }; ${ deleteHint }`);
  }
  return { sha: fork, resumed: true };
}

function cutReleaseBranch(steps: StepRunner, base: ReleaseBase, branch: string, tag: string, dryRun: boolean): BranchView {
  const start = baseRef(base);
  const { sha, resumed } = cutPoint(base, branch, tag);
  if (!dryRun) {
    assertCheckoutReady();
  }
  steps.run(cutStepTitle(branch, start, sha, resumed), () => resumed ? switchBranch(branch) : createBranchAt(branch, start));
  return dryRun ? refView(resumed ? branch : start) : checkoutView();
}

export function prepareCommand(args: ReadonlyArray<string>): number {
  const { tag, version, dryRun } = parsePrepareArgs(args);
  const branch = releaseBranch(version);

  fetchBranch('main');
  const state = releaseState(version, tag, branch);
  const base = releaseBase(version, listTags());

  const steps = stepRunner(dryRun);
  const view = state === 'pushed' ? checkoutBranch(steps, branch, dryRun) : cutReleaseBranch(steps, base, branch, tag, dryRun);
  updateReleaseBranch(steps, view, tag);
  const notes = releaseNotes(tag, releaseSourceAt(view.head()), readNotesTemplate());
  logReleaseNotes(tag, notes);

  steps.run(`Push ${ branch } to ${ REMOTE }`, () => pushBranch(branch));
  steps.run(`Create the draft pre-release ${ tag } on ${ branch } with the notes`, () => {
    console.log(createDraftPreRelease({ tagName: tag, target: branch, body: notes.markdown }).url);
  });
  steps.finish();

  if (dryRun) {
    console.log(notes.markdown);
  }
  return 0;
}
