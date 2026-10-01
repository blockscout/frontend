import { commitMessage, listCommits, listTags } from './git';
import { fetchAssociatedPr, fetchReleasePullRequest } from './github';
import type { ReleaseSource } from './release-prs';

// Commits and tags come from the checkout, which therefore needs full history and tags (CI: `fetch-depth: 0`).
export const RELEASE_SOURCE: ReleaseSource = {
  tags: listTags,
  commits: listCommits,
  commitMessage,
  associatedPr: fetchAssociatedPr,
  pullRequest: fetchReleasePullRequest,
};
