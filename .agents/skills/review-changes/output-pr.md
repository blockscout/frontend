# Publishing to a PR

`pr` mode. The PR is the record: findings are inline review comments, and a thread stays open until this
reviewer closes it. Commands and the all-or-nothing 422 hazard: [`gh-commands.md`](gh-commands.md).

`event` is always `COMMENT`: never `REQUEST_CHANGES`, which blocks the author's own PR, and never `APPROVE`,
which claims accountability an agent does not have.

## Ids and the footer

Every inline comment opens with its finding id and severity — `**F1 · blocker** — <claim>` — then the
suggested fix, then a footer naming the reviewer from the running model, `— Reviewed by <agent or model
name>`, falling back to `— Reviewed by agent`. Any provider can run this skill, and that footer is the only
thing telling `resolve-review` this is an agent's finding rather than a colleague's: an agent posts through
a human's account, so `user.login` is the repo owner's in every case.

Under `--as <tag>` the id carries the tag (`cursor-F1`) and the footer names it too — `— Reviewed by cursor
(<model name>)`.

The id is the handle a human greps for and the coder cites back, so it is stable: a `follow-up` round
recovers the highest `F<n>` **of its own tag** from the existing comments and numbers any regression from
there.

## Before posting a `first` round

Read the existing review threads ([`gh-commands.md`](gh-commands.md)) and sort them by footer:

- **A footer-bearing thread whose tag is not yours, and you were given no `--as`** — another agent is
  already reviewing this PR. Stop and ask for a tag.
- **A thread under another tag that raises a defect you also found** — reply `+1 — <your tag> concurs` on
  it and drop your own copy. Agreement between two reviewers is worth recording; a duplicate id is not.
- **Your own earlier threads** — you are running `first` over a change you already reviewed. Say so and
  confirm with the operator before posting a second set.

## A `first` round

One batched review event, never N separate comments. The review body is the header table listing each
finding by id, plus a `## Not anchorable` section for findings with no diff line to sit on — approach-level
questions, or lines outside the diff. With zero findings the body is `Review clear` and the zeroed counts.

## A `follow-up` round

Act on each ruling on its own thread, because the reviewer owns the threads it raised and is the one that
closes them. Threads under another tag are not yours to touch.

| Ruling | Reply | Thread |
| --- | --- | --- |
| fix verified | `F<n> — verified` | resolve |
| reject agreed | `F<n> — accepted, <reason>` | resolve |
| reject disputed | the counter-argument | leave open |
| regression from a fix | a new inline comment, next free id | leave open |

When no `blocker` or `major` thread of yours is left open — only `deferred` nits remain — post a final
review whose body is `Review clear` and the counts. That terminal comment is the PR's `Outcome: clear`.
