import type { Commit } from './release-prs';
import { cherryPickSources } from './release-prs';
import { isVersionLabel } from './versions';

export interface BackportPullRequest {
  readonly number: number;
  readonly title: string;
  readonly labels: ReadonlyArray<string>;
  readonly mergeSha: string;
}

// Both sides of the fork point: what main has beyond it, oldest first, and what the branch has.
export interface BranchState {
  readonly mainCommits: ReadonlyArray<string>;
  readonly branchCommits: ReadonlyArray<Commit>;
}

export type Skip =
  { readonly pr: BackportPullRequest; readonly reason: 'released'; readonly versionLabels: ReadonlyArray<string> } |
  { readonly pr: BackportPullRequest; readonly reason: 'before-fork' } |
  { readonly pr: BackportPullRequest; readonly reason: 'picked'; readonly sha: string };

export interface PickPlan {
  readonly picks: ReadonlyArray<BackportPullRequest>;
  readonly skipped: ReadonlyArray<Skip>;
}

// A hand-made trailer may abbreviate the source, so the full sha is matched by prefix.
function pickOf(mergeSha: string, branchCommits: ReadonlyArray<Commit>): Commit | undefined {
  return branchCommits.find(({ message }) => cherryPickSources(message).some((source) => mergeSha.startsWith(source)));
}

function skipOf(pr: BackportPullRequest, branch: BranchState): Skip | undefined {
  const versionLabels = pr.labels.filter(isVersionLabel);
  if (versionLabels.length > 0) {
    return { pr, reason: 'released', versionLabels };
  }
  if (!branch.mainCommits.includes(pr.mergeSha)) {
    return { pr, reason: 'before-fork' };
  }
  const pick = pickOf(pr.mergeSha, branch.branchCommits);
  return pick === undefined ? undefined : { pr, reason: 'picked', sha: pick.sha };
}

// Picks go in main order, so a later PR lands on top of an earlier one it may depend on. Planning again
// after the picks finds each one by its trailer and plans nothing, which is what lets a stopped run resume.
export function planPicks(prs: ReadonlyArray<BackportPullRequest>, branch: BranchState): PickPlan {
  const skipped: Array<Skip> = [];
  const picks: Array<BackportPullRequest> = [];
  for (const pr of prs) {
    const skip = skipOf(pr, branch);
    if (skip === undefined) {
      picks.push(pr);
    } else {
      skipped.push(skip);
    }
  }
  picks.sort((a, b) => branch.mainCommits.indexOf(a.mergeSha) - branch.mainCommits.indexOf(b.mergeSha));
  return { picks, skipped };
}
