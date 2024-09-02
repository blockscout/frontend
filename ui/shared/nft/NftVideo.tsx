import { chakra } from '@chakra-ui/react';
import React from 'react';

import { mediaStyleProps, videoPlayProps } from './utils';

interface Props {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  onLoad: () => void;
  onError: () => void;
  onClick?: () => void;
}

const NftVideo = ({ src, poster, autoPlay = true, onLoad, onError, onClick }: Props) => {
  const ref = React.useRef<HTMLVideoElement>(null);

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
      poster={ poster }
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
