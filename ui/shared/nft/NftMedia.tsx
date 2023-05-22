import { AspectRatio, chakra, Skeleton } from '@chakra-ui/react';
import type { StaticRoute } from 'nextjs-routes';
import { route } from 'nextjs-routes';
import React from 'react';

import NftImage from './NftImage';
import NftVideo from './NftVideo';
import type { MediaType } from './utils';
import { getPreliminaryMediaType } from './utils';

interface Props {
  imageUrl: string | null;
  animationUrl: string | null;
  className?: string;
  isLoading?: boolean;
}

const NftMedia = ({ imageUrl, animationUrl, className, isLoading }: Props) => {
  const [ type, setType ] = React.useState<MediaType | undefined>(!animationUrl ? 'image' : undefined);

  React.useEffect(() => {
    if (!animationUrl || isLoading) {
      return;
    }

    // media could be either gif or video
    // so we pre-fetch the resources in order to get its content type
    // have to do it via Node.js due to strict CSP for connect-src
    // but in order not to abuse our server firstly we check file url extension
    // and if it is valid we will trust it and display corresponding media component

    const preliminaryType = getPreliminaryMediaType(animationUrl);

    if (preliminaryType) {
      setType(preliminaryType);
      return;
    }

    const url = route({ pathname: '/node-api/media-type' as StaticRoute<'/api/media-type'>['pathname'], query: { url: animationUrl } });
    fetch(url)
      .then((response) => response.json())
      .then((_data) => {
        const data = _data as { type: MediaType | undefined };
        setType(data.type || 'image');
      })
      .catch(() => {
        setType('image');
      });

  }, [ animationUrl, isLoading ]);

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

  if (animationUrl && type === 'video') {
    return <NftVideo className={ className } src={ animationUrl }/>;
  }

  return <NftImage className={ className } url={ animationUrl || imageUrl }/>;
};

export default chakra(NftMedia);
