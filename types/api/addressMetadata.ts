export interface AddressMetadataInfo {
  addresses: Record<string, {
    tags: Array<AddressMetadataTag>;
    reputation: number | null;
  }>;
}

export type AddressMetadataTagType = 'name' | 'generic' | 'classifier' | 'information' | 'note' | 'protocol';

export interface AddressMetadataTag {
  slug: string;
  name: string;
  tagType: AddressMetadataTagType;
  ordinal: number;
  meta: string | null;
}
