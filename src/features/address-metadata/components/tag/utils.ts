// SPDX-License-Identifier: LicenseRef-Blockscout

import type { MetadataTag } from './types';

import { route } from 'src/server/routes';

import type { TMultichainContext } from 'src/features/multichain/context';

export function getTagLinkParams(
  data: MetadataTag,
  multichainContext?: TMultichainContext | null,
): { type: 'external' | 'internal'; href: string } | undefined {
  if (data.meta?.warpcastHandle) {
    return {
      type: 'external',
      href: `https://warpcast.com/${ data.meta.warpcastHandle }`,
    };
  }

  if (data.meta?.tagUrl) {
    return {
      type: 'external',
      href: data.meta.tagUrl,
    };
  }

  if (data.tagType === 'generic' || data.tagType === 'protocol') {
    return {
      type: 'internal',
      href: route({ pathname: '/accounts/label/[slug]', query: { slug: data.slug, tagType: data.tagType, tagName: data.name } }, multichainContext),
    };
  }
}

export function getTagName(data: MetadataTag, addressHash?: string) {
  if (data.tagType === 'name' && data.meta?.cexDeposit === 'true' && addressHash) {
    return `${ data.name } (${ addressHash.slice(0, 2 + 5) })`;
  }

  return data.name;
}
