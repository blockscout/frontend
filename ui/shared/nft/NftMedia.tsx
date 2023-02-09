import { AspectRatio, chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';

import NftImage from './NftImage';
import NftVideo from './NftVideo';

interface Props {
  imageUrl: string | null;
  animationUrl: string | null;
  className?: string;
}

const NftMedia = ({ imageUrl, animationUrl, className }: Props) => {
  const [ type, setType ] = React.useState<'image' | 'video' | undefined>(!animationUrl ? 'image' : undefined);

  React.useEffect(() => {
    if (!animationUrl) {
      return;
    }

    // media could be either gif or video
    // so we pre-fetch the resources in order to get its content type
    fetch(animationUrl, { method: 'HEAD' })
      .then((response) => {
        const contentType = response.headers.get('content-type');
        setType(contentType?.startsWith('video') ? 'video' : 'image');
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
