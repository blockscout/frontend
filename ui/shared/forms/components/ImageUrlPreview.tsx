import type { ColorMode } from '@chakra-ui/react';
import { Image, Skeleton, chakra, DarkMode } from '@chakra-ui/react';
import React from 'react';

interface Props {
  src: string | undefined;
  onLoad?: () => void;
  onError?: () => void;
  isInvalid: boolean;
  className?: string;
  fallback: React.ReactElement;
  colorMode?: ColorMode;
}

const ImageUrlPreview = ({
  src,
  isInvalid,
  onError,
  onLoad,
  className,
  fallback: fallbackProp,
  colorMode,
}: Props) => {
  const skeleton = <Skeleton className={ className } w="100%" h="100%"/>;

  const fallback = (() => {
    if (src && !isInvalid) {
      return colorMode === 'dark' ? <DarkMode>{ skeleton }</DarkMode> : skeleton;
    }
    return fallbackProp;
  })();

  return (
    <Image
      className={ className }
      src={ src }
      alt="Image preview"
      w="auto"
      h="100%"
      fallback={ fallback }
      onError={ onError }
      onLoad={ onLoad }
    />
  );
};

export default chakra(React.memo(ImageUrlPreview));
