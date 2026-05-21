// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressMetadataTagApi } from './api';

export interface AddressMetadataInfoFormatted {
  addresses: Record<string, {
    tags: Array<AddressMetadataTagFormatted>;
    reputation: number | null;
  }>;
}

export type AddressMetadataTagFormatted = AddressMetadataTagApi;
