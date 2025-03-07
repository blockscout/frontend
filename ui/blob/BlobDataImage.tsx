import { Image, Center, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  src: string;
}

const BlobDataImage = ({ src }: Props) => {
  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Center
      bgColor={ bgColor }
      p={ 4 }
      minH="200px"
      w="100%"
      borderRadius="md"
    >
      <Image
        src={ src }
        objectFit="contain"
        maxW="100%"
        maxH="100%"
        objectPosition="center"
        alt="Blob image representation"
      />
    </Center>
  );
};

export default React.memo(BlobDataImage);
