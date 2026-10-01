import { execFileSync } from 'node:child_process';

import { EXEC_MAX_BUFFER } from '../cli/exec';

// Every GitHub call goes through the `gh` CLI, which reads GH_TOKEN in CI and the operator's own
// `gh auth` session locally, so the tool carries no token handling and no HTTP client of its own.
// `{owner}/{repo}` in an API path is filled in by `gh` from the checkout's remote (or GH_REPO).

export function gh(args: ReadonlyArray<string>): string {
  return execFileSync('gh', args as Array<string>, { encoding: 'utf8', maxBuffer: EXEC_MAX_BUFFER });
}

export function ghApi<Response>(path: string): Response {
  return JSON.parse(gh([ 'api', path ])) as Response;
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
