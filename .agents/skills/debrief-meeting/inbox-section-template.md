# Inbox section

Two blocks. The file header goes in once, when `debrief-meeting` creates `inbox.md`; every run appends one
section below whatever is there.

File header:

```
# Inbox — <task title>

<!-- One section per outer-loop source (a meeting, a thread, a document), newest last. `debrief-meeting`
appends a section; `process-task-inbox` folds a `pending` section into questions, spec and tickets and
flips it to `folded`. A section holds decisions only, each with a link into its source: the deliberation
stays in the recording. -->
```

Section:

```
## <YYYY-MM-DD> <source title>

- Source: <link to the recording or thread>
- Status: `pending` \| `folded`

Decisions:

- <decision as a phrase>. "<a few words from the sentence that settles it>" (<deep link, `?t=<seconds>` for a recording>)
```
