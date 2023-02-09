import { AspectRatio, Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  className?: string;
  src: string;
}

const NftVideo = ({ className, src }: Props) => {
  const [ isLoading, setIsLoading ] = React.useState(true);

  const handleCanPlay = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <AspectRatio
      className={ className }
      ratio={ 1 / 1 }
      overflow="hidden"
      borderRadius="md"
    >
      <>
        <chakra.video
          src={ src }
          autoPlay
          disablePictureInPicture
          loop
          muted
          playsInline
          onCanPlayThrough={ handleCanPlay }
          borderRadius="md"
        />
        { isLoading && <Skeleton position="absolute" w="100%" h="100%" left={ 0 } top={ 0 }/> }
      </>
    </AspectRatio>
  );
};

export default chakra(NftVideo);
