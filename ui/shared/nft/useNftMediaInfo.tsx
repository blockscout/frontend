import { createVerifiedFetch } from '@helia/verified-fetch';
import { useQuery } from '@tanstack/react-query';
import filetype from 'magic-bytes.js';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import type { StaticRoute } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';

import type { MediaType } from './utils';
import { getPreliminaryMediaType } from './utils';

interface Params {
  data: TokenInstance;
  isEnabled: boolean;
}

interface AssetsData {
  imageUrl: string | undefined;
  animationUrl: string | undefined;
}

type TransportType = 'http' | 'ipfs';

interface ReturnType {
  type: MediaType | undefined;
  src: string | undefined;
}

export default function useNftMediaInfo({ data, isEnabled }: Params): ReturnType | null {

  const assetsData = composeAssetsData(data);
  const ipfsPrimaryQuery = useFetchViaIpfs(assetsData.ipfs.animationUrl, isEnabled);
  const ipfsSecondaryQuery = useFetchViaIpfs(assetsData.ipfs.imageUrl, isEnabled && !ipfsPrimaryQuery);
  const httpPrimaryQuery = useNftMediaTypeQuery(assetsData.http.animationUrl, isEnabled && !ipfsSecondaryQuery);
  const httpSecondaryQuery = useNftMediaTypeQuery(assetsData.http.imageUrl, isEnabled && !httpPrimaryQuery.data);

  return React.useMemo(() => {
    return ipfsPrimaryQuery || ipfsSecondaryQuery || httpPrimaryQuery.data || httpSecondaryQuery.data || null;
  }, [ httpPrimaryQuery.data, httpSecondaryQuery.data, ipfsPrimaryQuery, ipfsSecondaryQuery ]);
}

function composeAssetsData(data: TokenInstance): Record<TransportType, AssetsData> {
  return {
    http: {
      imageUrl: data.image_url || undefined,
      animationUrl: data.animation_url || undefined,
    },
    ipfs: {
      imageUrl: typeof data.metadata?.image === 'string' ? data.metadata.image : undefined,
      animationUrl: typeof data.metadata?.animation_url === 'string' ? data.metadata.animation_url : undefined,
    },
  };
}

async function ipfsFetch() {
  return createVerifiedFetch(undefined, {
    contentTypeParser: async(bytes) => {
      const result = filetype(bytes);
      return result[0]?.mime;
    },
  });
}

function mapContentTypeToMediaType(contentType: string | null) {
  if (!contentType) {
    return;
  }

  if (contentType.includes('image')) {
    return 'image';
  }

  if (contentType.includes('video')) {
    return 'video';
  }
}

function useFetchViaIpfs(url: string | undefined, isEnabled: boolean): ReturnType | null {
  const [ result, setResult ] = React.useState<ReturnType | null>({ src: url, type: undefined });

  const fetchAsset = React.useCallback(async(url: string) => {
    try {
      const response = await (await ipfsFetch())(url);
      const contentType = response.headers.get('content-type');
      const mediaType = mapContentTypeToMediaType(contentType);
      if (mediaType) {
        const blob = await response.blob();
        const src = URL.createObjectURL(blob);
        setResult({ type: mediaType, src });
        return;
      }
    } catch (error) {}
    setResult(null);
  }, []);

  React.useEffect(() => {
    if (isEnabled) {
      url && url.includes('ipfs') ? fetchAsset(url) : setResult(null);
    } else {
      setResult({ src: url, type: undefined });
    }
  }, [ fetchAsset, url, isEnabled ]);

  return result;
}

function useNftMediaTypeQuery(url: string | undefined, enabled: boolean) {
  const fetch = useFetch();

  return useQuery<unknown, ResourceError<unknown>, ReturnType | null>({
    queryKey: [ 'nft-media-type', url ],
    queryFn: async() => {
      if (!url) {
        return null;
      }

      // media could be either image, gif, video or html-page
      // so we pre-fetch the resources in order to get its content type
      // have to do it via Node.js due to strict CSP for connect-src
      // but in order not to abuse our server firstly we check file url extension
      // and if it is valid we will trust it and display corresponding media component

      const preliminaryType = getPreliminaryMediaType(url);

      if (preliminaryType) {
        return { type: preliminaryType, src: url };
      }

      const type = await (async() => {
        try {
          const mediaTypeResourceUrl = route({ pathname: '/node-api/media-type' as StaticRoute<'/api/media-type'>['pathname'], query: { url } });
          const response = await fetch<{ type: MediaType | undefined }, ResourceError>(mediaTypeResourceUrl, undefined, { resource: 'media-type' });

          return 'type' in response ? response.type : undefined;
        } catch (error) {
          return;
        }
      })();

      if (!type) {
        return null;
      }

      return { type, src: url };
    },
    enabled,
    placeholderData: { type: undefined, src: url },
    staleTime: Infinity,
  });
}
