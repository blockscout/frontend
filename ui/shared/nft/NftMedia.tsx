import { AspectRatio, chakra, Skeleton } from '@chakra-ui/react';
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
}

const NftMedia = ({ imageUrl, animationUrl, className }: Props) => {
  const [ type, setType ] = React.useState<MediaType | undefined>(!animationUrl ? 'image' : undefined);

  React.useEffect(() => {
    if (!animationUrl) {
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

    const url = route({ pathname: '/api/media-type', query: { url: animationUrl } });
    fetch(url)
      .then((response) => response.json())
      .then((_response) => {
        const response = _response as { type: MediaType | undefined };
        setType(response.type || 'image');
      })
      .catch(() => {
        setType('image');
      });

  }, [ animationUrl ]);

  if (!type) {
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
