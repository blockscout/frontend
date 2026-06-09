// SPDX-License-Identifier: LicenseRef-Blockscout

import type { MetadataTag } from './types';
import type { UserTags } from 'src/slices/address/types/api';

export default function formatAccountTags(data: UserTags | undefined): Array<MetadataTag> {
  return [
    ...(data?.private_tags || []).map((tag) => ({ slug: tag.label, name: tag.display_name, tagType: 'private_tag' as const, ordinal: 1_000 })),
    ...(data?.watchlist_names || []).map((tag) => ({ slug: tag.label, name: tag.display_name, tagType: 'watchlist' as const, ordinal: 1_000 })),
  ];
}
