/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { ENV_DOCS, replaceUpcoming } from '../check-tag';
import { prepareCommitMessage } from '../docs-picks';
import type { FileChange } from '../git';
import {
  cherryPick,
  fastForward,
  hasCherryPickInProgress,
  hasCleanWorkingTree,
  hasLocalRef,
  isAncestor,
  listCommits,
  listShas,
  mergeBase,
  REMOTE,
  remoteBranch,
  repoRoot,
  resolveCommit,
  showFile,
  switchBranch,
  trackRemoteBranch,
  unmergedFiles,
  writeAndCommit,
} from '../git';
import { listBackportPrs } from '../github';
import type { BackportPullRequest, PickPlan } from '../picks';
import { planPicks } from '../picks';
import type { StepRunner } from './report';
import { describeBackportPr, logPickPlan } from './report';

// Where a command reads the branch from: a ref in a dry run, the checkout in a real one, so the ENV docs
// a real run sees are the ones the picks just changed.
export interface BranchView {
  readonly ref: string;
  readonly head: () => string;
  readonly readDoc: (docPath: string) => string;
}

export function refView(ref: string): BranchView {
  return { ref, head: () => resolveCommit(ref), readDoc: (docPath) => showFile(ref, docPath) };
}

export function checkoutView(): BranchView {
  return { ref: 'HEAD', head: () => resolveCommit('HEAD'), readDoc: (docPath) => fs.readFileSync(path.join(repoRoot(), docPath), 'utf8') };
}

export type LocalBranchState = 'missing' | 'current' | 'ahead' | 'behind' | 'diverged';

export interface BranchRelation {
  readonly remoteInLocal: boolean;
  readonly localInRemote: boolean;
}

export function localBranchState(hasLocal: boolean, { remoteInLocal, localInRemote }: BranchRelation): LocalBranchState {
  if (!hasLocal) {
    return 'missing';
  }
  if (remoteInLocal) {
    return localInRemote ? 'current' : 'ahead';
  }
  return localInRemote ? 'behind' : 'diverged';
}

export interface CheckoutPlan {
  readonly title: string;
  readonly ref: string;
  readonly run: () => void;
}

// The local branch counts when it carries everything origin has: it is ahead after the operator continued a
// stopped pick, and that work is what the command resumes.
export function checkoutPlan(branch: string, state: LocalBranchState): CheckoutPlan {
  const remote = remoteBranch(branch);
  switch (state) {
    case 'missing':
      return { title: `Check out ${ branch } from ${ REMOTE }`, ref: remote, run: () => trackRemoteBranch(branch) };
    case 'current':
      return { title: `Switch to ${ branch }, at the head of ${ remote }`, ref: branch, run: () => switchBranch(branch) };
    case 'ahead':
      return { title: `Switch to ${ branch }, which is ahead of ${ remote } with commits not pushed yet`, ref: branch, run: () => switchBranch(branch) };
    case 'behind':
      return {
        title: `Switch to ${ branch } and fast-forward it to ${ remote }`,
        ref: remote,
        run: () => {
          switchBranch(branch);
          fastForward(remote);
        },
      };
    case 'diverged':
      throw new Error(`${ branch } has diverged from ${ remote }; reconcile them by hand and re-run`);
  }
}

export function readLocalBranchState(branch: string): LocalBranchState {
  const remote = remoteBranch(branch);
  if (!hasLocalRef(`refs/heads/${ branch }`)) {
    return 'missing';
  }
  return localBranchState(true, { remoteInLocal: isAncestor(remote, branch), localInRemote: isAncestor(branch, remote) });
}

export function assertCheckoutReady(): void {
  if (hasCherryPickInProgress()) {
    throw new Error('A cherry-pick is in progress; resolve it, run "git cherry-pick --continue" (or --abort) and re-run');
  }
  if (!hasCleanWorkingTree()) {
    throw new Error('The working tree has uncommitted changes; commit or discard them and re-run');
  }
}

// Switches the operator's checkout to the branch in a real run; a dry run only picks the ref to read.
export function checkoutBranch(steps: StepRunner, branch: string, dryRun: boolean): BranchView {
  const plan = checkoutPlan(branch, readLocalBranchState(branch));
  if (!dryRun) {
    assertCheckoutReady();
  }
  steps.run(plan.title, plan.run);
  return dryRun ? refView(plan.ref) : checkoutView();
}

export function pickPlanAt(head: string): PickPlan {
  const main = remoteBranch('main');
  const fork = mergeBase(head, main);
  return planPicks(listBackportPrs(), { mainCommits: listShas(fork, main), branchCommits: listCommits(fork, head) });
}

export function pickConflictMessage(pr: BackportPullRequest, files: ReadonlyArray<string>): string {
  return `Picking ${ describeBackportPr(pr) } conflicts in ${ files.join(', ') }; resolve the conflicts, ` +
    'run "git cherry-pick --continue" and re-run the command, which resumes after this pick';
}

// A conflict is the operator's to resolve: the cherry-pick stays in progress and the error says how to go on.
export function pickCommit(sha: string, conflictMessage: (files: ReadonlyArray<string>) => string): void {
  try {
    cherryPick(sha);
  } catch (error) {
    const files = unmergedFiles();
    throw files.length === 0 ? error : new Error(conflictMessage(files));
  }
}

export interface EnvDocUpdate extends FileChange {
  readonly count: number;
}

export function releaseEnvDocs(readDoc: (docPath: string) => string, tag: string): Array<EnvDocUpdate> {
  return ENV_DOCS
    .map((docPath) => ({ path: docPath, ...replaceUpcoming(readDoc(docPath), tag) }))
    .filter(({ count }) => count > 0);
}

export function describeEnvDocs(docs: ReadonlyArray<EnvDocUpdate>): string {
  return docs.length === 0 ? 'none' : docs.map(({ path: docPath, count }) => `${ docPath } (${ count })`).join(', ');
}

// Titled with what the docs say before the picks, since a picked PR may bring "upcoming" of its own.
export function envDocsStepTitle(docs: ReadonlyArray<EnvDocUpdate>, tag: string, ref: string): string {
  return `Commit "${ prepareCommitMessage(tag) }" with "upcoming" → ${ tag }+ in the ENV docs, when any is left after the picks; ` +
    `at ${ ref } before them: ${ describeEnvDocs(docs) }`;
}

function commitEnvDocs(tag: string): void {
  const docs = releaseEnvDocs(checkoutView().readDoc, tag);
  if (docs.length === 0) {
    console.error('   The ENV docs say "upcoming" nowhere, so no docs commit.');
    return;
  }
  const sha = writeAndCommit(docs, prepareCommitMessage(tag));
  console.error(`   ${ sha.slice(0, 10) }: ${ describeEnvDocs(docs) }`);
}

function runTypeCheck(): void {
  try {
    execFileSync('pnpm', [ 'lint:tsc' ], { cwd: repoRoot(), stdio: 'inherit' });
  } catch {
    throw new Error('"pnpm lint:tsc" fails on the release branch; fix it there and re-run');
  }
}

// Picks every "backport" PR the branch lacks, releases "upcoming", and type-checks: the branch is ready to
// push after this. A stopped pick leaves the cherry-pick in progress for the operator.
export function updateReleaseBranch(steps: StepRunner, view: BranchView, tag: string): void {
  const plan = pickPlanAt(view.head());
  logPickPlan(plan);
  for (const pr of plan.picks) {
    steps.run(`Pick ${ describeBackportPr(pr) }`, () => pickCommit(pr.mergeSha, (files) => pickConflictMessage(pr, files)));
  }
  steps.run(envDocsStepTitle(releaseEnvDocs(view.readDoc, tag), tag, view.ref), () => commitEnvDocs(tag));
  steps.run('Run "pnpm lint:tsc"', runTypeCheck);
}
