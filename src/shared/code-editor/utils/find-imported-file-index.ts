// SPDX-License-Identifier: LicenseRef-Blockscout

import type { File } from '../types';

import { stripLeadingSlash } from 'src/toolkit/utils/url';

import formatFilePath from './formatFilePath';
import getFullPathOfImportedFile from './getFullPathOfImportedFile';

// A relative import stays in the importing file's family, the way the Solidity compiler resolves it:
// `./contracts/A.sol` importing `./libraries/Tick.sol` gets `./contracts/libraries/Tick.sol`, not `contracts/libraries/Tick.sol`.
// The Solidity path-resolution rules - https://docs.soliditylang.org/en/latest/path-resolution.html
export function findImportedFileIndex(
  files: Array<File>,
  importingFile: File,
  importedFilePath: string,
  compilerRemappings?: Array<string>,
): number {
  const normalizedPath = getFullPathOfImportedFile(formatFilePath(importingFile.display_path), importedFilePath, compilerRemappings);

  if (!normalizedPath) {
    return -1;
  }

  if (importedFilePath[0] === '.') {
    const sameFamilyPath = getPathPrefix(importingFile.display_path) + stripLeadingSlash(normalizedPath);
    const sameFamilyIndex = files.findIndex((file) => file.display_path === sameFamilyPath);

    if (sameFamilyIndex > -1) {
      return sameFamilyIndex;
    }
  }

  return files.findIndex((file) => formatFilePath(file.display_path) === normalizedPath);
}

// The prefix that tells apart the paths sharing one normalized path: `./a.sol`, `/a.sol` and `a.sol`.
function getPathPrefix(path: string): string {
  if (path.startsWith('./')) {
    return './';
  }

  return path[0] === '/' ? '/' : '';
}
