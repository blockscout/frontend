import { useQuery } from '@tanstack/react-query';

import type { StaticRoute } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import useFetch from 'lib/hooks/useFetch';

import type { MediaType } from './utils';
import { getPreliminaryMediaType } from './utils';

export default function useNftMediaType(url: string | null, isEnabled: boolean) {

  const fetch = useFetch();

  const { data } = useQuery<unknown, ResourceError<unknown>, MediaType>({
    queryKey: [ 'nft-media-type', url ],
    queryFn: async() => {
      if (!url) {
        return 'image';
      }

      // media could be either image, gif, video or html-page
      // so we pre-fetch the resources in order to get its content type
      // have to do it via Node.js due to strict CSP for connect-src
      // but in order not to abuse our server firstly we check file url extension
      // and if it is valid we will trust it and display corresponding media component

      const preliminaryType = getPreliminaryMediaType(url);

      if (preliminaryType) {
        return preliminaryType;
      }

      try {
        const mediaTypeResourceUrl = route({ pathname: '/node-api/media-type' as StaticRoute<'/api/media-type'>['pathname'], query: { url } });
        const response = await fetch<{ type: MediaType | undefined }, ResourceError>(mediaTypeResourceUrl, undefined, { resource: 'media-type' });

        return 'type' in response ? response.type ?? 'image' : 'image';
      } catch (error) {
        return 'image';
      }
    },
    enabled: isEnabled && Boolean(url),
    staleTime: Infinity,
  });

  return data;
}
