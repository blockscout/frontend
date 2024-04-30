import type { AddressMetadataTagType } from 'types/api/addressMetadata';

export interface AddressMetadataInfoFormatted {
  addresses: Record<string, {
    tags: Array<AddressMetadataTagFormatted>;
    reputation: number | null;
  }>;
}

export interface AddressMetadataTagFormatted {
  slug: string;
  name: string;
  tagType: AddressMetadataTagType;
  ordinal: number;
  meta: {
    textColor?: string;
    bgColor?: string;
    actionURL?: string;
  } | null;
}
