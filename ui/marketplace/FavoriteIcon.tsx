import { useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

type Props = {
  isFavorite: boolean;
  color?: string;
};

const FavoriteIcon = ({ isFavorite, color }: Props) => {
  const heartFilledColor = useColorModeValue('blue.600', 'blue.300');
  const defaultColor = isFavorite ? heartFilledColor : (color || 'gray.400');

  return (
    <IconSvg
      name={ isFavorite ? 'heart_filled' : 'heart_outline' }
      color={ defaultColor }
      boxSize={ 5 }
    />
  );
};

export default FavoriteIcon;
