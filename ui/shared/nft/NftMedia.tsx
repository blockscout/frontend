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

    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', animationUrl, true);

    xhr.onload = function() {
      const contentType = xhr.getResponseHeader('Content-Type');
      setType(contentType?.startsWith('video') ? 'video' : 'image');
    };

    xhr.send();

    return () => {
      xhr.abort();
    };
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
