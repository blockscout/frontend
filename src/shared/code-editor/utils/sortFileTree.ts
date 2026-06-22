// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FileTree } from '../types';

import { collator } from 'src/shared/texts/collator';

export default function sortFileTree(a: FileTree[number], b: FileTree[number]) {
  if ('children' in a && !('children' in b)) {
    return -1;
  }

  if ('children' in b && !('children' in a)) {
    return 1;
  }

  return collator.compare(a.name, b.name);
}
