#!/usr/bin/env node

// Resolves the cross-references in the agent instruction surface: markdown links, heading anchors, and the
// file and directory paths in backticks. These files instruct agents rather than humans, so a reference that
// no longer resolves does not merely read badly — it sends an agent to a file that is not there, and nothing
// else in the toolchain notices. Kept mechanical on purpose: a review agent should spend its judgement on
// what a rule says, not on whether the rule's target still exists.
//
// These documents also carry paths that are *illustrations* rather than references — a template's output
// column, a kind of file that lives in many slices. Checking those would produce noise that trains everyone
// to ignore the checker, so an illustration is exempt where it carries a mark that cannot be read as a
// reference; `ILLUSTRATION_FORMS` below is the only statement of what those marks are. Each exemption is
// scoped to the path itself rather than to its whole line, so a real reference standing beside an
// illustration is still checked, and anything unmarked is read as a reference and has to resolve.
//
// An `e.g.` is deliberately *not* a mark. Prose that introduces a real file as an example is the common
// case by far, and exempting it would leave those references unprotected against a later rename — the drift
// this script exists to catch. An example that names no real file gets a `<placeholder>` segment instead.

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readdir, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');

// The instruction surface: the agent config directories, plus every per-directory CONTEXT.md wherever it
// lives. Task specs are excluded — they describe files that do not exist yet by design.
const ROOTS = [ '.agents', '.claude', '.cursor' ];
const EXCLUDED = [ '.agents/tasks', '.claude/worktrees' ];
const SKIPPED_DIRS = new Set([ 'node_modules', '.git', '.next' ]);

const PATH_EXTENSIONS = /\.(?:md|mdc|mjs|json|jsonc|ya?ml|sh|tsx?)$/;

const tracked = execFileSync('git', [ 'ls-files' ], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);

// Derived rather than listed, so a new top-level directory needs no edit here. A path is only expected to
// resolve when its first segment is one of these: `types/api.ts` names a kind of file, `src/api/types.ts` a
// location.
const TOP_LEVEL = new Set(tracked.filter((f) => f.includes('/')).map((f) => f.split('/')[0]));

async function collectMarkdown(dir, acc = []) {
  let entries;
  try {
    entries = await readdir(path.join(ROOT, dir), { withFileTypes: true });
  } catch {
    return acc; // a root absent from this checkout is not an error
  }

  for (const entry of entries) {
    const rel = path.join(dir, entry.name);
    if (EXCLUDED.some((ex) => rel === ex || rel.startsWith(`${ ex }/`))) continue;

    // A symlinked directory (`.claude/skills` → `../.agents/skills`) is not a directory to `readdir`, so the
    // walk skips it — correctly, since the walk over `.agents` reaches those files by their real path.
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRS.has(entry.name)) await collectMarkdown(rel, acc);
    } else if (/\.mdc?$/.test(entry.name)) {
      acc.push(rel);
    }
  }

  return acc;
}

// GitHub's heading slug: lowercase, drop all but word chars, spaces and hyphens, then spaces to hyphens.
const slugify = (heading) => heading
  .toLowerCase()
  .replace(/`/g, '')
  .replace(/[^\w\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-');

async function headingSlugs(absPath) {
  const body = await readFile(absPath, 'utf8');
  return new Set(
    body.split('\n')
      .filter((line) => /^#{1,6}\s/.test(line))
      .map((line) => slugify(line.replace(/^#{1,6}\s+/, ''))),
  );
}

// Fenced blocks hold example commands and JSON payloads; neither is a reference.
function withoutFences(body) {
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
const ILLUSTRATION_FORMS = 'give it a <placeholder> segment, or place it after a → in a table row as the ' +
  'output of the pattern before it';

// Blanks the marked regions and leaves the rest of the line checkable. The arrow form is confined to table
// rows, where a cell pairs a pattern with its filled-in output; in prose an arrow is ordinary punctuation
// and the path after it is a reference like any other. The `<placeholder>` form is per-path, below.
const withoutIllustrations = (line) => (/^\s*\|/.test(line) ? line.replace(/→[^|]*/g, '') : line);

const isPlaceholder = (target) => /[<>{}*]|__/.test(target);

// Resolved against the file's realpath, so a symlinked entry point (`.claude/CLAUDE.md` → `.agents/AGENTS.md`)
// resolves its relative links from where the file really lives.
function resolves(realDir, target) {
  const clean = target.replace(/^\.\//, '');
  return [ path.resolve(realDir, clean), path.resolve(ROOT, clean) ].find((c) => existsSync(c));
}

// A path that resolves nowhere may still name a real file written short — `toolkit/theme/theme.ts` for
// `src/toolkit/theme/theme.ts`. Reported only when exactly one tracked file ends with it, which makes the
// intended file certain; `types/api.ts` matches thirty of them and so asserts no single location to check.
// Files only: a bare directory such as `hooks/` names a convention every slice follows, not one location,
// and nothing distinguishes that from shorthand.
function shorthandFor(target) {
  const matches = tracked.filter((f) => f.endsWith(`/${ target }`));
  return matches.length === 1 ? matches[0] : undefined;
}

// A path whose parent directory sits beside the file was written relative to it — `components/Provider.tsx`
// in a CONTEXT.md is a reference to a neighbour, and its absence is a break. Without this the whole relative
// class goes unprotected: once broken, such a path is indistinguishable from `types/api.ts` naming a kind of
// file, so a renamed neighbour would fail silently.
function nearby(realDir, target) {
  const parent = path.dirname(target);
  return parent !== '.' && !target.endsWith('/') && existsSync(path.resolve(realDir, parent));
}

async function checkFile(fileRel, failures) {
  const realDir = path.dirname(await realpath(path.join(ROOT, fileRel)));
  const lines = withoutFences(await readFile(path.join(ROOT, fileRel), 'utf8'));

  for (const [ index, rawLine ] of lines.entries()) {
    const report = (message) => failures.push({ file: fileRel, line: index + 1, message });
    const checkable = withoutIllustrations(rawLine);

    // Backtick paths. Collected first, then stripped, so an inline code span holding a markdown-link
    // example — `[Link Text](URL)` — is not read as a link.
    const spans = [ ...checkable.matchAll(/`([^`]+)`/g) ].map((m) => m[1]);
    const line = checkable.replace(/`[^`]+`/g, '');

    for (const target of spans) {
      if (/\s/.test(target) || isPlaceholder(target) || !target.includes('/')) continue;
      // A trailing slash marks a directory, a known extension marks a file. Anything else in backticks — a
      // config key, a dotted token, a fragment of prose — is not a path.
      if (!target.endsWith('/') && !PATH_EXTENSIONS.test(target)) continue;
      if (resolves(realDir, target)) continue;

      const full = shorthandFor(target);
      if (full) {
        report(`${ target } is shorthand; write it in full: ${ full }`);
      } else if (target.startsWith('./') || TOP_LEVEL.has(target.split('/')[0]) || nearby(realDir, target)) {
        report(`path reference does not exist: ${ target }`);
      }
    }

    // Markdown links, with an optional heading anchor.
    for (const [ , target ] of line.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      if (/^(?:https?:|mailto:|#)/.test(target) || isPlaceholder(target)) continue;

      const [ filePart, anchor ] = target.split('#');
      // A link with neither a slash nor a file extension is prose in brackets, not a path.
      if (!filePart.includes('/') && !PATH_EXTENSIONS.test(filePart)) continue;

      const resolved = resolves(realDir, filePart);
      if (!resolved) {
        report(`link target does not exist: ${ target }`);
      } else if (anchor && resolved.endsWith('.md')) {
        const slugs = await headingSlugs(resolved);
        if (!slugs.has(anchor.toLowerCase())) report(`heading anchor not found in target: ${ target }`);
      }
    }
  }
}

const walked = (await Promise.all(ROOTS.map((r) => collectMarkdown(r)))).flat();
const contexts = tracked.filter((f) => path.basename(f) === 'CONTEXT.md');

// One entry per real file. `.cursor/rules/*.mdc` and `.claude/CLAUDE.md` are symlinks onto files the walk
// already reached under `.agents`, and checking a file twice reports each of its findings twice.
const seen = new Map();
for (const rel of [ ...walked, ...contexts ]) {
  const real = await realpath(path.join(ROOT, rel));
  if (!seen.has(real)) seen.set(real, rel);
}
const files = [ ...seen.values() ];

const failures = [];
for (const file of files) {
  await checkFile(file, failures);
}

if (failures.length > 0) {
  for (const { file, line, message } of failures) {
    // eslint-disable-next-line no-console
    console.error(`${ file }:${ line } — ${ message }`);
  }
  // eslint-disable-next-line no-console
  console.error(
    `\n${ failures.length } unresolved reference(s) across ${ files.length } file(s).\n` +
    `A path naming a shape rather than a file has to be marked as one, or it is read as a reference: ${ ILLUSTRATION_FORMS }.`,
  );
  process.exit(1);
}

// eslint-disable-next-line no-console
console.log(`Doc links: ${ files.length } files checked, every reference resolves.`);
