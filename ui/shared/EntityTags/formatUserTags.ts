// SPDX-License-Identifier: LicenseRef-Blockscout

import type { EntityTag } from './types';
import type { UserTags } from 'client/slices/address/types/api';

export default function formatUserTags(data: UserTags | undefined): Array<EntityTag> {
  return [
    ...(data?.private_tags || []).map((tag) => ({ slug: tag.label, name: tag.display_name, tagType: 'private_tag' as const, ordinal: 1_000 })),
    ...(data?.watchlist_names || []).map((tag) => ({ slug: tag.label, name: tag.display_name, tagType: 'watchlist' as const, ordinal: 1_000 })),
  ];
}
