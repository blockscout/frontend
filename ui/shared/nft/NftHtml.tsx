import { chakra, LinkOverlay } from '@chakra-ui/react';
import React from 'react';

interface Props {
  src: string;
  onLoad: () => void;
  onError: () => void;
  onClick?: () => void;
}

const NftHtml = ({ src, onLoad, onError, onClick }: Props) => {
  return (
    <LinkOverlay
      onClick={ onClick }
      cursor="pointer"
      transitionProperty="transform"
      transitionDuration="normal"
      transitionTimingFunction="ease"
      _hover={{
        transform: 'scale(1.2)',
      }}
    >
      <chakra.iframe
        src={ src }
        h="100%"
        w="100%"
        sandbox="allow-scripts"
        onLoad={ onLoad }
        onError={ onError }
      />
    </LinkOverlay>
  );
};

export default NftHtml;
