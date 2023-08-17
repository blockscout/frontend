import { Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import nftIcon from 'icons/nft_shield.svg';

interface Props {
  className?: string;
}

const NftFallback = ({ className }: Props) => {
  return (
    <Icon
      className={ className }
      as={ nftIcon }
      p="50px"
      color={ useColorModeValue('blackAlpha.500', 'whiteAlpha.500') }
    />
  );
};

export default NftFallback;
