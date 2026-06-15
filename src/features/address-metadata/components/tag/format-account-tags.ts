// SPDX-License-Identifier: LicenseRef-Blockscout

import type { MetadataTag } from './types';
import type { schemas } from '@blockscout/api-types';

export default function formatAccountTags(data: Partial<schemas['AddressResponse']> | undefined): Array<MetadataTag> {
  return [
    ...(data?.private_tags || []).map((tag) => ({ slug: tag.label, name: tag.display_name, tagType: 'private_tag' as const, ordinal: 1_000, meta: null })),
    ...(data?.watchlist_names || []).map((tag) => ({ slug: tag.label, name: tag.display_name, tagType: 'watchlist' as const, ordinal: 1_000, meta: null })),
  ];
}
