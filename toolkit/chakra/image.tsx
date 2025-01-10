import type { ImageProps as ChakraImageProps } from '@chakra-ui/react';
import { Image as ChakraImage } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from './skeleton';

export interface ImageProps extends ChakraImageProps {
  fallback?: React.ReactNode;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  function Image(props, ref) {
    const { fallback, src, ...rest } = props;

    const [ loading, setLoading ] = React.useState(true);
    const [ error, setError ] = React.useState(false);

    const handleLoadError = React.useCallback(() => {
      setError(true);
      setLoading(false);
    }, []);

    const handleLoadSuccess = React.useCallback(() => {
      setLoading(false);
    }, []);

    if (!src && fallback) {
      return fallback;
    }

    if (error) {
      return fallback;
    }

    return (
      <Skeleton loading={ loading }>
        <ChakraImage
          ref={ ref }
          src={ src }
          onError={ handleLoadError }
          onLoad={ handleLoadSuccess }
          { ...rest }
        />
      </Skeleton>
    );
  });
