import { AspectRatio, chakra, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import NftFallback from './NftFallback';
import NftHtml from './NftHtml';
import NftImage from './NftImage';
import NftVideo from './NftVideo';
import useNftMediaType from './useNftMediaType';

interface Props {
  url: string | null;
  className?: string;
  isLoading?: boolean;
}

const NftMedia = ({ url, className, isLoading }: Props) => {
  const [ isMediaLoading, setIsMediaLoading ] = React.useState(Boolean(url));
  const [ isLoadingError, setIsLoadingError ] = React.useState(false);

  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  const { ref, inView } = useInView({ triggerOnce: true });
  const type = useNftMediaType(url, !isLoading && inView);

  const handleMediaLoaded = React.useCallback(() => {
    setIsMediaLoading(false);
  }, []);

  const handleMediaLoadError = React.useCallback(() => {
    setIsMediaLoading(false);
    setIsLoadingError(true);
  }, []);

  const content = (() => {
    if (!url || isLoadingError) {
      return <NftFallback/>;
    }

    switch (type) {
      case 'video':
        return <NftVideo src={ url } onLoad={ handleMediaLoaded } onError={ handleMediaLoadError }/>;
      case 'html':
        return <NftHtml src={ url } onLoad={ handleMediaLoaded } onError={ handleMediaLoadError }/>;
      case 'image':
        return <NftImage url={ url } onLoad={ handleMediaLoaded } onError={ handleMediaLoadError }/>;
      default:
        return null;
    }
  })();

  return (
    <AspectRatio
      ref={ ref }
      className={ className }
      bgColor={ isLoading || isMediaLoading ? 'transparent' : bgColor }
      ratio={ 1 / 1 }
      overflow="hidden"
      borderRadius="md"
      objectFit="contain"
      sx={{
        '&>img, &>video': {
          objectFit: 'contain',
        },
      }}
    >
      <>
        { content }
        { isMediaLoading && <Skeleton position="absolute" left={ 0 } top={ 0 } w="100%" h="100%" zIndex="1"/> }
      </>
    </AspectRatio>
  );
};

export default chakra(NftMedia);
