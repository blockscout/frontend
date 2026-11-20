// SPDX-License-Identifier: LicenseRef-Blockscout

import { countBy } from 'es-toolkit';

import type { File } from '../types';

import { splitDisplayPath } from './compose-file-list';

export function getDirectoriesOfSameNameFiles(files: Array<Pick<File, 'key' | 'display_path'>>, hasRawPaths: boolean): Map<string, string> {
  const items = files.map((file) => ({ key: file.key, ...splitDisplayPath(file.display_path, hasRawPaths) }));
  const countByName = countBy(items, (item) => item.name);

  return new Map(
    items
      .filter((item) => countByName[item.name] > 1)
      .map((item) => [ item.key, item.directory ]),
  );
}
