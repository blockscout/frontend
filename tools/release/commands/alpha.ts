/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import { createTag, fetchBranch, hasLocalRef, hasRemoteRef, push, REMOTE, remoteBranch, resolveCommit, showFile } from '../git';
import type { ReleaseContent, WorkflowRun } from '../github';
import { createDraftPreRelease, fetchPrLabels, findTagRun, listReleases, updateRelease, watchRun } from '../github';
import { releaseNotes } from '../notes';
import type { GithubRelease } from '../pre-release';
import { findLinePreRelease } from '../pre-release';
import { releaseSourceAt } from '../release-source';
import type { Version } from '../versions';
import { formatLine, parseAlphaTagOrThrow, releaseBranch } from '../versions';
import { parsePhaseArgs } from './args';
import { checkTag } from './check-tag';
import { readNotesTemplate } from './notes';
import type { Step } from './report';
import { logList, logReleaseNotes, runSteps } from './report';

const USAGE = `Usage: pnpm release alpha <vX.Y.Z-alpha.N> [--dry-run]

  tags the head of release/vX.Y once it passes the tag check, re-points the line's pre-release to the tag
  with regenerated notes, pushes the tag and watches the pre-release.yml run it fires`;

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

// A hotfix alpha comes after publish has turned the line's pre-release into the final release.
export function preReleaseStep(preRelease: GithubRelease | undefined, content: ReleaseContent, branch: string): Step {
  if (preRelease === undefined) {
    return {
      title: `Create the draft pre-release ${ content.tagName } on ${ branch } with the notes; the line has none`,
      run: () => console.error(`   ${ createDraftPreRelease(content).url }`),
    };
  }
  return {
    title: `Re-point the pre-release ${ preRelease.tagName } to ${ content.tagName } and replace its notes: ${ preRelease.url }`,
    run: () => updateRelease(preRelease.id, content),
  };
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
  const branch = releaseBranch(version);

  if (!hasRemoteRef(`refs/heads/${ branch }`)) {
    throw new Error(`${ branch } is not on ${ REMOTE }; cut it with "pnpm release prepare ${ formatLine(version) }"`);
  }
  fetchBranch(branch);
  assertTagIsNew(tag);
  const head = resolveCommit(remoteBranch(branch));
  const preRelease = findLinePreRelease(listReleases(), version);
  const notes = releaseNotes(tag, releaseSourceAt(head), readNotesTemplate());
  logReleaseNotes(tag, notes);

  const { failures } = checkTag(tag, {
    readDoc: (docPath) => showFile(head, docPath),
    releaseBodies: () => [ notes.markdown ],
    prLabels: fetchPrLabels,
  });
  if (failures.length > 0) {
    logList(`\nTag ${ tag } fails the tag check, nothing tagged`, failures);
    return 1;
  }

  const content = { tagName: tag, target: head, body: notes.markdown };
  runSteps([
    { title: `Tag ${ branch } at ${ head.slice(0, 10) } as ${ tag }`, run: () => createTag(tag, head) },
    preReleaseStep(preRelease, content, branch),
    { title: `Push ${ tag } to ${ REMOTE }, which fires ${ WORKFLOW }`, run: () => push(`refs/tags/${ tag }`) },
    { title: `Watch the ${ WORKFLOW } run of ${ tag }`, run: () => watchTagRun(tag) },
  ], dryRun);

  if (dryRun) {
    console.log(notes.markdown);
  }
  return 0;
}
