/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import { createTag, fetchBranch, hasRemoteRef, push, pushBranch, REMOTE, remoteBranch, resolveCommit } from '../git';
import { fetchPrLabels, listReleases, publishPreRelease } from '../github';
import type { ReleaseNotes } from '../notes';
import { releaseNotes } from '../notes';
import type { GithubRelease } from '../pre-release';
import { findReleasePreRelease } from '../pre-release';
import { releaseSourceAt } from '../release-source';
import type { Version } from '../versions';
import { formatVersion, parseAlphaTagOrThrow, releaseBranch } from '../versions';
import { parsePhaseArgs } from './args';
import { checkTag } from './check-tag';
import { readNotesTemplate } from './notes';
import type { BranchView } from './release-branch';
import { checkoutBranch, updateReleaseBranch } from './release-branch';
import type { StepRunner } from './report';
import { logList, logReleaseNotes, stepRunner } from './report';
import { assertTagIsNew, watchTagRun } from './tag-run';

const USAGE = `Usage: pnpm release alpha <vX.Y.Z-alpha.N> [--dry-run]

  picks the merged "backport" PRs onto release/vX.Y.Z, releases "upcoming" in the ENV docs, tags the head
  once it passes the tag check, publishes the release's pre-release re-pointed to the tag with regenerated
  notes, which creates the tag on GitHub and fires pre-release.yml, pushes the branch and watches the run`;

const WORKFLOW = 'pre-release.yml';

export interface AlphaArgs {
  readonly tag: string;
  readonly version: Version;
  readonly dryRun: boolean;
}

export function parseAlphaArgs(args: ReadonlyArray<string>): AlphaArgs {
  const { target, dryRun } = parsePhaseArgs(args, USAGE);
  return { tag: target, version: parseAlphaTagOrThrow(target), dryRun };
}

// The tag on origin is where an earlier run got to: the publish that creates the tag went through and the
// run stopped at the push or the watch, and the re-run does not tag or publish again. A tag elsewhere
// than the head is not this alpha, and a tag the pre-release does not point at was not made by the publish.
export function alphaState(tag: string, branch: string, taggedSha: string | undefined, head: string, preRelease: GithubRelease): 'new' | 'published' {
  if (taggedSha === undefined) {
    return 'new';
  }
  if (taggedSha !== head) {
    throw new Error(`${ tag } is on ${ REMOTE } at ${ taggedSha.slice(0, 10) }, not at the head of ${ branch } (${ head.slice(0, 10) })`);
  }
  if (preRelease.tagName !== tag) {
    throw new Error(`${ tag } is on ${ REMOTE } at the head of ${ branch }, but the pre-release still points at ${ preRelease.tagName } ` +
      `(${ preRelease.url }); re-point it to ${ tag } by hand, or delete the tag from ${ REMOTE } and re-run`);
  }
  return 'published';
}

interface Alpha {
  readonly tag: string;
  readonly branch: string;
  readonly head: string;
  readonly notes: ReleaseNotes;
  readonly preRelease: GithubRelease;
}

function checkAlpha({ tag, notes }: Alpha, view: BranchView): boolean {
  const { failures } = checkTag(tag, { readDoc: view.readDoc, releaseBodies: () => [ notes.markdown ], prLabels: fetchPrLabels });
  if (failures.length > 0) {
    logList(`\nTag ${ tag } fails the tag check, nothing tagged or pushed`, failures);
  }
  return failures.length === 0;
}

function alphaSteps(steps: StepRunner, { tag, branch, head, notes, preRelease }: Alpha): void {
  const content = { tagName: tag, target: head, body: notes.markdown };
  steps.run(`Tag ${ branch } at ${ head.slice(0, 10) } as ${ tag }`, () => createTag(tag, head));
  // The branch goes first: the publish names the head as the release target, which GitHub must already have.
  steps.run(`Push ${ branch } to ${ REMOTE }`, () => pushBranch(branch));
  const publishTitle = `Publish the pre-release ${ preRelease.tagName } re-pointed to ${ tag } with its notes replaced, ` +
    `which creates the tag and fires ${ WORKFLOW }: ${ preRelease.url }`;
  steps.run(publishTitle, () => {
    console.log(publishPreRelease(preRelease.id, content).url);
  });
  steps.run(`Push ${ tag } to ${ REMOTE }, a no-op once the publish created it`, () => push(`refs/tags/${ tag }`));
}

export function alphaCommand(args: ReadonlyArray<string>): number {
  const { tag, version, dryRun } = parseAlphaArgs(args);
  const releaseTag = formatVersion(version);
  const branch = releaseBranch(version);

  if (!hasRemoteRef(`refs/heads/${ branch }`)) {
    throw new Error(`${ branch } is not on ${ REMOTE }; cut it with "pnpm release prepare ${ releaseTag }"`);
  }
  fetchBranch(branch);
  fetchBranch('main');
  const isTagPushed = hasRemoteRef(`refs/tags/${ tag }`);
  if (!isTagPushed) {
    assertTagIsNew(tag);
  }
  const preRelease = findReleasePreRelease(listReleases(), version);

  const steps = stepRunner(dryRun);
  const view = checkoutBranch(steps, branch, dryRun);
  updateReleaseBranch(steps, view, releaseTag);
  const head = view.head();
  const state = alphaState(tag, branch, isTagPushed ? resolveCommit(tag) : undefined, head, preRelease);
  const notes = releaseNotes(tag, releaseSourceAt(head, resolveCommit(remoteBranch(branch))), readNotesTemplate());
  logReleaseNotes(tag, notes);
  const alpha: Alpha = { tag, branch, head, notes, preRelease };

  if (state === 'new') {
    if (!checkAlpha(alpha, view)) {
      return 1;
    }
    alphaSteps(steps, alpha);
  } else {
    console.error(`${ tag } is already on ${ REMOTE } at the head of ${ branch } and the pre-release points at it; resuming with the ${ WORKFLOW } run.`);
    console.log(preRelease.url);
  }
  steps.run(`Watch the ${ WORKFLOW } run of ${ tag }`, () => watchTagRun(WORKFLOW, tag, 'push'));
  steps.finish();

  if (dryRun) {
    console.log(notes.markdown);
  }
  return 0;
}
