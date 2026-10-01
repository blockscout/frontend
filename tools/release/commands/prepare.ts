/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import { createBranchAt, fetchBranch, hasLocalRef, hasRemoteRef, isAncestor, listTags, pushBranch, REMOTE, remoteBranch, switchBranch } from '../git';
import { createDraftPreRelease, listReleases } from '../github';
import { releaseNotes } from '../notes';
import { findLinePreRelease } from '../pre-release';
import { releaseSourceAt } from '../release-source';
import type { ReleaseBase, Version } from '../versions';
import { formatLine, parseFinalTagOrThrow, releaseBase, releaseBranch } from '../versions';
import { parsePhaseArgs } from './args';
import { readNotesTemplate } from './notes';
import type { BranchView } from './release-branch';
import { assertCheckoutReady, checkoutView, refView, updateReleaseBranch } from './release-branch';
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

function assertReleaseIsNew(version: Version, tag: string, branch: string): void {
  if (hasRemoteRef(`refs/tags/${ tag }`)) {
    throw new Error(`${ tag } is already released`);
  }
  if (hasRemoteRef(`refs/heads/${ branch }`)) {
    throw new Error(`${ branch } is already on ${ REMOTE }; a release is prepared once`);
  }
  const preRelease = findLinePreRelease(listReleases(), version);
  if (preRelease !== undefined) {
    const open = `${ preRelease.tagName } (${ preRelease.url })`;
    throw new Error(`Line ${ formatLine(version) } has the open pre-release ${ open }; publish it before preparing ${ tag }`);
  }
}

// A local branch is a run that stopped at a pick; it is resumed as long as it was cut where this run would cut.
function assertResumable(branch: string, start: string): boolean {
  const resumed = hasLocalRef(`refs/heads/${ branch }`);
  if (resumed && !isAncestor(start, branch)) {
    throw new Error(`${ branch } exists locally but does not descend from ${ start }; delete it with "git branch -D ${ branch }" and re-run`);
  }
  return resumed;
}

function cutReleaseBranch(steps: StepRunner, branch: string, start: string, dryRun: boolean): BranchView {
  const resumed = assertResumable(branch, start);
  const view = refView(resumed ? branch : start);
  if (!dryRun) {
    assertCheckoutReady();
  }
  steps.run(cutStepTitle(branch, start, view.head(), resumed), () => resumed ? switchBranch(branch) : createBranchAt(branch, start));
  return dryRun ? view : checkoutView();
}

export function prepareCommand(args: ReadonlyArray<string>): number {
  const { tag, version, dryRun } = parsePrepareArgs(args);
  const branch = releaseBranch(version);

  fetchBranch('main');
  assertReleaseIsNew(version, tag, branch);
  const start = baseRef(releaseBase(version, listTags()));

  const steps = stepRunner(dryRun);
  const view = cutReleaseBranch(steps, branch, start, dryRun);
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
