import { AspectRatio, chakra, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import type { TokenInstance } from 'types/api/token';

import Skeleton from 'ui/shared/chakra/Skeleton';

import NftFallback from './NftFallback';
import NftHtml from './NftHtml';
import NftImage from './NftImage';
import NftMediaFullscreenModal from './NftMediaFullscreenModal';
import NftVideo from './NftVideo';
import useNftMediaInfo from './useNftMediaInfo';
import type { MediaType, Size } from './utils';
import { mediaStyleProps } from './utils';

interface Props {
  data: TokenInstance;
  size?: Size;
  allowedTypes?: Array<MediaType>;
  className?: string;
  isLoading?: boolean;
  withFullscreen?: boolean;
  autoplayVideo?: boolean;
  fallback?: React.ReactNode;
}

const NftMedia = ({ data, size = 'original', allowedTypes, className, isLoading, withFullscreen, autoplayVideo, fallback }: Props) => {
  const [ isMediaLoading, setIsMediaLoading ] = React.useState(true);
  const [ isMediaLoadingError, setIsMediaLoadingError ] = React.useState(false);
  const [ mediaInfoIndex, setMediaInfoIndex ] = React.useState(0);
  const [ mediaInfoField, setMediaInfoField ] = React.useState<'animation_url' | 'image_url'>('animation_url');

  const { ref, inView } = useInView({ triggerOnce: true });

  const mediaInfoQuery = useNftMediaInfo({ data, size, allowedTypes, field: mediaInfoField, isEnabled: !isLoading && inView });

  React.useEffect(() => {
    if (!mediaInfoQuery.isPending && !mediaInfoQuery.data) {
      if (mediaInfoField === 'animation_url') {
        setMediaInfoField('image_url');
      } else {
        setIsMediaLoadingError(true);
        setIsMediaLoading(false);
      }
    }
  }, [ mediaInfoQuery.isPending, mediaInfoQuery.data, mediaInfoField ]);

  const handleMediaLoaded = React.useCallback(() => {
    setIsMediaLoading(false);
  }, []);

  const handleMediaLoadError = React.useCallback(() => {
    if (mediaInfoQuery.data) {
      if (mediaInfoIndex < mediaInfoQuery.data.length - 1) {
        setMediaInfoIndex(mediaInfoIndex + 1);
        return;
      } else if (mediaInfoField === 'animation_url') {
        setMediaInfoField('image_url');
        setMediaInfoIndex(0);
        return;
      }
    }

    setIsMediaLoading(false);
    setIsMediaLoadingError(true);
  }, [ mediaInfoField, mediaInfoIndex, mediaInfoQuery.data ]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const content = (() => {
    if (isLoading) {
      return null;
    }

    if (isMediaLoadingError) {
      const styleProps = withFullscreen ? {} : mediaStyleProps;
      return fallback ?? <NftFallback { ...styleProps }/>;
    }

    const mediaInfo = mediaInfoQuery.data?.[mediaInfoIndex];
    const props = {
      onLoad: handleMediaLoaded,
      onError: handleMediaLoadError,
      ...(withFullscreen ? { onClick: onOpen } : {}),
      ...(size !== 'sm' ? mediaStyleProps : {}),
    };

    switch (mediaInfo?.mediaType) {
      case 'video': {
        return <NftVideo { ...props } src={ mediaInfo.src } transport={ mediaInfo.transport } autoPlay={ autoplayVideo } instance={ data }/>;
      }
      case 'html':
        return <NftHtml { ...props } src={ mediaInfo.src } transport={ mediaInfo.transport }/>;
      case 'image': {
        return <NftImage { ...props } src={ mediaInfo.src } srcSet={ mediaInfo.srcSet } transport={ mediaInfo.transport }/>;
      }
      default:
        return null;
    }
  })();

  return (
    <>
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
      { isOpen && (
        <NftMediaFullscreenModal isOpen={ isOpen } onClose={ onClose } data={ data } allowedTypes={ allowedTypes } field={ mediaInfoField }/>
      ) }
    </>
  );
};

export default chakra(React.memo(NftMedia));
