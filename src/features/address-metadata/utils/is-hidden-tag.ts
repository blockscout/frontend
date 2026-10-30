// SPDX-License-Identifier: LicenseRef-Blockscout

export const SERVICE_TAG_TYPE = 'service';

interface TagWithMeta {
  readonly tagType?: string;
  readonly meta?: { readonly hidden?: unknown } | null;
}

export function isHiddenTag(tag: TagWithMeta): boolean {
  return tag.tagType === SERVICE_TAG_TYPE || tag.meta?.hidden === 'true';
}
