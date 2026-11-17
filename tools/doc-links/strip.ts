// Blanks the regions of a line that are not references, leaving the rest checkable.
//
// The instruction documents carry paths that are *illustrations* rather than references — a template's
// output column, a kind of file that lives in many slices. Checking those would produce noise that trains
// everyone to ignore the checker, so an illustration is exempt where it carries a mark that cannot be read
// as a reference; `ILLUSTRATION_FORMS` below is the only statement of what those marks are. Each exemption
// is scoped to the path itself rather than to its whole line, so a real reference standing beside an
// illustration is still checked, and anything unmarked is read as a reference and has to resolve.
//
// An `e.g.` is deliberately *not* a mark. Prose that introduces a real file as an example is the common
// case by far, and exempting it would leave those references unprotected against a later rename — the drift
// this script exists to catch. An example that names no real file gets a `<placeholder>` segment instead,
// which is the per-path form of the exemption (`isPlaceholder` in ./resolve.ts).

// Fenced blocks hold example commands and JSON payloads; neither is a reference.
export function withoutFences(body: string): Array<string> {
  let inFence = false;
  return body.split('\n').map((line) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return '';
    }
    return inFence ? '' : line;
  });
}

// Stated once, and printed on failure so the convention reaches an author at the moment they trip it rather
// than in a document they would have to know to read.
export const ILLUSTRATION_FORMS = 'give it a <placeholder> segment, or place it after a → in a table row as the ' +
  'output of the pattern before it';

// The arrow form is confined to table rows, where a cell pairs a pattern with its filled-in output; in prose
// an arrow is ordinary punctuation and the path after it is a reference like any other.
export const withoutIllustrations = (line: string): string =>
  (/^\s*\|/.test(line) ? line.replace(/→[^|]*/g, '') : line);
