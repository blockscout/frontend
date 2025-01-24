import { chakra } from '@chakra-ui/react';
import { verifiedFetch } from '@helia/verified-fetch';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import config from 'configs/app';

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
      if (!config.UI.views.nft.verifiedFetch.isEnabled) {
        throw new Error('Helia verified fetch is disabled');
      }
      const imageUrl = typeof instance.metadata?.image === 'string' ? instance.metadata.image : undefined;
      if (!imageUrl) {
        throw new Error('No image URL found');
      }
      controller.current = new AbortController();
      const response = await verifiedFetch(imageUrl, { signal: controller.current.signal });
      const blob = await response.blob();
      const src = URL.createObjectURL(blob);
      ref.current.poster = src;

      // we want to call onLoad right after the poster is loaded
      // otherwise, the skeleton will be shown underneath the element until the video is loaded
      onLoad();
    } catch (error) {
      const src = instance.thumbnails?.['500x500'] || instance.thumbnails?.original || instance.image_url;
      if (src) {
        ref.current.poster = src;

        // we want to call onLoad right after the poster is loaded
        // otherwise, the skeleton will be shown underneath the element until the video is loaded
        const poster = new Image();
        poster.src = ref.current.poster;
        poster.onload = onLoad;
      }
    }
  }, [ instance.image_url, instance.metadata?.image, instance.thumbnails, onLoad ]);

  React.useEffect(() => {
    !autoPlay && fetchVideoPoster();
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
