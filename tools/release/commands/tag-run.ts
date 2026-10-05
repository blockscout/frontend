/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import { hasLocalRef, hasRemoteRef, REMOTE } from '../git';
import type { RunEvent, WorkflowRun } from '../github';
import { findTagRun, watchRun } from '../github';

// GitHub queues the run a few seconds after the push; a minute without one means it never fired.
const RUN_POLL_ATTEMPTS = 12;
const RUN_POLL_INTERVAL_MS = 5_000;

export function assertTagIsNew(tag: string): void {
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

function waitForTagRun(workflow: string, tag: string, event: RunEvent): WorkflowRun {
  for (let attempt = 0; attempt < RUN_POLL_ATTEMPTS; attempt++) {
    const run = findTagRun(workflow, tag, event);
    if (run !== undefined) {
      return run;
    }
    sleep(RUN_POLL_INTERVAL_MS);
  }
  throw new Error(`No ${ workflow } run of ${ tag } showed up; look for it in the repository's Actions tab`);
}

export function watchTagRun(workflow: string, tag: string, event: RunEvent): void {
  const run = waitForTagRun(workflow, tag, event);
  console.log(run.url);
  if (!watchRun(run.id)) {
    throw new Error(`The ${ workflow } run of ${ tag } failed: ${ run.url }`);
  }
  console.error(`The ${ workflow } run of ${ tag } passed: ${ run.url }`);
}
