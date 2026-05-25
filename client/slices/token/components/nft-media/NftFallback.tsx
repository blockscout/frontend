// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'client/sprite/SpriteIcon';

const NftFallback = ({ className }: { className?: string }) => {
  return (
    <SpriteIcon
      className={ className }
      name="nft_shield"
      p="50px"
      color={{ _light: 'blackAlpha.500', _dark: 'whiteAlpha.500' }}
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }}
    />
  );
};

export default chakra(NftFallback);
