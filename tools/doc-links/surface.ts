// The instruction surface: which files the checker reads. The agent config directories are walked whole;
// a directory that carries a `CONTEXT.md` contributes every markdown file in and below it, so a directory
// documenting itself across several files is covered whole rather than through that one entry point.
// Task specs are excluded — they describe files that do not exist yet by design.

import type { Dirent } from 'node:fs';
import { readdir, realpath } from 'node:fs/promises';
import path from 'node:path';

const ROOTS: ReadonlyArray<string> = [ '.agents', '.claude', '.cursor' ];

const EXCLUDED: ReadonlyArray<string> = [ '.agents/tasks', '.claude/worktrees', 'src/toolkit/package' ];

const SKIPPED_DIRS = new Set([ 'node_modules', '.git', '.next' ]);

const MARKDOWN = /\.mdc?$/;

const isExcluded = (rel: string): boolean => EXCLUDED.some((ex) => rel === ex || rel.startsWith(`${ ex }/`));

export async function collectMarkdown(root: string, dir: string, acc: Array<string> = []): Promise<Array<string>> {
  let entries: Array<Dirent>;
  try {
    entries = await readdir(path.join(root, dir), { withFileTypes: true });
  } catch {
    return acc; // a root absent from this checkout is not an error
  }

  for (const entry of entries) {
    const rel = path.join(dir, entry.name);
    if (isExcluded(rel)) continue;

    // A symlinked directory (`.claude/skills` → `../.agents/skills`) is not a directory to `readdir`, so the
    // walk skips it — correctly, since the walk over `.agents` reaches those files by their real path.
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRS.has(entry.name)) await collectMarkdown(root, rel, acc);
    } else if (MARKDOWN.test(entry.name)) {
      acc.push(rel);
    }
  }

  return acc;
}

export const contextDirs = (tracked: ReadonlyArray<string>): Set<string> =>
  new Set(tracked.filter((file) => path.basename(file) === 'CONTEXT.md').map((file) => path.dirname(file)));

// Walking the ancestors rather than matching one level down is what makes a nested `adr/` or `docs/` count.
const isBelowContextDir = (file: string, dirs: ReadonlySet<string>): boolean => {
  for (let dir = path.dirname(file); dir !== '.'; dir = path.dirname(dir)) {
    if (SKIPPED_DIRS.has(path.basename(dir))) return false;
    if (dirs.has(dir)) return true;
  }
  return false;
};

// Every markdown file in and below a `CONTEXT.md` directory, taken from the tracked-file list the caller
// already has — an untracked or generated file is not part of the instruction surface.
export const contextSurface = (tracked: ReadonlyArray<string>): Array<string> => {
  const dirs = contextDirs(tracked);
  return tracked.filter((file) =>
    MARKDOWN.test(file) && !isExcluded(file) && isBelowContextDir(file, dirs));
};

// One entry per real file. `.cursor/rules/*.mdc` and `.claude/CLAUDE.md` are symlinks onto files the walk
// already reached under `.agents`, and checking a file twice reports each of its findings twice. First seen
// wins, so the path reported is the one the walk arrived at.
export async function dedupeByRealPath(root: string, relativePaths: ReadonlyArray<string>): Promise<Array<string>> {
  const seen = new Map<string, string>();
  for (const rel of relativePaths) {
    const real = await realpath(path.join(root, rel));
    if (!seen.has(real)) seen.set(real, rel);
  }
  return [ ...seen.values() ];
}

export async function collectSurface(root: string, tracked: ReadonlyArray<string>): Promise<Array<string>> {
  const walked = (await Promise.all(ROOTS.map((dir) => collectMarkdown(root, dir)))).flat();
  return dedupeByRealPath(root, [ ...walked, ...contextSurface(tracked) ]);
}
