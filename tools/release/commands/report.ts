/* eslint-disable no-console -- CLI subcommand, console output is the interface */
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
