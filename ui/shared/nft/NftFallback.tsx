import { Icon, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

import nftIcon from 'icons/nft_shield.svg';

const NftFallback = ({ className }: {className?: string}) => {
  return (
    <Icon
      className={ className }
      as={ nftIcon }
      p="50px"
      color={ useColorModeValue('blackAlpha.500', 'whiteAlpha.500') }
      bgColor={ useColorModeValue('blackAlpha.50', 'whiteAlpha.50') }
    />
  );
};

export default chakra(NftFallback);
