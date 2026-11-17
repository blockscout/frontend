// SPDX-License-Identifier: LicenseRef-Blockscout

import type { MetadataTagType } from 'src/features/address-metadata/components/tag/types';
import type { AddressMetadataTagType } from 'src/features/address-metadata/types/api';

export const SERVICE_TAG_TYPE = 'service' satisfies AddressMetadataTagType;

interface TagWithMeta {
  readonly tagType?: MetadataTagType;
  readonly meta?: { readonly hidden?: unknown } | null;
}

export function isHiddenTag(tag: TagWithMeta): boolean {
  return tag.tagType === SERVICE_TAG_TYPE || tag.meta?.hidden === 'true';
}
