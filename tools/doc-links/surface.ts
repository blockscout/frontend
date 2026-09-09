// The instruction surface: which files the checker reads. The agent config directories are walked whole;
// a per-directory `CONTEXT.md` is picked out of the tracked-file list wherever in the repo it lives.
// Task specs are excluded — they describe files that do not exist yet by design.

import type { Dirent } from 'node:fs';
import { readdir, realpath } from 'node:fs/promises';
import path from 'node:path';

const ROOTS: ReadonlyArray<string> = [ '.agents', '.claude', '.cursor' ];
const EXCLUDED: ReadonlyArray<string> = [ '.agents/tasks', '.claude/worktrees' ];

const SKIPPED_DIRS = new Set([ 'node_modules', '.git', '.next' ]);

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
    } else if (/\.mdc?$/.test(entry.name)) {
      acc.push(rel);
    }
  }

  return acc;
}

export const contextFiles = (tracked: ReadonlyArray<string>): Array<string> =>
  tracked.filter((file) => path.basename(file) === 'CONTEXT.md');

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
  return dedupeByRealPath(root, [ ...walked, ...contextFiles(tracked) ]);
}
