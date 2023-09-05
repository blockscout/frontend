import { AspectRatio, chakra, Skeleton } from '@chakra-ui/react';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import NftFallback from './NftFallback';
import NftHtml from './NftHtml';
import NftHtmlWithFullscreen from './NftHtmlWithFullscreen';
import NftImage from './NftImage';
import NftImageWithFullscreen from './NftImageWithFullscreen';
import NftVideo from './NftVideo';
import NftVideoWithFullscreen from './NftVideoWithFullscreen';
import useNftMediaType from './useNftMediaType';

interface Props {
  url: string | null;
  className?: string;
  isLoading?: boolean;
  withFullscreen?: boolean;
}

const NftMedia = ({ url, className, isLoading, withFullscreen }: Props) => {
  const [ isMediaLoading, setIsMediaLoading ] = React.useState(Boolean(url));
  const [ isLoadingError, setIsLoadingError ] = React.useState(false);

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

    const props = {
      src: url,
      onLoad: handleMediaLoaded,
      onError: handleMediaLoadError,
    };

    switch (type) {
      case 'video':
        return withFullscreen ? <NftVideoWithFullscreen { ...props }/> : <NftVideo { ...props }/>;
      case 'html':
        return withFullscreen ? <NftHtmlWithFullscreen { ...props }/> : <NftHtml { ...props }/>;
      case 'image':
        return withFullscreen ? <NftImageWithFullscreen { ...props }/> : <NftImage { ...props }/>;
      default:
        return null;
    }
  })();

  return (
    <AspectRatio
      ref={ ref }
      className={ className }
      ratio={ 1 / 1 }
      overflow="hidden"
      borderRadius="md"
      objectFit="contain"
      isolation="isolate"
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
