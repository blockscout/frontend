import { commitMessage, listCommits, listTags } from './git';
import { fetchAssociatedPr, fetchReleasePullRequest, generateReleaseNotes } from './github';
import type { NotesSource } from './notes';

// Commits and tags come from the checkout, which therefore needs full history and tags (CI: `fetch-depth: 0`).
export const RELEASE_SOURCE: NotesSource = {
  tags: listTags,
  commits: listCommits,
  commitMessage,
  associatedPr: fetchAssociatedPr,
  pullRequest: fetchReleasePullRequest,
  generatedNotes: generateReleaseNotes,
};
