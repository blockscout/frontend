import { FORCE_FULL_PATHS } from './config';

export type SelectionMode =
  { readonly kind: 'full'; readonly forcedBy: string } |
  { readonly kind: 'only-changed' };

function isForceFull(file: string): boolean {
  return FORCE_FULL_PATHS.some((entry) => entry.endsWith('/') ? file.startsWith(entry) : file === entry);
}

export function selectMode(changedFiles: ReadonlyArray<string>): SelectionMode {
  const forcedBy = changedFiles.find(isForceFull);
  return forcedBy === undefined ? { kind: 'only-changed' } : { kind: 'full', forcedBy };
}
