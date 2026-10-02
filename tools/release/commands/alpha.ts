/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import { createTag, fetchBranch, hasRemoteRef, push, pushBranch, REMOTE } from '../git';
import { fetchPrLabels, listReleases, updateRelease } from '../github';
import { releaseNotes } from '../notes';
import { findReleasePreRelease } from '../pre-release';
import { releaseSourceAt } from '../release-source';
import type { Version } from '../versions';
import { formatVersion, parseAlphaTagOrThrow, releaseBranch } from '../versions';
import { parsePhaseArgs } from './args';
import { checkTag } from './check-tag';
import { readNotesTemplate } from './notes';
import { checkoutBranch, updateReleaseBranch } from './release-branch';
import { logList, logReleaseNotes, stepRunner } from './report';
import { assertTagIsNew, watchTagRun } from './tag-run';

const USAGE = `Usage: pnpm release alpha <vX.Y.Z-alpha.N> [--dry-run]

  picks the merged "backport" PRs onto release/vX.Y.Z, releases "upcoming" in the ENV docs, tags the head
  once it passes the tag check, re-points the release's pre-release to the tag with regenerated notes,
  pushes the branch and the tag and watches the pre-release.yml run the tag fires`;

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

export function alphaCommand(args: ReadonlyArray<string>): number {
  const { tag, version, dryRun } = parseAlphaArgs(args);
  const releaseTag = formatVersion(version);
  const branch = releaseBranch(version);

  if (!hasRemoteRef(`refs/heads/${ branch }`)) {
    throw new Error(`${ branch } is not on ${ REMOTE }; cut it with "pnpm release prepare ${ releaseTag }"`);
  }
  fetchBranch(branch);
  fetchBranch('main');
  assertTagIsNew(tag);
  const preRelease = findReleasePreRelease(listReleases(), version);

  const steps = stepRunner(dryRun);
  const view = checkoutBranch(steps, branch, dryRun);
  updateReleaseBranch(steps, view, releaseTag);
  const head = view.head();
  const notes = releaseNotes(tag, releaseSourceAt(head), readNotesTemplate());
  logReleaseNotes(tag, notes);

  const { failures } = checkTag(tag, { readDoc: view.readDoc, releaseBodies: () => [ notes.markdown ], prLabels: fetchPrLabels });
  if (failures.length > 0) {
    logList(`\nTag ${ tag } fails the tag check, nothing tagged or pushed`, failures);
    return 1;
  }

  const content = { tagName: tag, target: head, body: notes.markdown };
  steps.run(`Tag ${ branch } at ${ head.slice(0, 10) } as ${ tag }`, () => createTag(tag, head));
  // The branch goes first: the re-point names the head as the release target, which GitHub must already have.
  steps.run(`Push ${ branch } to ${ REMOTE }`, () => pushBranch(branch));
  steps.run(`Re-point the pre-release ${ preRelease.tagName } to ${ tag } and replace its notes: ${ preRelease.url }`, () => {
    updateRelease(preRelease.id, content);
  });
  steps.run(`Push ${ tag } to ${ REMOTE }, which fires ${ WORKFLOW }`, () => push(`refs/tags/${ tag }`));
  steps.run(`Watch the ${ WORKFLOW } run of ${ tag }`, () => watchTagRun(WORKFLOW, tag, 'push'));
  steps.finish();

  if (dryRun) {
    console.log(notes.markdown);
  }
  return 0;
}
