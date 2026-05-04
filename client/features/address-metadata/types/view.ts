import type { AddressMetadataTagApi } from 'client/features/address-metadata/types/api';

export interface AddressMetadataInfoFormatted {
  addresses: Record<string, {
    tags: Array<AddressMetadataTagFormatted>;
    reputation: number | null;
  }>;
}

export type AddressMetadataTagFormatted = AddressMetadataTagApi;
