// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import type { schemas } from '@blockscout/api-types';

import useApiFetch from 'src/api/hooks/useApiFetch';
import { getResourceKey } from 'src/api/hooks/useApiQuery';
import type { ResourcePayload } from 'src/api/resources';

import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';

import type { MediaType, Size, TransportType } from './utils';
import { getIpfsUri, getPreliminaryMediaType } from './utils';

type MediaTypes = ResourcePayload<'core:token_instance_media_type'>;

interface Params {
  data: schemas['TokenInstance'] | schemas['TokenInstanceInTokenInstancesList'];
  addressHash: string;
  size: Size;
  allowedTypes?: Array<MediaType>;
  field: 'animation_url' | 'image_url';
  isEnabled: boolean;
}

const MEDIA_TYPE_FIELDS = {
  animation_url: 'animation_media_type',
  image_url: 'image_media_type',
} as const;

interface MediaInfo {
  src: string;
  srcSet?: string;
  mediaType: MediaType;
  transport: TransportType;
}

export default function useNftMediaInfo({ data, addressHash, size, allowedTypes, field, isEnabled }: Params): UseQueryResult<Array<MediaInfo> | null> {
  const queryClient = useQueryClient();
  const apiFetch = useApiFetch();
  const multichainContext = useMultichainContext();
  const chain = multichainContext?.chain;

  const url = data[field];
  const metadataField = field === 'animation_url' ? 'animation_url' : 'image';

  const fetchMediaTypes = (): Promise<MediaTypes> => {
    const pathParams = { hash: addressHash, id: data.id };
    return queryClient.fetchQuery({
      queryKey: getResourceKey('core:token_instance_media_type', { pathParams, chainId: chain?.id }),
      queryFn: () => apiFetch('core:token_instance_media_type', { pathParams, chain }) as Promise<MediaTypes>,
      staleTime: Infinity,
    });
  };

  const query = useQuery({
    queryKey: [
      'nft-media-info',
      chain?.id,
      addressHash,
      data.id,
      field,
      url,
      data.media_url,
      data.media_type,
      data[MEDIA_TYPE_FIELDS[field]],
      data.thumbnails,
      data.metadata?.[metadataField],
      size,
      ...(allowedTypes ? allowedTypes : []),
    ],
    queryFn: async() => {
      const mediaType = await getMediaType(data, field, fetchMediaTypes);

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

async function getMediaType(
  data: schemas['TokenInstance'] | schemas['TokenInstanceInTokenInstancesList'],
  field: Params['field'],
  fetchMediaTypes: () => Promise<MediaTypes>,
): Promise<MediaType | undefined> {
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

  const preliminaryType = getPreliminaryMediaType(url);

  if (preliminaryType) {
    return preliminaryType;
  }

  const mediaTypeField = MEDIA_TYPE_FIELDS[field];
  const storedMediaType = data[mediaTypeField];

  if (storedMediaType) {
    return storedMediaType;
  }

  try {
    const mediaTypes = await fetchMediaTypes();
    return mediaTypes[mediaTypeField] ?? undefined;
  } catch {
    return;
  }
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

  const ipfsUri = getIpfsUri(url);
  if (!ipfsUri) {
    return;
  }

  return {
    src: ipfsUri,
    mediaType,
    transport: 'ipfs',
  };
}
