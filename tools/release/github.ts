import { execFileSync } from 'node:child_process';

import { EXEC_MAX_BUFFER } from '../cli/exec';
import type { ReleasePullRequest } from './release-prs';

// Every GitHub call goes through the `gh` CLI, which reads GH_TOKEN in CI and the operator's own
// `gh auth` session locally, so the tool carries no token handling and no HTTP client of its own.
// `{owner}/{repo}` in an API path is filled in by `gh` from the checkout's remote (or GH_REPO).

export function gh(args: ReadonlyArray<string>): string {
  return execFileSync('gh', args as Array<string>, { encoding: 'utf8', maxBuffer: EXEC_MAX_BUFFER });
}

export function ghApi<Response>(path: string): Response {
  return JSON.parse(gh([ 'api', path ])) as Response;
}

function ghGraphql<Response>(query: string, variables: Record<string, string | number>): Response {
  const fields = Object.entries(variables).flatMap(([ name, value ]) => [ '-F', `${ name }=${ value }` ]);
  return JSON.parse(gh([ 'api', 'graphql', '-f', `query=${ query }`, '-F', 'owner={owner}', '-F', 'repo={repo}', ...fields ])) as Response;
}

export interface PullRequest {
  readonly number: number;
  readonly body: string;
  readonly labels: ReadonlyArray<string>;
}

interface PullRequestResponse {
  readonly number: number;
  readonly body: string | null;
  readonly labels: ReadonlyArray<{ readonly name: string }>;
}

export function fetchPullRequest(number: number): PullRequest {
  const response = ghApi<PullRequestResponse>(`repos/{owner}/{repo}/pulls/${ number }`);
  return {
    number: response.number,
    body: response.body ?? '',
    labels: response.labels.map(({ name }) => name),
  };
}

interface LabelsConnection {
  readonly nodes: ReadonlyArray<{ readonly name: string }>;
}

interface ReleasePullRequestResponse {
  readonly data: {
    readonly repository: {
      readonly nameWithOwner: string;
      readonly pullRequest: {
        readonly number: number;
        readonly title: string;
        readonly labels: LabelsConnection;
        readonly closingIssuesReferences: {
          readonly nodes: ReadonlyArray<{
            readonly number: number;
            readonly repository: { readonly nameWithOwner: string };
            readonly labels: LabelsConnection;
          }>;
        };
      };
    };
  };
}

const RELEASE_PULL_REQUEST_QUERY = `
  query ($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      nameWithOwner
      pullRequest(number: $number) {
        number
        title
        labels(first: 100) { nodes { name } }
        closingIssuesReferences(first: 50) {
          nodes {
            number
            repository { nameWithOwner }
            labels(first: 100) { nodes { name } }
          }
        }
      }
    }
  }
`;

function labelNames({ nodes }: LabelsConnection): Array<string> {
  return nodes.map(({ name }) => name);
}

// A PR can close an issue in another repository; labeling it by number here would hit the wrong issue.
export function fetchReleasePullRequest(number: number): ReleasePullRequest {
  const { data: { repository } } = ghGraphql<ReleasePullRequestResponse>(RELEASE_PULL_REQUEST_QUERY, { number });
  const { pullRequest } = repository;
  return {
    number: pullRequest.number,
    title: pullRequest.title,
    labels: labelNames(pullRequest.labels),
    closingIssues: pullRequest.closingIssuesReferences.nodes
      .filter((issue) => issue.repository.nameWithOwner === repository.nameWithOwner)
      .map((issue) => ({ number: issue.number, labels: labelNames(issue.labels) })),
  };
}

export function fetchAssociatedPr(sha: string): number | undefined {
  const pulls = ghApi<ReadonlyArray<{ readonly number: number; readonly merged_at: string | null }>>(`repos/{owner}/{repo}/commits/${ sha }/pulls`);
  return pulls.find(({ merged_at: mergedAt }) => mergedAt !== null)?.number;
}

function labelPath(name: string): string {
  return `repos/{owner}/{repo}/labels/${ encodeURIComponent(name) }`;
}

export function ensureLabel(name: string, description: string, color: string): 'created' | 'exists' {
  try {
    ghApi(labelPath(name));
    return 'exists';
  } catch {
    gh([ 'label', 'create', name, '--description', description, '--color', color ]);
    return 'created';
  }
}

// PRs are issues to the labels API, so one call shape labels both.
export function addLabel(number: number, name: string): void {
  gh([ 'api', '--method', 'POST', `repos/{owner}/{repo}/issues/${ number }/labels`, '-f', `labels[]=${ name }` ]);
}

export function removeLabel(number: number, name: string): void {
  gh([ 'api', '--method', 'DELETE', `repos/{owner}/{repo}/issues/${ number }/labels/${ encodeURIComponent(name) }` ]);
}

export function listLabeled(name: string): Array<number> {
  const path = `repos/{owner}/{repo}/issues?labels=${ encodeURIComponent(name) }&state=all&per_page=100`;
  return gh([ 'api', '--paginate', path, '--jq', '.[].number' ]).split('\n').filter(Boolean).map(Number);
}
