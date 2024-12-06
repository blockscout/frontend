import { verifiedFetch } from '@helia/verified-fetch';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import type { StaticRoute } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import config from 'configs/app';
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

type ReturnType =
{
  type: MediaType;
  src: string;
} |
{
  type: undefined;
} |
null;

export default function useNftMediaInfo({ data, isEnabled }: Params): ReturnType | null {

  const assetsData = composeAssetsData(data);
  const httpPrimaryQuery = useNftMediaTypeQuery(assetsData.http.animationUrl, isEnabled);
  const ipfsPrimaryQuery = useFetchAssetViaIpfs(
    assetsData.ipfs.animationUrl,
    httpPrimaryQuery.data?.type,
    isEnabled && (httpPrimaryQuery.data === null || Boolean(httpPrimaryQuery.data?.type)),
  );
  const httpSecondaryQuery = useNftMediaTypeQuery(assetsData.http.imageUrl, isEnabled && !httpPrimaryQuery.data && !ipfsPrimaryQuery);
  const ipfsSecondaryQuery = useFetchAssetViaIpfs(
    assetsData.ipfs.imageUrl,
    httpSecondaryQuery.data?.type,
    isEnabled && (httpSecondaryQuery.data === null || Boolean(httpSecondaryQuery.data?.type)),
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
function useFetchAssetViaIpfs(url: string | undefined, type: MediaType | undefined, isEnabled: boolean): ReturnType | null {
  const [ result, setResult ] = React.useState<ReturnType | null>({ type: undefined });
  const controller = React.useRef<AbortController | null>(null);

  const fetchAsset = React.useCallback(async(url: string) => {
    try {
      controller.current = new AbortController();
      const response = await verifiedFetch(url, { signal: controller.current.signal });
      if (response.status === 200) {
        const blob = await response.blob();
        const src = URL.createObjectURL(blob);
        setResult({ type: 'image', src });
        return;
      }
    } catch (error) {}
    setResult(null);
  }, []);

  React.useEffect(() => {
    if (isEnabled) {
      if (config.UI.views.nft.verifiedFetch.isEnabled && type === 'image' && url && url.includes('ipfs')) {
        fetchAsset(url);
      } else {
        setResult(null);
      }
    } else {
      setResult({ type: undefined });
    }
  }, [ fetchAsset, url, type, isEnabled ]);

  React.useEffect(() => {
    return () => {
      controller.current?.abort();
    };
  }, []);

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
    placeholderData: { type: undefined },
    staleTime: Infinity,
  });
}
