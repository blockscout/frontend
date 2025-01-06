import { AspectRatio, chakra, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import type { TokenInstance } from 'types/api/token';

import Skeleton from 'ui/shared/chakra/Skeleton';

import NftFallback from './NftFallback';
import NftHtml from './NftHtml';
import NftHtmlFullscreen from './NftHtmlFullscreen';
import NftImage from './NftImage';
import NftImageFullscreen from './NftImageFullscreen';
import NftVideo from './NftVideo';
import NftVideoFullscreen from './NftVideoFullscreen';
import useNftMediaInfo from './useNftMediaInfo';
import { mediaStyleProps } from './utils';

interface Props {
  data: TokenInstance;
  className?: string;
  isLoading?: boolean;
  withFullscreen?: boolean;
  autoplayVideo?: boolean;
}

const NftMedia = ({ data, className, isLoading, withFullscreen, autoplayVideo }: Props) => {
  const [ isMediaLoading, setIsMediaLoading ] = React.useState(true);
  const [ isLoadingError, setIsLoadingError ] = React.useState(false);

  const { ref, inView } = useInView({ triggerOnce: true });

  const mediaInfo = useNftMediaInfo({ data, isEnabled: !isLoading && inView });

  React.useEffect(() => {
    if (!isLoading && !mediaInfo) {
      setIsMediaLoading(false);
      setIsLoadingError(true);
    }
  }, [ isLoading, mediaInfo ]);

  const handleMediaLoaded = React.useCallback(() => {
    setIsMediaLoading(false);
  }, []);

  const handleMediaLoadError = React.useCallback(() => {
    setIsMediaLoading(false);
    setIsLoadingError(true);
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const content = (() => {
    if (isLoading) {
      return null;
    }

    if (!mediaInfo || isLoadingError) {
      const styleProps = withFullscreen ? {} : mediaStyleProps;
      return <NftFallback { ...styleProps }/>;
    }

    const props = {
      onLoad: handleMediaLoaded,
      onError: handleMediaLoadError,
      ...(withFullscreen ? { onClick: onOpen } : {}),
    };

    switch (mediaInfo.mediaType) {
      case 'video': {
        return <NftVideo { ...props } src={ mediaInfo.src } autoPlay={ autoplayVideo } instance={ data }/>;
      }
      case 'html':
        return <NftHtml { ...props } src={ mediaInfo.src }/>;
      case 'image': {
        if (mediaInfo.srcType === 'url' && data.thumbnails) {
          const srcSet = data.thumbnails['250x250'] && data.thumbnails['500x500'] ? `${ data.thumbnails['500x500'] } 2x` : undefined;
          const src = (srcSet ? data.thumbnails['250x250'] : undefined) || data.thumbnails['500x500'] || data.thumbnails.original;
          if (src) {
            return <NftImage { ...props } src={ src } srcSet={ srcSet }/>;
          }
        }

        return <NftImage { ...props } src={ mediaInfo.src }/>;
      }
      default:
        return null;
    }
  })();

  const modal = (() => {
    if (!mediaInfo || !withFullscreen || isLoading) {
      return null;
    }

    const props = {
      isOpen,
      onClose,
    };

    switch (mediaInfo.mediaType) {
      case 'video':
        return <NftVideoFullscreen { ...props } src={ mediaInfo.src }/>;
      case 'html':
        return <NftHtmlFullscreen { ...props } src={ mediaInfo.src }/>;
      case 'image': {
        const src = mediaInfo.srcType === 'url' && data.thumbnails?.original ? data.thumbnails.original : mediaInfo.src;
        return <NftImageFullscreen { ...props } src={ src }/>;
      }
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
        { modal }
        { isMediaLoading && <Skeleton position="absolute" left={ 0 } top={ 0 } w="100%" h="100%" zIndex="1"/> }
      </>
    </AspectRatio>
  );
};

export default chakra(NftMedia);
