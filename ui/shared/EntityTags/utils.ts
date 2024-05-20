import type { EntityTag } from './types';

// import { route } from 'nextjs-routes';

export function getTagLinkParams(data: EntityTag): { type: 'external' | 'internal'; href: string } | undefined {
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

  // Uncomment this block when "Tag search" page is ready - issue #1869
//   if (data.tagType === 'generic' || data.tagType === 'protocol') {
//     return {
//         type: 'internal',
//         href: route({ pathname: '/' }),
//     };
//   }
}
