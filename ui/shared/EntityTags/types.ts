import type { AddressMetadataTag, AddressMetadataTagType } from 'types/api/metadata';

export type EntityTagType = AddressMetadataTagType | 'custom' | 'watchlist' | 'private_tag';

export interface EntityTag extends Pick<AddressMetadataTag, 'slug' | 'name'> {
  tagType: EntityTagType;
  ordinal?: number;
  meta?: Record<string, unknown>;
}
