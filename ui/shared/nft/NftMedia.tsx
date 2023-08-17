import { AspectRatio, chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { StaticRoute } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import useFetch from 'lib/hooks/useFetch';

import NftFallback from './NftFallback';
import NftImage from './NftImage';
import NftVideo from './NftVideo';
import type { MediaType } from './utils';
import { getPreliminaryMediaType } from './utils';

interface Props {
  url: string | null;
  className?: string;
  isLoading?: boolean;
}

const NftMedia = ({ url, className, isLoading }: Props) => {
  const [ type, setType ] = React.useState<MediaType | undefined>();
  const fetch = useFetch();

  React.useEffect(() => {
    if (!url || isLoading) {
      return;
    }

    // media could be either image, gif or video
    // so we pre-fetch the resources in order to get its content type
    // have to do it via Node.js due to strict CSP for connect-src
    // but in order not to abuse our server firstly we check file url extension
    // and if it is valid we will trust it and display corresponding media component

    const preliminaryType = getPreliminaryMediaType(url);

    if (preliminaryType) {
      setType(preliminaryType);
      return;
    }

    const mediaTypeResourceUrl = route({ pathname: '/node-api/media-type' as StaticRoute<'/api/media-type'>['pathname'], query: { url } });
    fetch(mediaTypeResourceUrl)
      .then((_data) => {
        const data = _data as { type: MediaType | undefined };
        setType(data.type || 'image');
      })
      .catch(() => {
        setType('image');
      });

  }, [ url, isLoading, fetch ]);

  if (!type || isLoading) {
    return (
      <AspectRatio
        className={ className }
        ratio={ 1 / 1 }
        overflow="hidden"
        borderRadius="md"
      >
        <Skeleton/>
      </AspectRatio>
    );
  }

  if (!url) {
    return <NftFallback className={ className }/>;
  }

  if (type === 'video') {
    return <NftVideo className={ className } src={ url }/>;
  }

  return <NftImage className={ className } url={ url }/>;
};

export default chakra(NftMedia);
