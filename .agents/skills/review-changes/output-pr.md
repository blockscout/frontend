# Publishing to a PR

`pr` mode. The PR is the record: findings are inline review comments, and a thread stays open until this
reviewer closes it. Commands and the all-or-nothing 422 hazard: [`gh-commands.md`](gh-commands.md).

`event` is always `COMMENT`: never `REQUEST_CHANGES`, which blocks the author's own PR, and never `APPROVE`,
which claims accountability an agent does not have.

## The severity emoji

One set, used on every finding title and on the summary's status line. Nowhere else — a reader who sees
`🛑` skips to it, and that only works while it is rare.

| Severity | Emoji |
| --- | --- |
| `blocker` | 🛑 |
| `major` | ⚠️ |
| `nit` | 💬 |
| `needs-human` (orthogonal, appended) | 🙋 |

## A finding's comment

The title line carries the id and the severity and nothing else; the claim starts below it. One blank line
between every block.

```md
**🛑 F1 · blocker**

<claim, quoting the code>

<suggested fix>

— Reviewed by <agent or model name>
```

`needs-human` extends the title: `**🛑 F1 · blocker · 🙋 needs human**`.

Title with bold, never a heading.

The severity **word** stays next to the emoji. `resolve-review` reads that line to classify a finding, and
nobody greps for a glyph.

## Ids and the footer

The footer names the reviewer from the running model, falling back to `— Reviewed by agent`. Any provider
can run this skill, and that footer is the only thing telling `resolve-review` an agent raised this finding
rather than a colleague — why, in [`gh-commands.md`](gh-commands.md).

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

One batched review event, never N separate comments. Its body is the summary and nothing else; the findings
are the inline comments. Then, if any finding has no line to sit on, one issue comment for those.

Post the review event **first**, the non-anchorable comment after it. A 422 discards the review event
whole, so in that order the retry can fold anything that failed to anchor into a comment you have not sent
yet.

## Findings with no diff anchor

Approach-level questions, and lines outside the diff. They do not go in the summary — mixed in there they
are read as commentary on the summary, and the point of the split is that a reader can find them.

One issue comment holds all of them, titled the same way as an inline finding, with a single footer at the
end:

```md
### 📎 Findings without a diff anchor

**⚠️ F3 · major**

<claim>

<suggested fix>

---

**💬 F7 · nit**

<claim>

<suggested fix>

— Reviewed by <agent or model name>
```

An issue comment is not a review thread: it cannot be resolved, and a reply to it is another issue comment.
So these findings carry no per-finding open state, and their state lives in the summary's counters instead.
They count as open until a `follow-up` round rules on them.

## The summary

Same shape every round, first and follow-up alike, so two rounds can be read against each other.

```md
🛑 **Blocked** — 1 blocker, 1 major open

blocker 1 · major 1 · nit 3 · not anchorable 1

Axes: spec · standards · correctness

— Reviewed by <agent or model name>
```

- **Status.** `🛑 Blocked` and `✅ Cleared` render the two outcomes [`SKILL.md`](SKILL.md) defines, zero
  findings included. Append `· 🙋 <n> needs human` when any `needs-human` finding is open whatever its
  severity.
- **The counters are open counts, never raised counts.** On a `first` round the two are the same. Keeping
  the meaning fixed is what makes the rounds comparable.
- **`Axes:`** is the coverage record, and it names a skipped axis rather than dropping it.

No table of findings. A reader on the PR already has them inline, and a second copy in the summary is one
more thing to keep in sync with the threads.

## A `follow-up` round

Act on each ruling on its own thread, because the reviewer owns the threads it raised and is the one that
closes them. Threads under another tag are not yours to touch.

| Ruling | Reply | Thread |
| --- | --- | --- |
| fix verified | `F<n> — verified` | resolve |
| reject agreed | `F<n> — accepted, <reason>` | resolve |
| reject disputed | the counter-argument | leave open |
| deferred nit | `F<n> — deferred` | leave open |
| regression from a fix | a new inline comment, next free id | leave open |

Non-anchorable findings have no thread, so one issue comment carries their rulings — `F<n> — verified`,
one line each, for those ids only, closing with the same `— Reviewed by` footer: that footer is how
`resolve-review` tells a ruling from its own reply comment on the same ids. Leave the original comment as
posted. An id with no ruling stays in the open counters.

Then post the summary, in the shape above. Nothing marks a round as terminal beyond its status reading
`✅ Cleared`, which is this PR's `cleared` outcome.
