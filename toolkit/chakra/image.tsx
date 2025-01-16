/* eslint-disable no-restricted-imports */
import type { BoxProps, ImageProps as ChakraImageProps } from '@chakra-ui/react';
import { Image as ChakraImage } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from './skeleton';

export interface ImageProps extends ChakraImageProps {
  fallback?: React.ReactNode;
  containerProps?: BoxProps;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  function Image(props, ref) {
    const { fallback, src, containerProps, ...rest } = props;

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
      <Skeleton loading={ loading } { ...containerProps }>
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
