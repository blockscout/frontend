---
name: triage-monitoring-event
description: Triage one error-monitoring event end-to-end — mute it as noise, or open a PR with the fix.
disable-model-invocation: true
argument-hint: <event URL or id, or a Slack message/thread link carrying one>
---
# Triage a monitoring event

One event in, one of three outcomes out: the event is **muted** in the monitoring tool, a **PR** with
the fix is open, or the event is reported as **already fixed** on `main`, with the commit named. The mute
and the PR are a click to undo, and the third changes nothing, so the run goes end-to-end without asking.
The user reads the final message.

The monitoring provider is Rollbar; everything provider-specific — reaching the tool, reading an event,
muting it — is in [`rollbar.md`](rollbar.md). The steps below name the operations; that file says how.

## Steps

### 1. Resolve the input

- An **event URL or id** — that is the event.
- A **Slack message or thread link** — read it per `.agents/slack-thread.md`; the event is the first
  event link in the thread. Keep the thread: the outcome is posted back there (step 7). Several
  distinct event links, or none, is a stop: ask which one, or for the link.
- Anything else is a stop: ask for the event link.

**Done when:** exactly one event is named.

### 2. Check the tool

Run the provider's **precheck**. A missing tool or a rejected token is a stop: tell the user what to
configure, from the provider doc, and end there.

**Done when:** the precheck returned data.

### 3. Read the event

**Fetch the event** and a handful of its occurrences, so the sample is not one visitor. Collect: the
title and exception class, the occurrence count, first and last timestamps, the release version, and
per occurrence the page URL, the user agent and the telemetry leading up to the error.

A **group item** (the provider doc says how it answers) has no occurrences of its own: a stop — ask for
the link of one of its constituent items.

**Done when:** the event and every occurrence the list returned are in hand, however many came back.

### 4. Locate the code

Find the throw site by the signals that survive a production build (see the provider doc for what
the frames do and do not give):

- the **message text**: `grep` it in `src/`, including the templates it may have been built from;
- the **page**: the page URL maps to a route under `src/pages`; the error is on that route's render path;
- the **telemetry**: the console and network lines before the error name the request or action that
  triggered it;
- the **release**: the release version is a git tag or, for a build without one, a commit SHA; either is
  a rev. If `main` has since changed the suspected code, read it as of that rev (`git show <rev>:<path>`)
  and check whether `main` already fixed it — that is the **Already fixed** outcome in step 5, with the
  fixing commit named.

**Done when:** the throw site is named, or it is established that the throw is outside our code (browser,
extension, SDK, infrastructure).

### 5. Classify

Pick one outcome, with the test:

| Outcome | When |
| --- | --- |
| **Mute** | Noise: the throw is environmental or outside our code — scraper and headless user agents, extensions, network and infra failures, a vendored SDK's expected rejection — and nothing we ship would change it. |
| **Fix PR** | Our code throws, or handles a legitimate situation badly, on a path a real user reaches, and `main` still has the bug. |
| **Already fixed** | A bug by the Fix PR test, but a commit on `main` after the release already fixes it. |

A mute silences one event signature. When the same noise family will come back under new titles (a
variable URL, host or count in the message), a **filter** is the fix — a `checkIgnore` helper or an
`ignoredMessages` entry in `src/services/rollbar/clientConfig.ts`, with the reason comment that file's
entries carry. That is the Fix PR outcome, and the event is muted too (step 6a), since the filter only
lands with the next release — the one case where a fix PR also mutes.

**Done when:** the outcome and its one-paragraph justification are written down for the final message.

### 6a. Mute

**Mute the event** per the provider doc.

**Done when:** the tool reports the new status.

### 6b. Fix PR

Work on a fresh branch off `origin/main`: `monitoring-<id>-<kebab-slug>`. Apply the project rules
(`.agents/rules/code-quality.md`, `.agents/rules/typescript.md`, `.agents/rules/tests-unit.md`): a
regression unit test where the throw is unit-testable, lint and type-check clean on the changed files.

Then follow the `create-pr` skill, Mode C. The Description names the
event as a link, the occurrence count and the environment signal that made it a bug, and what the fix
changes. The event stays active in the monitoring tool, so it resolves when the release carrying the fix
ships — except when the fix is a filter (step 5), which also runs 6a.

**Done when:** the PR link is in hand and `git status` is clean.

### 6c. Already fixed

Nothing to change: no PR, and the event stays active in the monitoring tool. It resolves when the release carrying the fixing commit ships. (Marking it resolved
against the commit does not work. See explanation in provider doc.)

**Done when:** the fixing commit on `main` is named for the final message.

### 7. Report

Compose the **final message**: the outcome in one line with its link (PR, or the event), the
justification from step 5, for a mute the one-line test a future reader can reuse to recognise the same
noise, and for an already-fixed event the commit on `main` that fixes it and that the event stays active
until the release carrying it ships.

When the input was a Slack thread, post the same text as a reply in that thread, written per
`.agents/slack-message.md`. Post it without asking — the named exception to `AGENTS.md`'s
approve-before-sending rule.

**Done when:** the message is shown to the user and, for a Slack-sourced run, posted in the thread.

## Run by Honk

When the Honk orchestrator runs this skill headless, follow [`honk.md`](../../honk.md). This skill adds
no statuses of its own; the shared three with their triggers here:

| Status | When | Resumed? |
| --- | --- | --- |
| `done` | the event is muted, the PR is open, or the fixing commit is named, and the step 7 message is shown — and, for a Slack-sourced run, posted; the message is that text | no |
| `needs_user` | step 1 found no event link or several, the precheck failed, or step 3 hit a group item; the message carries the question (for a group item, which constituent-item link to send) or the setup to do | yes, with the answer |
| `needs_approval` | the mute, the push, the PR creation or the Slack reply needs a tool the worker profile denies; the message carries exactly what would be done | yes, once a human did it or allowed it |
