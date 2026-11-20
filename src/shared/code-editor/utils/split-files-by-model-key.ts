// SPDX-License-Identifier: LicenseRef-Blockscout

import type { File } from '../types';

interface FilesByModelKey {
  readonly filesToCreate: Array<File>;
  readonly repeatedKeys: Array<string>;
}

export function splitFilesByModelKey(data: Array<File>, loadedModelKeys: Array<string>): FilesByModelKey {
  const [ firstFile, ...additionalFiles ] = data;
  // The first file never gets a model here: the editor component creates it from its own `path` prop.
  const seenKeys = new Set<string>(firstFile ? [ firstFile.key ] : undefined);
  const loadedKeys = new Set(loadedModelKeys);
  const filesToCreate: Array<File> = [];
  const repeatedKeys: Array<string> = [];

  for (const file of additionalFiles) {
    if (seenKeys.has(file.key)) {
      repeatedKeys.push(file.key);
      continue;
    }

    seenKeys.add(file.key);

    if (!loadedKeys.has(file.key)) {
      filesToCreate.push(file);
    }
  }

  return { filesToCreate, repeatedKeys };
}
