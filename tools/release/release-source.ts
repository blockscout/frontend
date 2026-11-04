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

// For a tag not cut yet: the notes are read up to the commit it is going to name. GitHub generates its notes
// only at a commit it has, so they go up to `pushedHead`, the newest commit of the branch already on origin;
// what sits past it are picks and the docs commit, which GitHub ties to no PR of their own.
export function releaseSourceAt(head: string, pushedHead: string): NotesSource {
  return {
    ...RELEASE_SOURCE,
    commits: (from) => listCommits(from, head),
    generatedNotes: (tag, previousTag) => generateReleaseNotes(tag, previousTag, pushedHead),
  };
}
