// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressMetadataTagType } from 'src/features/address-metadata/types/api';
import type { AddressMetadataTagFormatted } from 'src/features/address-metadata/types/client';

export type MetadataTagType = AddressMetadataTagType | 'custom' | 'watchlist' | 'private_tag';

export interface MetadataTag extends Pick<AddressMetadataTagFormatted, 'slug' | 'name' | 'ordinal'> {
  tagType: MetadataTagType;
  meta?: AddressMetadataTagFormatted['meta'];
}
