// SPDX-License-Identifier: LicenseRef-Blockscout

import type { HTMLChakraProps } from '@chakra-ui/react';
import React from 'react';

import SpriteIcon from 'src/sprite/SpriteIcon';

interface Props extends HTMLChakraProps<'div'> {
  isFavorite: boolean;
};

const FavoriteIcon = ({ isFavorite, ...rest }: Props) => {
  return (
    <SpriteIcon
      name={ isFavorite ? 'heart_filled' : 'heart_outline' }
      { ...rest }
    />
  );
};

export default FavoriteIcon;
