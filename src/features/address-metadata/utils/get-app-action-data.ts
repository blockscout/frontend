// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressMetadataTagFormatted } from 'src/features/address-metadata/types/client';

import config from 'src/config';

export type AppActionData = NonNullable<AddressMetadataTagFormatted['meta']>;

export function getAppActionData(tags: Array<AddressMetadataTagFormatted> | undefined): AppActionData | null {
  const tag = tags?.find(({ tagType }) => tagType === 'protocol');
  if (tag?.meta?.appMarketplaceURL || (config.features.marketplace.isEnabled && tag?.meta?.appID)) {
    return tag.meta;
  }
  return null;
}
