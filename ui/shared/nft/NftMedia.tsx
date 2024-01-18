import { AspectRatio, chakra, Skeleton, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import NftFallback from './NftFallback';
import NftHtml from './NftHtml';
import NftHtmlFullscreen from './NftHtmlFullscreen';
import NftImage from './NftImage';
import NftImageFullscreen from './NftImageFullscreen';
import NftVideo from './NftVideo';
import NftVideoFullscreen from './NftVideoFullscreen';
import useNftMediaType from './useNftMediaType';
import { mediaStyleProps } from './utils';

interface Props {
  url: string | null;
  className?: string;
  isLoading?: boolean;
  withFullscreen?: boolean;
}

const NftMedia = ({ url, className, isLoading, withFullscreen }: Props) => {
  const [ isMediaLoading, setIsMediaLoading ] = React.useState(true);
  const [ isLoadingError, setIsLoadingError ] = React.useState(false);

  const { ref, inView } = useInView({ triggerOnce: true });

  const type = useNftMediaType(url, !isLoading && inView);

  React.useEffect(() => {
    if (!isLoading) {
      setIsMediaLoading(Boolean(url));
    }
  }, [ isLoading, url ]);

  const handleMediaLoaded = React.useCallback(() => {
    setIsMediaLoading(false);
  }, []);

  const handleMediaLoadError = React.useCallback(() => {
    setIsMediaLoading(false);
    setIsLoadingError(true);
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const content = (() => {
    if (!url || isLoadingError) {
      const styleProps = withFullscreen ? {} : mediaStyleProps;
      return <NftFallback { ...styleProps }/>;
    }

    const props = {
      src: url,
      onLoad: handleMediaLoaded,
      onError: handleMediaLoadError,
      ...(withFullscreen ? { onClick: onOpen } : {}),
    };

    switch (type) {
      case 'video':
        return <NftVideo { ...props }/>;
      case 'html':
        return <NftHtml { ...props }/>;
      case 'image':
        return <NftImage { ...props }/>;
      default:
        return null;
    }
  })();

  const modal = (() => {
    if (!url || !withFullscreen) {
      return null;
    }

    const props = {
      src: url,
      isOpen,
      onClose,
    };

    switch (type) {
      case 'video':
        return <NftVideoFullscreen { ...props }/>;
      case 'html':
        return <NftHtmlFullscreen { ...props }/>;
      case 'image':
        return <NftImageFullscreen { ...props }/>;
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
