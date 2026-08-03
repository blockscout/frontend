#!/usr/bin/env node

// Resolves the cross-references in the agent instruction surface: markdown links, heading anchors, and
// root-anchored paths in backticks. These files instruct agents rather than humans, so a reference that no
// longer resolves does not merely read badly — it sends an agent to a file that is not there, and nothing
// else in the toolchain notices. Kept mechanical on purpose: a review agent should spend its judgement on
// what a rule says, not on whether the rule's target still exists.
//
// Deliberately narrow, because these documents are full of paths that are *illustrations* rather than
// references — a template's output column, a kind of file that lives in many slices, an `e.g.`. Checking
// those produces noise that trains everyone to ignore the checker, so only two forms are checked: a
// markdown link, and a backtick path anchored at a repo root. Everything else is left alone.

import { existsSync } from 'node:fs';
import { readdir, readFile, realpath } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');

// The instruction surface. Task specs are excluded: they describe files that do not exist yet by design.
const ROOTS = [ '.agents', '.claude', '.cursor' ];
const EXCLUDED = [ '.agents/tasks' ];
const SKIPPED_DIRS = new Set([ 'node_modules', '.git', '.next' ]);

// A backtick path is checked only when anchored here, because an anchored path asserts one location while
// a bare `types/api.ts` names a kind of file that many directories legitimately have.
const ANCHORS = [ '.agents/', '.claude/', '.cursor/', '.github/', 'src/', 'tools/', 'deploy/', 'docs/', 'playwright/', 'vitest/', './' ];

const PATH_EXTENSIONS = /\.(?:md|mdc|mjs|json|jsonc|ya?ml|sh|tsx?)$/;

// `→` maps a template to its hypothetical output; `e.g.` marks its paths as examples. Neither asserts that
// the file exists, so lines carrying them are skipped rather than reported.
const ILLUSTRATIVE = /→|e\.g\./;

// A template file's whole purpose is paths that do not exist yet.
const isTemplate = (file) => /-template\.md$/.test(file);

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

    if (entry.isDirectory()) {
      if (!SKIPPED_DIRS.has(entry.name)) await collectMarkdown(rel, acc);
    } else if (/\.mdc?$/.test(entry.name) && !isTemplate(entry.name)) {
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

const isPlaceholder = (target) => /[<>{}*]|__/.test(target);

// Resolved against the file's realpath, so a symlinked entry point (.claude/CLAUDE.md → .agents/AGENTS.md)
// resolves its relative links from where the file really lives.
function resolves(realDir, target) {
  const clean = target.replace(/^\.\//, '');
  return [ path.resolve(realDir, clean), path.resolve(ROOT, clean) ].find((c) => existsSync(c));
}

async function checkFile(fileRel, failures) {
  const realDir = path.dirname(await realpath(path.join(ROOT, fileRel)));
  const lines = withoutFences(await readFile(path.join(ROOT, fileRel), 'utf8'));

  for (const [ index, rawLine ] of lines.entries()) {
    if (ILLUSTRATIVE.test(rawLine)) continue;

    const report = (target, reason) => failures.push({ file: fileRel, line: index + 1, target, reason });

    // Backtick paths anchored at a repo root. Collected first, then stripped, so an inline code span
    // holding a markdown-link example — `[Link Text](URL)` — is not read as a link.
    const spans = [ ...rawLine.matchAll(/`([^`]+)`/g) ].map((m) => m[1]);
    const line = rawLine.replace(/`[^`]+`/g, '');

    for (const target of spans) {
      if (/\s/.test(target) || isPlaceholder(target)) continue;
      if (!ANCHORS.some((a) => target.startsWith(a)) || !PATH_EXTENSIONS.test(target)) continue;
      if (!resolves(realDir, target)) report(target, 'path reference does not exist');
    }

    // Markdown links, with an optional heading anchor.
    for (const [ , target ] of line.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
      if (/^(?:https?:|mailto:|#)/.test(target) || isPlaceholder(target)) continue;

      const [ filePart, anchor ] = target.split('#');
      // A link with neither a slash nor a file extension is prose in brackets, not a path.
      if (!filePart.includes('/') && !PATH_EXTENSIONS.test(filePart)) continue;

      const resolved = resolves(realDir, filePart);
      if (!resolved) {
        report(target, 'link target does not exist');
      } else if (anchor && resolved.endsWith('.md')) {
        const slugs = await headingSlugs(resolved);
        if (!slugs.has(anchor.toLowerCase())) report(target, 'heading anchor not found in target');
      }
    }
  }
}

const files = (await Promise.all(ROOTS.map((r) => collectMarkdown(r)))).flat();
const failures = [];

for (const file of files) {
  await checkFile(file, failures);
}

if (failures.length > 0) {
  for (const { file, line, target, reason } of failures) {
    // eslint-disable-next-line no-console
    console.error(`${ file }:${ line } — ${ reason }: ${ target }`);
  }
  // eslint-disable-next-line no-console
  console.error(`\n${ failures.length } unresolved reference(s) across ${ files.length } file(s).`);
  process.exit(1);
}

// eslint-disable-next-line no-console
console.log(`Doc links: ${ files.length } files checked, every reference resolves.`);
