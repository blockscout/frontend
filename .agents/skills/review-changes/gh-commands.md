# gh / GraphQL command reference

The whole PR surface both review skills need: `review-changes` posts findings and, in arbitration rounds,
replies and resolves the threads it raised; `resolve-review` gathers, replies, and resolves bot and human
threads. Substitute `{owner}`, `{repo}`, `{N}` (PR number), `{commentId}`. Derive `{owner}/{repo}` once
and reuse.

Confirm `gh auth status` succeeds before anything else — follow the `check-github-cli` skill if it does
not. Never authenticate on the developer's behalf.

## Repo & PR discovery

```bash
# owner / repo for the current checkout
gh repo view --json nameWithOwner,owner,name

# PR for the current branch — its absence is what selects chat mode. Use `gh pr list`, never `gh pr view`,
# which exits 1 both when no PR exists and when it can't reach GitHub: exit ≠ 0 is a tooling failure that
# aborts, exit 0 with `[]` is genuinely no PR.
gh pr list --head "$(git branch --show-current)" --state open \
  --json number,title,url,headRefName,baseRefName,state,isDraft

# head sha, needed as commit_id when posting a review
git rev-parse HEAD
```

## Posting a review (review-changes)

One batched review event per round. Build the payload as a file, then:

```bash
gh api -X POST repos/{owner}/{repo}/pulls/{N}/reviews --input review.json
```

```json
{
  "commit_id": "<head sha>",
  "event": "COMMENT",
  "body": "<header table, plus a '## Not anchorable' section if any>",
  "comments": [
    {
      "path": "src/slices/token/pages/Holders.tsx",
      "line": 41,
      "side": "RIGHT",
      "body": "**F1 · blocker** — <claim>\n\n<suggested fix>\n\n— Reviewed by <agent or model name>"
    }
  ]
}
```

`event` is always `COMMENT`. For a multi-line anchor add `start_line` (and `start_side`) alongside
`line`.

### Validate every anchor first — the POST is all-or-nothing

A single comment whose `line` is not in the diff returns 422 and **the entire review is discarded**,
silently losing every other comment. So compute the anchorable lines before posting:

```bash
gh api repos/{owner}/{repo}/pulls/{N}/files --paginate \
  --jq '.[] | {path: .filename, patch: .patch}'
```

For each file, walk its `patch`: every `@@ -a,b +c,d @@` header starts a hunk whose RIGHT-side line
numbers run from `c`; added (`+`) and context (` `) lines each advance that counter and are anchorable,
removed (`-`) lines do not advance it and are not. A finding whose line is outside that set moves into the
review body under `## Not anchorable`.

If a POST still 422s, retry once with the offending comments demoted into the body. Never drop them.

## Gather (resolve-review)

```bash
# inline review comments — the usual review threads
gh api repos/{owner}/{repo}/pulls/{N}/comments --paginate

# PR-level reviews (summary body + state per reviewer)
gh api repos/{owner}/{repo}/pulls/{N}/reviews --paginate

# issue-level comments (the conversation tab, incl. most bot posts)
gh api repos/{owner}/{repo}/issues/{N}/comments --paginate
```

Fields worth reading per inline comment:

| Field | Use |
| --- | --- |
| `id` | the comment's databaseId — needed to reply |
| `in_reply_to_id` | `null` = top-level; otherwise a reply within a thread |
| `path`, `line` / `original_line` | where it sits — open this code |
| `diff_hunk` | the snippet the reviewer saw |
| `user.login` | author — this is how you tell a human from a bot from this workflow's own review |
| `body` | the comment text |
| `html_url` | link back to the comment |

**Telling the sources apart matters**, because they are adjudicated differently: a comment whose body ends
in a `— Reviewed by …` footer is this workflow's own review, whichever provider produced it, and may be
rejected; a bot's gets no deference at all; a human's may never be rejected. Test the footer **first** —
`user.login` is the repo owner's account for every agent, so nothing else separates this workflow's review
from a human's — then `user.type == "Bot"` for the bots. Never match bot logins by name; see the source
table in `../resolve-review/SKILL.md` for why.

### Parse a comment / PR link

- **PR number**: `pull/(\d+)`
- **Inline review comment id**: `#discussion_r(\d+)`
- **Issue comment id**: `#issuecomment-(\d+)`

The captured id equals the REST `id` (databaseId), which maps to a GraphQL thread via the query below.

## Reply, then resolve (both skills)

```bash
gh api -X POST repos/{owner}/{repo}/pulls/{N}/comments/{commentId}/replies \
  -f body="…your reply…"
```

`{commentId}` is the thread's top-level comment (the one with `in_reply_to_id: null`).

List unresolved threads with their node id and first comment's databaseId:

```bash
gh api graphql -f query='
query {
  repository(owner:"{owner}", name:"{repo}") {
    pullRequest(number:{N}) {
      reviewThreads(first:50) {
        nodes { id isResolved comments(first:1){ nodes { databaseId } } }
      }
    }
  }
}' -q '.data.repository.pullRequest.reviewThreads.nodes[]
        | select(.isResolved==false)
        | "\(.id) \(.comments.nodes[0].databaseId)"'
```

```bash
gh api graphql -f query='mutation {
  resolveReviewThread(input:{threadId:"PRRT_…"}) { thread { id isResolved } }
}'
```

Notes:

- Reply *before* resolving — a resolved thread still accepts replies, but replying first keeps the
  explanation visible.
- Skip threads already `isResolved`.
- Leave `disputed`, `needs-human` and `answered` threads **unresolved** — they are exactly the ones that
  must stay visible.
- Bot status posts (CodeRabbit "review skipped", Copilot's PR overview) arrive as issue comments, have no
  thread to resolve, and are not actionable.
