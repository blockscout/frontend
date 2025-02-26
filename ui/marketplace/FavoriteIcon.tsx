import type { HTMLChakraProps } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

interface Props extends HTMLChakraProps<'div'> {
  isFavorite: boolean;
};

const FavoriteIcon = ({ isFavorite, color, ...rest }: Props) => {
  const heartFilledColor = { _light: 'blue.600', _dark: 'blue.300' };
  const defaultColor = isFavorite ? heartFilledColor : (color || 'gray.400');

  return (
    <IconSvg
      name={ isFavorite ? 'heart_filled' : 'heart_outline' }
      color={ defaultColor }
      boxSize={ 5 }
      { ...rest }
    />
  );
};

export default FavoriteIcon;
