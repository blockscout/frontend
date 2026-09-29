// SPDX-License-Identifier: LicenseRef-Blockscout

interface TagWithMeta {
  readonly meta?: { readonly hidden?: unknown } | null;
}

export function isHiddenTag(tag: TagWithMeta): boolean {
  return tag.meta?.hidden === 'true';
}
