import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { StaticRoute } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';

import type { MediaType } from './utils';
import { getPreliminaryMediaType } from './utils';

interface Params {
  imageUrl: string | null;
  animationUrl: string | null;
  isEnabled: boolean;
}

interface ReturnType {
  type: MediaType | undefined;
  url: string | null;
}

export default function useNftMediaInfo({ imageUrl, animationUrl, isEnabled }: Params): ReturnType | null {

  const primaryQuery = useNftMediaTypeQuery(animationUrl, isEnabled);
  const secondaryQuery = useNftMediaTypeQuery(imageUrl, isEnabled && !primaryQuery.isPending && !primaryQuery.data);

  return React.useMemo(() => {
    if (primaryQuery.isPending) {
      return {
        type: undefined,
        url: animationUrl,
      };
    }

    if (primaryQuery.data) {
      return primaryQuery.data;
    }

    if (secondaryQuery.isPending) {
      return {
        type: undefined,
        url: imageUrl,
      };
    }

    if (secondaryQuery.data) {
      return secondaryQuery.data;
    }

    return null;
  }, [ animationUrl, imageUrl, primaryQuery.data, primaryQuery.isPending, secondaryQuery.data, secondaryQuery.isPending ]);
}

function useNftMediaTypeQuery(url: string | null, enabled: boolean) {
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
        return { type: preliminaryType, url };
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

      return { type, url };
    },
    enabled,
    staleTime: Infinity,
  });
}
