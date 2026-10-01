/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import type { ReleaseNotes } from '../notes';
import { API_VERSION_HEADING, unreadableApiVersions } from '../notes-sections';
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

export interface Step {
  readonly title: string;
  readonly run: () => void;
}

// A dry run prints the very steps a real run takes, so its output is the plan to review.
export function runSteps(steps: ReadonlyArray<Step>, dryRun: boolean): void {
  console.error('');
  steps.forEach(({ title, run }, index) => {
    console.error(`${ index + 1 }. ${ title }`);
    if (!dryRun) {
      run();
    }
  });
  if (dryRun) {
    console.error('\nDry run: nothing written.');
  }
}
