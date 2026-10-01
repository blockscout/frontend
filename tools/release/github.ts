import { execFileSync } from 'node:child_process';

import { EXEC_MAX_BUFFER } from '../cli/exec';
import type { GithubRelease } from './pre-release';
import type { ReleasePullRequest } from './release-prs';

// Every GitHub call goes through the `gh` CLI, which reads GH_TOKEN in CI and the operator's own
// `gh auth` session locally, so the tool carries no token handling and no HTTP client of its own.
// `{owner}/{repo}` in an API path is filled in by `gh` from the checkout's remote (or GH_REPO).

export function gh(args: ReadonlyArray<string>, input?: string): string {
  return execFileSync('gh', args as Array<string>, { input, encoding: 'utf8', maxBuffer: EXEC_MAX_BUFFER });
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
        readonly url: string;
        readonly body: string;
        readonly author: { readonly login: string } | null;
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
        url
        body
        author { login }
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
    // A deleted account leaves a PR without an author; GitHub shows it as this placeholder user.
    author: pullRequest.author?.login ?? 'ghost',
    url: pullRequest.url,
    body: pullRequest.body,
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

// The issues endpoint answers for PRs and issues alike, so a `#N` naming an issue reads as "not a PR"
// instead of a 404.
interface IssueResponse {
  readonly labels: ReadonlyArray<{ readonly name: string }>;
  readonly pull_request?: object;
}

export function fetchPrLabels(number: number): ReadonlyArray<string> | undefined {
  const issue = ghApi<IssueResponse>(`repos/{owner}/{repo}/issues/${ number }`);
  return issue.pull_request === undefined ? undefined : issue.labels.map(({ name }) => name);
}

// Listed rather than fetched by tag: `releases/tags/<tag>` never returns a draft, and the line's
// pre-release stays a draft through its alphas. Seeing drafts takes push access.
export function fetchReleaseBodies(tag: string): Array<string> {
  const jq = `.[] | select(.tag_name == ${ JSON.stringify(tag) }) | .body // "" | @json`;
  return gh([ 'api', '--paginate', 'repos/{owner}/{repo}/releases', '--jq', jq ])
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as string);
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

// Only for its "New Contributors" list: GitHub knows who contributed before, the checkout does not.
// A tag not pushed yet needs the commit it will name as its target.
export function generateReleaseNotes(tag: string, previousTag: string, target?: string): string {
  const targetField = target === undefined ? [] : [ '-f', `target_commitish=${ target }` ];
  return gh([
    'api', '--method', 'POST', 'repos/{owner}/{repo}/releases/generate-notes',
    '-f', `tag_name=${ tag }`, '-f', `previous_tag_name=${ previousTag }`, ...targetField, '--jq', '.body',
  ]);
}

// Sent as a JSON body on stdin: release notes outgrow what fits in a `-f` argument.
function ghSend<Response>(method: 'POST' | 'PATCH', apiPath: string, payload: object): Response {
  return JSON.parse(gh([ 'api', '--method', method, apiPath, '--input', '-' ], JSON.stringify(payload))) as Response;
}

interface ReleaseResponse {
  readonly id: number;
  readonly tag_name: string;
  readonly draft: boolean;
  readonly prerelease: boolean;
  readonly html_url: string;
}

function toGithubRelease(release: ReleaseResponse): GithubRelease {
  return { id: release.id, tagName: release.tag_name, draft: release.draft, prerelease: release.prerelease, url: release.html_url };
}

export function listReleases(): Array<GithubRelease> {
  return gh([ 'api', '--paginate', 'repos/{owner}/{repo}/releases', '--jq', '.[] | { id, tag_name, draft, prerelease, html_url } | @json' ])
    .split('\n')
    .filter(Boolean)
    .map((line) => toGithubRelease(JSON.parse(line) as ReleaseResponse));
}

export interface ReleaseContent {
  readonly tagName: string;
  readonly target: string;
  readonly body: string;
}

function releaseFields({ tagName, target, body }: ReleaseContent): object {
  return { tag_name: tagName, target_commitish: target, name: tagName, body };
}

export function createDraftPreRelease(content: ReleaseContent): GithubRelease {
  return toGithubRelease(ghSend('POST', 'repos/{owner}/{repo}/releases', { ...releaseFields(content), draft: true, prerelease: true }));
}

export function updateRelease(id: number, content: ReleaseContent): GithubRelease {
  return toGithubRelease(ghSend('PATCH', `repos/{owner}/{repo}/releases/${ id }`, releaseFields(content)));
}

export interface WorkflowRun {
  readonly id: number;
  readonly url: string;
}

// A tag push runs with the tag as its "branch".
export function findTagRun(workflow: string, tag: string): WorkflowRun | undefined {
  const runs = JSON.parse(gh([
    'run', 'list', '--workflow', workflow, '--branch', tag, '--event', 'push', '--limit', '1', '--json', 'databaseId,url',
  ])) as ReadonlyArray<{ readonly databaseId: number; readonly url: string }>;
  return runs.map(({ databaseId, url }) => ({ id: databaseId, url }))[0];
}

// The live progress goes to stderr, keeping stdout for the command's result.
export function watchRun(id: number): boolean {
  try {
    execFileSync('gh', [ 'run', 'watch', String(id), '--exit-status' ], { stdio: [ 'ignore', 2, 2 ] });
    return true;
  } catch {
    return false;
  }
}
