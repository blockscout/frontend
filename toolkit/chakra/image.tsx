import type { BoxProps, ImageProps as ChakraImageProps } from '@chakra-ui/react';
import { Image as ChakraImage } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from './skeleton';

export interface ImageProps extends ChakraImageProps {
  fallback?: React.ReactNode;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  function Image(props, ref) {
    const { fallback, src, onLoad, onError, ...rest } = props;

    const [ loading, setLoading ] = React.useState(true);
    const [ error, setError ] = React.useState(false);

    const handleLoadError = React.useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
      setError(true);
      setLoading(false);
      onError?.(event);
    }, [ onError ]);

    const handleLoadSuccess = React.useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
      setLoading(false);
      onLoad?.(event);
    }, [ onLoad ]);

    if (!src && fallback) {
      return fallback;
    }

    if (error) {
      return fallback;
    }

    return (
      <>
        { loading && <Skeleton loading { ...rest as BoxProps }/> }
        <ChakraImage
          ref={ ref }
          src={ src }
          onError={ handleLoadError }
          onLoad={ handleLoadSuccess }
          { ...rest }
          display={ loading ? 'none' : rest.display || 'block' }
        />
      </>
    );
  },
);
