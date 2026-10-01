/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import { createTag, fetchBranch, hasLocalRef, hasRemoteRef, push, pushBranch, REMOTE } from '../git';
import type { WorkflowRun } from '../github';
import { fetchPrLabels, findTagRun, listReleases, updateRelease, watchRun } from '../github';
import { releaseNotes } from '../notes';
import { findReleasePreRelease } from '../pre-release';
import { releaseSourceAt } from '../release-source';
import type { Version } from '../versions';
import { formatVersion, parseAlphaTagOrThrow, releaseBranch } from '../versions';
import { parsePhaseArgs } from './args';
import { checkTag } from './check-tag';
import { readNotesTemplate } from './notes';
import { checkoutReleaseBranch, updateReleaseBranch } from './release-branch';
import { logList, logReleaseNotes, stepRunner } from './report';

const USAGE = `Usage: pnpm release alpha <vX.Y.Z-alpha.N> [--dry-run]

  picks the merged "backport" PRs onto release/vX.Y.Z, releases "upcoming" in the ENV docs, tags the head
  once it passes the tag check, re-points the release's pre-release to the tag with regenerated notes,
  pushes the branch and the tag and watches the pre-release.yml run the tag fires`;

const WORKFLOW = 'pre-release.yml';
// GitHub queues the run a few seconds after the push; a minute without one means it never fired.
const RUN_POLL_ATTEMPTS = 12;
const RUN_POLL_INTERVAL_MS = 5_000;

export interface AlphaArgs {
  readonly tag: string;
  readonly version: Version;
  readonly dryRun: boolean;
}

export function parseAlphaArgs(args: ReadonlyArray<string>): AlphaArgs {
  const { target, dryRun } = parsePhaseArgs(args, USAGE);
  return { tag: target, version: parseAlphaTagOrThrow(target), dryRun };
}

function assertTagIsNew(tag: string): void {
  const ref = `refs/tags/${ tag }`;
  if (hasRemoteRef(ref)) {
    throw new Error(`Tag ${ tag } is already on ${ REMOTE }`);
  }
  if (hasLocalRef(ref)) {
    throw new Error(`Tag ${ tag } exists locally only, likely left by a failed run; delete it with "git tag -d ${ tag }" and re-run`);
  }
}

function sleep(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function waitForTagRun(tag: string): WorkflowRun {
  for (let attempt = 0; attempt < RUN_POLL_ATTEMPTS; attempt++) {
    const run = findTagRun(WORKFLOW, tag);
    if (run !== undefined) {
      return run;
    }
    sleep(RUN_POLL_INTERVAL_MS);
  }
  throw new Error(`No ${ WORKFLOW } run of ${ tag } showed up; look for it in the repository's Actions tab`);
}

function watchTagRun(tag: string): void {
  const run = waitForTagRun(tag);
  console.log(run.url);
  if (!watchRun(run.id)) {
    throw new Error(`The ${ WORKFLOW } run of ${ tag } failed: ${ run.url }`);
  }
  console.error(`The ${ WORKFLOW } run of ${ tag } passed: ${ run.url }`);
}

export function alphaCommand(args: ReadonlyArray<string>): number {
  const { tag, version, dryRun } = parseAlphaArgs(args);
  const releaseTag = formatVersion(version);
  const branch = releaseBranch(version);

  if (!hasRemoteRef(`refs/heads/${ branch }`)) {
    throw new Error(`${ branch } is not on ${ REMOTE }; cut it with "pnpm release prepare ${ releaseTag }"`);
  }
  fetchBranch(branch);
  assertTagIsNew(tag);
  const preRelease = findReleasePreRelease(listReleases(), version);

  const steps = stepRunner(dryRun);
  const view = checkoutReleaseBranch(steps, branch, dryRun);
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
  steps.run(`Re-point the pre-release ${ preRelease.tagName } to ${ tag } and replace its notes: ${ preRelease.url }`, () => {
    updateRelease(preRelease.id, content);
  });
  steps.run(`Push ${ branch } to ${ REMOTE }`, () => pushBranch(branch));
  steps.run(`Push ${ tag } to ${ REMOTE }, which fires ${ WORKFLOW }`, () => push(`refs/tags/${ tag }`));
  steps.run(`Watch the ${ WORKFLOW } run of ${ tag }`, () => watchTagRun(tag));
  steps.finish();

  if (dryRun) {
    console.log(notes.markdown);
  }
  return 0;
}
