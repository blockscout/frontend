// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import type { schemas } from '@blockscout/api-types';

import config from 'src/config';

import type { MediaType, Size, TransportType } from './utils';
import { getPreliminaryMediaType } from './utils';

interface Params {
  data: schemas['TokenInstance'] | schemas['TokenInstanceInTokenInstancesList'];
  addressHash: string;
  size: Size;
  allowedTypes?: Array<MediaType>;
  field: 'animation_url' | 'image_url';
  isEnabled: boolean;
}

interface MediaInfo {
  src: string;
  srcSet?: string;
  mediaType: MediaType;
  transport: TransportType;
}

export default function useNftMediaInfo({ data, addressHash, size, allowedTypes, field, isEnabled }: Params): UseQueryResult<Array<MediaInfo> | null> {
  const url = data[field];
  const query = useQuery({
    queryKey: [ 'nft-media-info', addressHash, data.id, url, size, ...(allowedTypes ? allowedTypes : []) ],
    queryFn: async() => {
      const metadataField = field === 'animation_url' ? 'animation_url' : 'image';
      const mediaType = getMediaType(data, field);

      if (!mediaType || (allowedTypes ? !allowedTypes.includes(mediaType) : false)) {
        return null;
      }

      const cdnData = getCdnData(data, size, mediaType);
      const ipfsData = getIpfsData(data.metadata?.[metadataField], mediaType);

      return [
        cdnData,
        ipfsData,
        url ? { src: url, mediaType, transport: 'http' as const } : undefined,
      ].filter(Boolean);
    },
    enabled: isEnabled,
  });

  return query;
}

function getMediaType(
  data: schemas['TokenInstance'] | schemas['TokenInstanceInTokenInstancesList'],
  field: Params['field'],
): MediaType | undefined {
  const url = data[field];

  if (!url) {
    return;
  }

  // If the media_url is the same as the url, we can use the media_type field to determine the media type.
  if (url === data.media_url) {
    const mediaType = castMimeTypeToMediaType(data.media_type || undefined);
    if (mediaType) {
      return mediaType;
    }
  }

  // The URL extension is a cheap, reliable hint for the common media formats.
  const preliminaryType = getPreliminaryMediaType(url);

  if (preliminaryType) {
    return preliminaryType;
  }

  // For anything the extension can't resolve, the backend classifies the media type for us.
  // This replaces a server-side HEAD request the frontend used to make itself (see #3626).
  return field === 'animation_url' ? data.animation_media_type ?? undefined : data.image_media_type ?? undefined;
}

function castMimeTypeToMediaType(mimeType: string | undefined): MediaType | undefined {
  if (!mimeType) {
    return;
  }

  if (mimeType.startsWith('image/')) {
    return 'image';
  }

  if (mimeType.startsWith('video/')) {
    return 'video';
  }
}

function getCdnData(data: schemas['TokenInstance'] | schemas['TokenInstanceInTokenInstancesList'], size: Size, mediaType: MediaType): MediaInfo | undefined {
  // CDN is only used for images
  if (mediaType !== 'image') {
    return;
  }

  if (!data.thumbnails) {
    return;
  }

  switch (size) {
    case 'sm': {
      return {
        src: data.thumbnails['60x60'] || data.thumbnails['250x250'] || data.thumbnails['500x500'] || data.thumbnails['original'],
        // the smallest thumbnail is already greater than sm size by two times
        // so there is no need to pass srcSet
        srcSet: undefined,
        mediaType: 'image',
        transport: 'http',
      };
    }
    case 'md': {
      const srcSet = data.thumbnails['250x250'] && data.thumbnails['500x500'] ? `${ data.thumbnails['500x500'] } 2x` : undefined;
      const src = (srcSet ? data.thumbnails['250x250'] : undefined) || data.thumbnails['500x500'] || data.thumbnails.original;

      return {
        src,
        srcSet,
        mediaType: 'image',
        transport: 'http',
      };
    }
    default: {
      if (data.thumbnails.original) {
        return {
          src: data.thumbnails.original,
          mediaType: 'image',
          transport: 'http',
        };
      }
    }
  }
}

function getIpfsData(url: unknown, mediaType: MediaType): MediaInfo | undefined {
  if (!config.slices.token.nft.verifiedFetch.isEnabled) {
    return;
  }

  // Currently we only load images via IPFS
  if (mediaType !== 'image') {
    return;
  }

  if (typeof url !== 'string') {
    return;
  }

  if (!url.includes('ipfs')) {
    return;
  }

  return {
    src: url,
    mediaType,
    transport: 'ipfs',
  };
}
