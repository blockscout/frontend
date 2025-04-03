import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { ColorMode } from 'toolkit/chakra/color-mode';
import { Image } from 'toolkit/chakra/image';
import { Skeleton } from 'toolkit/chakra/skeleton';

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
  const skeleton = <Skeleton loading className={ [ className, colorMode === 'dark' ? 'dark' : undefined ].filter(Boolean).join(' ') } w="100%" h="100%"/>;

  const fallback = (() => {
    if (src && !isInvalid) {
      return skeleton;
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
