// SPDX-License-Identifier: LicenseRef-Blockscout

import type { File } from '../types';

import { collator } from 'src/shared/texts/collator';

import { stripLeadingSlash } from 'src/toolkit/utils/url';

import formatFilePath from './formatFilePath';

export interface FileListItem {
  readonly key: string;
  readonly name: string;
  readonly directory: string;
  readonly path: string;
}

interface Options {
  readonly hasRawPaths: boolean;
  readonly mainFile: string | undefined;
}

export function composeFileList(files: Array<File>, { hasRawPaths, mainFile }: Options): Array<FileListItem> {
  return files
    .toSorted((a, b) => Number(b.key === mainFile) - Number(a.key === mainFile) || compareByNormalizedPath(a, b))
    .map((file) => ({ key: file.key, ...splitDisplayPath(file.display_path, hasRawPaths) }));
}

export function splitDisplayPath(displayPath: string, hasRawPaths: boolean): Omit<FileListItem, 'key'> {
  const path = hasRawPaths ? displayPath : stripLeadingSlash(displayPath);
  const nameStart = path.lastIndexOf('/') + 1;

  return {
    name: path.slice(nameStart),
    directory: getDirectory(path, nameStart),
    path,
  };
}

function compareByNormalizedPath(a: File, b: File): number {
  return collator.compare(formatFilePath(a.display_path), formatFilePath(b.display_path)) || collator.compare(a.display_path, b.display_path);
}

function getDirectory(path: string, nameStart: number): string {
  if (nameStart === 1) {
    return '/';
  }

  return path.slice(0, Math.max(nameStart - 1, 0));
}
