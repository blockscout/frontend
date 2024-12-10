import { verifiedFetch } from '@helia/verified-fetch';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import type { StaticRoute } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';

import type { MediaType, SrcType } from './utils';
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

type ReturnType =
{
  src: string;
  mediaType: MediaType;
  srcType: SrcType;
} |
{
  mediaType: undefined;
} |
null;

export default function useNftMediaInfo({ data, isEnabled }: Params): ReturnType | null {

  const assetsData = composeAssetsData(data);
  const httpPrimaryQuery = useNftMediaTypeQuery(assetsData.http.animationUrl, isEnabled);
  const ipfsPrimaryQuery = useFetchAssetViaIpfs(
    assetsData.ipfs.animationUrl,
    httpPrimaryQuery.data?.mediaType,
    isEnabled && (httpPrimaryQuery.data === null || Boolean(httpPrimaryQuery.data?.mediaType)),
  );
  const httpSecondaryQuery = useNftMediaTypeQuery(assetsData.http.imageUrl, isEnabled && !httpPrimaryQuery.data && !ipfsPrimaryQuery);
  const ipfsSecondaryQuery = useFetchAssetViaIpfs(
    assetsData.ipfs.imageUrl,
    httpSecondaryQuery.data?.mediaType,
    isEnabled && (httpSecondaryQuery.data === null || Boolean(httpSecondaryQuery.data?.mediaType)),
  );

  return React.useMemo(() => {
    return ipfsPrimaryQuery || httpPrimaryQuery.data || ipfsSecondaryQuery || httpSecondaryQuery.data || null;
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

// As of now we fetch only images via IPFS because video streaming has performance issues
// Also, we don't want to store the entire file content in the ReactQuery cache, so we don't use useQuery hook here
function useFetchAssetViaIpfs(url: string | undefined, mediaType: MediaType | undefined, isEnabled: boolean): ReturnType | null {
  const [ result, setResult ] = React.useState<ReturnType | null>({ mediaType: undefined });
  const controller = React.useRef<AbortController | null>(null);

  const fetchAsset = React.useCallback(async(url: string) => {
    try {
      controller.current = new AbortController();
      const response = await verifiedFetch(url, { signal: controller.current.signal });
      if (response.status === 200) {
        const blob = await response.blob();
        const src = URL.createObjectURL(blob);
        setResult({ mediaType: 'image', src, srcType: 'blob' });
        return;
      }
    } catch (error) {}
    setResult(null);
  }, []);

  React.useEffect(() => {
    if (isEnabled) {
      if (config.UI.views.nft.verifiedFetch.isEnabled && mediaType === 'image' && url && url.includes('ipfs')) {
        fetchAsset(url);
      } else {
        setResult(null);
      }
    } else {
      setResult({ mediaType: undefined });
    }
  }, [ fetchAsset, url, mediaType, isEnabled ]);

  React.useEffect(() => {
    return () => {
      controller.current?.abort();
    };
  }, []);

  return result;
}

function useNftMediaTypeQuery(url: string | undefined, enabled: boolean) {
  const fetch = useFetch();

  return useQuery<ReturnType | null, ResourceError<unknown>, ReturnType | null>({
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
        return { mediaType: preliminaryType, src: url, srcType: 'url' };
      }

      const mediaType = await (async() => {
        try {
          const mediaTypeResourceUrl = route({ pathname: '/node-api/media-type' as StaticRoute<'/api/media-type'>['pathname'], query: { url } });
          const response = await fetch<{ type: MediaType | undefined }, ResourceError>(mediaTypeResourceUrl, undefined, { resource: 'media-type' });

          return 'type' in response ? response.type : undefined;
        } catch (error) {
          return;
        }
      })();

      if (!mediaType) {
        return null;
      }

      return { mediaType, src: url, srcType: 'url' };
    },
    enabled,
    placeholderData: { mediaType: undefined },
    staleTime: Infinity,
  });
}
