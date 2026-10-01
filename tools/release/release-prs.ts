import { isVersionLabel, previousTag, versionLabel } from './versions';

export interface Commit {
  readonly sha: string;
  readonly message: string;
}

export interface PrResolver {
  readonly commitMessage: (sha: string) => string;
  readonly associatedPr: (sha: string) => number | undefined;
}

export interface Issue {
  readonly number: number;
  readonly labels: ReadonlyArray<string>;
}

export interface ReleasePullRequest {
  readonly number: number;
  readonly title: string;
  readonly labels: ReadonlyArray<string>;
  readonly closingIssues: ReadonlyArray<Issue>;
}

export interface ReleaseSource extends PrResolver {
  readonly tags: () => ReadonlyArray<string>;
  readonly commits: (from: string, to: string) => ReadonlyArray<Commit>;
  readonly pullRequest: (number: number) => ReleasePullRequest;
}

export interface ReleasePrs {
  readonly previousTag: string;
  readonly prs: ReadonlyArray<ReleasePullRequest>;
  readonly skipped: ReadonlyArray<ReleasePullRequest>;
  readonly unresolved: ReadonlyArray<Commit>;
}

const CHERRY_PICK_TRAILER = /^\(cherry picked from commit ([0-9a-f]{7,40})\)$/m;
const PR_REFERENCE = /\(#(\d+)\)/g;

function subjectPr(message: string): number | undefined {
  const [ subject ] = message.split('\n', 1);
  const reference = [ ...subject.matchAll(PR_REFERENCE) ].at(-1);
  return reference === undefined ? undefined : Number(reference[1]);
}

// A picked commit is resolved through its source on `main`, never its own subject, which the operator
// may have edited while resolving a conflict.
export function resolvePr(commit: Commit, resolver: PrResolver): number | undefined {
  const source = CHERRY_PICK_TRAILER.exec(commit.message)?.[1];
  if (source !== undefined) {
    return resolvePr({ sha: source, message: resolver.commitMessage(source) }, resolver);
  }
  return subjectPr(commit.message) ?? resolver.associatedPr(commit.sha);
}

// The tag's own version label does not count, so a re-run after a partial failure still sees the PRs
// and issues it labeled the first time.
export function isReleasedElsewhere(labels: ReadonlyArray<string>, tag: string): boolean {
  const ownLabel = versionLabel(tag);
  return labels.some((label) => isVersionLabel(label) && label !== ownLabel);
}

export function releasePrs(tag: string, source: ReleaseSource): ReleasePrs {
  const previous = previousTag(tag, source.tags());
  const numbers = new Set<number>();
  const unresolved: Array<Commit> = [];

  for (const commit of source.commits(previous, tag)) {
    const number = resolvePr(commit, source);
    if (number === undefined) {
      unresolved.push(commit);
    } else {
      numbers.add(number);
    }
  }

  const pullRequests = [ ...numbers ].map(source.pullRequest);
  return {
    previousTag: previous,
    prs: pullRequests.filter(({ labels }) => !isReleasedElsewhere(labels, tag)),
    skipped: pullRequests.filter(({ labels }) => isReleasedElsewhere(labels, tag)),
    unresolved,
  };
}

export function issuesToLabel(prs: ReadonlyArray<ReleasePullRequest>, tag: string): Array<number> {
  const numbers = prs
    .flatMap(({ closingIssues }) => closingIssues)
    .filter(({ labels }) => !isReleasedElsewhere(labels, tag))
    .map(({ number }) => number);
  return [ ...new Set(numbers) ].sort((a, b) => a - b);
}
