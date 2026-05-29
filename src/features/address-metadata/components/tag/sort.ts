// SPDX-License-Identifier: LicenseRef-Blockscout

import type { MetadataTag } from './types';

export default function sortTags(tagA: MetadataTag, tagB: MetadataTag): number {
  if (tagA.ordinal < tagB.ordinal) {
    return 1;
  }

  if (tagA.ordinal > tagB.ordinal) {
    return -1;
  }

  return 0;
}
