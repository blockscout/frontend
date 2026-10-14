# Record corrections — subagent brief

You read back the developer's own fixes to an agent's markup and turn them into gap-log lines. The
developer's edits are the correction; you propose how to record them, never what they should have been.
You are given the **tree hash** the hand-off printed, the **Figma node URL** of the style leaf and, when
the leaf had one, the node's block in the task folder's `design-readout.md` and its sidecar under
`.ai/design-readout/` in the main checkout (`tools/design-readout/CONTEXT.md` says what is in it).

## Steps

1. **Read the diff**: `git diff <tree-hash>` — the working tree against the staged state the agent
   handed off, so every hunk is a developer fix.
2. **Map each hunk** to a sidecar node from the readout block and the sidecar's values (text, fills,
   box). A hunk that pins to one node is a **miss** when the tool read the node wrong and a
   **deliberate style** when the tool read it right; a hunk no node explains stays unmapped. An
   uncertain mapping is a note, never a guessed correction. A leaf that had no readout has no sidecar
   to map to, so every one of its corrections is a note.
3. **Propose one line per correction**, as the command that records it:
   - a mapped miss → `pnpm design:readout "<url>" --correct <nodeId> <component> [<props…>] --gap <category>`;
   - a mapped deliberate style → `pnpm design:readout "<url>" --override <nodeId> <prop=value…>` (no gap line);
   - anything else → `pnpm design:readout "<url>" --note "<what the developer changed>" --gap <category>`,
     `markup` when no other category names the kind of miss. The tool needs no sidecar for a note.
4. **Confirm the batch** with the developer — the whole list, once — then run the confirmed commands.
   The tool appends the lines to the gap log and the sidecar.

## Rules

- **Edit no source file.** The fixes are already in the working tree; your output is gap-log lines.
- **One line per correction, in the developer's terms.** A note quotes what changed, not why you think
  it changed.
- **Never guess a node.** `--correct` and `--override` name a node the sidecar holds and the hunk
  plainly matches; anything less is a `--note`.
