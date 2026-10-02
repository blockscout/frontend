import type { Commit } from './release-prs';
import { cherryPickSources } from './release-prs';

export function prepareCommitMessage(tag: string): string {
  return `chore: prepare release ${ tag }`;
}

// The docs commits of a release are the only commits made on its branch rather than picked from main.
export function docsCommits(commits: ReadonlyArray<Commit>, tag: string): Array<Commit> {
  const subject = prepareCommitMessage(tag);
  return commits.filter(({ message }) => message.split('\n', 1)[0] === subject);
}

export interface DocsSkip {
  readonly commit: Commit;
  readonly sha: string;
}

export interface DocsPickPlan {
  readonly picks: ReadonlyArray<Commit>;
  readonly skipped: ReadonlyArray<DocsSkip>;
}

function pickOf(sha: string, mainCommits: ReadonlyArray<Commit>): Commit | undefined {
  return mainCommits.find(({ message }) => cherryPickSources(message).some((source) => sha.startsWith(source)));
}

// A docs commit already on main by its trailer is skipped, so a run stopped by a conflict or a failed push
// resumes with the ones left.
export function planDocsPicks(docs: ReadonlyArray<Commit>, mainCommits: ReadonlyArray<Commit>): DocsPickPlan {
  const picks: Array<Commit> = [];
  const skipped: Array<DocsSkip> = [];
  for (const commit of docs) {
    const pick = pickOf(commit.sha, mainCommits);
    if (pick === undefined) {
      picks.push(commit);
    } else {
      skipped.push({ commit, sha: pick.sha });
    }
  }
  return { picks, skipped };
}
