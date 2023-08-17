import { chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  src: string;
  onLoad: () => void;
  onError: () => void;
}

const NftHtml = ({ src, onLoad, onError }: Props) => {
  return (
    <chakra.iframe
      src={ src }
      sandbox="allow-scripts"
      onLoad={ onLoad }
      onError={ onError }
    />
  );
};

export default NftHtml;
