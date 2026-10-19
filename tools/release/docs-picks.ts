import type { Commit } from './release-prs';
import { cherryPickSources, isDocsCommit } from './release-prs';

export function docsCommits(commits: ReadonlyArray<Commit>, tag: string): Array<Commit> {
  return commits.filter((commit) => isDocsCommit(commit, tag));
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
