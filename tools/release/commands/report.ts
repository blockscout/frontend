/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import type { ReleaseNotes } from '../notes';
import { API_VERSION_HEADING, unreadableApiVersions } from '../notes-sections';
import type { BackportPullRequest, PickPlan, Skip } from '../picks';
import type { Commit, ReleasePullRequest } from '../release-prs';

// Reports go to stderr, keeping stdout for what a workflow step or a pipe consumes.

export function describePr({ number, title }: ReleasePullRequest): string {
  return `#${ number } ${ title }`;
}

export function logList(heading: string, items: ReadonlyArray<string>): void {
  console.error(`${ heading } (${ items.length }):`);
  for (const item of items) {
    console.error(`  ${ item }`);
  }
}

export function logExclusions(skipped: ReadonlyArray<ReleasePullRequest>, unresolved: ReadonlyArray<Commit>): void {
  logList('Skipped, already in another release', skipped.map((pr) => `${ describePr(pr) } [${ pr.labels.join(', ') }]`));
  logList('Commits without a PR', unresolved.map(({ sha, message }) => `${ sha.slice(0, 10) } ${ message.split('\n', 1)[0] }`));
}

export function logReleaseNotes(tag: string, { previousTag, prs, skipped, unresolved }: ReleaseNotes): void {
  console.error(`Release ${ tag }, compared with ${ previousTag }`);
  logList('PRs in the notes', prs.map(describePr));
  logExclusions(skipped, unresolved);
  const unreadable = unreadableApiVersions(prs);
  if (unreadable.length > 0) {
    logList(`Not in Compatibility, "${ API_VERSION_HEADING }" names no "<service> v<version>"; check by hand`, unreadable.map((number) => `#${ number }`));
  }
}

export function describeBackportPr({ number, title, mergeSha }: BackportPullRequest): string {
  return `#${ number } ${ title } (${ mergeSha.slice(0, 10) })`;
}

function describeSkip(skip: Skip): string {
  switch (skip.reason) {
    case 'released':
      return `${ describeBackportPr(skip.pr) }: already shipped in ${ skip.versionLabels.join(', ') }`;
    case 'before-fork':
      return `${ describeBackportPr(skip.pr) }: merged before the fork, so already on the branch`;
    case 'picked':
      return `${ describeBackportPr(skip.pr) }: picked as ${ skip.sha.slice(0, 10) }`;
  }
}

export function logPickPlan({ picks, skipped }: PickPlan): void {
  logList('"backport" PRs to pick, in main order', picks.map(describeBackportPr));
  logList('"backport" PRs skipped', skipped.map(describeSkip));
}

export interface StepRunner {
  readonly run: (title: string, action: () => void) => void;
  readonly finish: () => void;
}

// A dry run prints the very steps a real run takes, so its output is the plan to review.
export function stepRunner(dryRun: boolean): StepRunner {
  let count = 0;
  console.error('');
  return {
    run: (title, action) => {
      count += 1;
      console.error(`${ count }. ${ title }`);
      if (!dryRun) {
        action();
      }
    },
    finish: () => {
      if (dryRun) {
        console.error('\nDry run: nothing written.');
      }
    },
  };
}
