import { chakra } from '@chakra-ui/react';
import { verifiedFetch } from '@helia/verified-fetch';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import { mediaStyleProps, videoPlayProps } from './utils';

interface Props {
  src: string;
  instance: TokenInstance;
  autoPlay?: boolean;
  onLoad: () => void;
  onError: () => void;
  onClick?: () => void;
}

const NftVideo = ({ src, instance, autoPlay = true, onLoad, onError, onClick }: Props) => {
  const ref = React.useRef<HTMLVideoElement>(null);
  const controller = React.useRef<AbortController | null>(null);

  const fetchVideoPoster = React.useCallback(async() => {
    if (!ref.current) {
      return;
    }

    try {
      controller.current = new AbortController();
      const imageUrl = typeof instance.metadata?.image === 'string' ? instance.metadata.image : undefined;
      if (!imageUrl) {
        throw new Error('No image URL found');
      }
      const response = await verifiedFetch(imageUrl, { signal: controller.current.signal });
      const blob = await response.blob();
      const src = URL.createObjectURL(blob);
      ref.current.poster = src;
    } catch (error) {
      if (instance.image_url) {
        ref.current.poster = instance.image_url;
      }
    }
  }, [ instance.image_url, instance.metadata?.image ]);

  React.useEffect(() => {
    fetchVideoPoster();
    return () => {
      controller.current?.abort();
    };
  // run only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    !autoPlay && ref.current?.play();
  }, [ autoPlay ]);

  const handleMouseLeave = React.useCallback(() => {
    !autoPlay && ref.current?.pause();
  }, [ autoPlay ]);

  return (
    <chakra.video
      ref={ ref }
      { ...videoPlayProps }
      autoPlay={ autoPlay }
      src={ src }
      onCanPlayThrough={ onLoad }
      onError={ onError }
      borderRadius="md"
      onClick={ onClick }
      onMouseEnter={ handleMouseEnter }
      onMouseLeave={ handleMouseLeave }
      { ...mediaStyleProps }
    />
  );
};

export default chakra(NftVideo);
