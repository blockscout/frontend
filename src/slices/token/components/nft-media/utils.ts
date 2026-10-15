// SPDX-License-Identifier: LicenseRef-Blockscout

import type { HTMLChakraProps } from '@chakra-ui/react';
import type React from 'react';

export type MediaType = 'image' | 'video' | 'html';
export type TransportType = 'http' | 'ipfs';

// Currently we have only 3 sizes:
//    sm = max-width<=30px
//    md = max-width<=250px
//    original
export type Size = 'sm' | 'md' | 'original';

export type MediaElementProps<As extends React.ElementType> = HTMLChakraProps<As> & {
  src: string;
  srcSet?: string;
  transport: TransportType;
  onLoad?: () => void;
  onError?: () => void;
  onClick?: () => void;
};

// https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
const IMAGE_EXTENSIONS = [
  '.jpg', 'jpeg', '.jfif', '.pjpeg', '.pjp',
  '.png', '.apng',
  '.avif',
  '.gif',
  '.svg',
  '.webp',
];

const VIDEO_EXTENSIONS = [
  '.mp4',
  '.webm',
  '.ogg',
];

export function getPreliminaryMediaType(url: string): MediaType | undefined {
  if (IMAGE_EXTENSIONS.some((ext) => url.endsWith(ext))) {
    return 'image';
  }

  if (url.startsWith('data:image')) {
    return 'image';
  }

  if (VIDEO_EXTENSIONS.some((ext) => url.endsWith(ext))) {
    return 'video';
  }
}

const NATIVE_IPFS_URI_REGEX = /^ipfs:\/\/(?:ipfs\/)?(.+)$/;
const GATEWAY_PATH_REGEX = /^\/ipfs\/(?:ipfs\/)?([^/]+)(\/.*)?$/;

function buildIpfsUri(cid: string, path: string, search: string): string {
  return `ipfs://${ cid }${ path === '/' ? '' : path }${ search }`;
}

// verified-fetch accepts only native URIs, but NFT metadata often links to the content through an HTTP gateway.
// IPNS names are left to the HTTP transport: resolving them needs delegated routing, which the CSP does not allow.
export function getIpfsUri(url: string): string | undefined {
  const nativeMatch = url.match(NATIVE_IPFS_URI_REGEX);
  if (nativeMatch) {
    return `ipfs://${ nativeMatch[1] }`;
  }

  if (!URL.canParse(url)) {
    return;
  }

  const { protocol, hostname, pathname, search } = new URL(url);
  if (protocol !== 'https:' && protocol !== 'http:') {
    return;
  }

  const [ subdomainCid, subdomainNamespace, ...gatewayHost ] = hostname.split('.');
  if (subdomainNamespace === 'ipfs' && gatewayHost.length > 0) {
    return buildIpfsUri(subdomainCid, pathname, search);
  }

  const pathMatch = pathname.match(GATEWAY_PATH_REGEX);
  if (pathMatch) {
    return buildIpfsUri(pathMatch[1], pathMatch[2] ?? '', search);
  }
}

export const mediaStyleProps = {
  transitionProperty: 'transform',
  transitionDuration: 'normal',
  transitionTimingFunction: 'ease',
  cursor: 'pointer',
  _hover: {
    base: {},
    lg: {
      transform: 'scale(1.2)',
    },
  },
};

export const videoPlayProps = {
  disablePictureInPicture: true,
  loop: true,
  muted: true,
  playsInline: true,
};
