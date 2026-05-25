// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'client/sprite/SpriteIcon';

const TokenIconPlaceholder = (props: BoxProps) => {
  return (
    <SpriteIcon
      fontWeight={ 600 }
      bgColor={{ _light: 'gray.200', _dark: 'gray.600' }}
      color={{ _light: 'gray.400', _dark: 'gray.200' }}
      borderRadius="base"
      name="token-placeholder"
      transitionProperty="background-color,color"
      transitionDuration="normal"
      transitionTimingFunction="ease"
      { ...props }
    />
  );
};

export default TokenIconPlaceholder;
