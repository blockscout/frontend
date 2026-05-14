// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressMetadataTagType } from 'client/features/address-metadata/types/api';
import type { AddressMetadataTagFormatted } from 'client/features/address-metadata/types/view';

export type EntityTagType = AddressMetadataTagType | 'custom' | 'watchlist' | 'private_tag';

export interface EntityTag extends Pick<AddressMetadataTagFormatted, 'slug' | 'name' | 'ordinal'> {
  tagType: EntityTagType;
  meta?: AddressMetadataTagFormatted['meta'];
}
