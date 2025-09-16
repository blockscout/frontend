import { chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

const TokenLogoPlaceholder = ({ className, iconName }: { className?: string; iconName?: IconName }) => {
  const bgColor = useColorModeValue('gray.200', 'gray.600');
  const color = useColorModeValue('gray.400', 'gray.200');

  return (
    <IconSvg
      className={ className }
      fontWeight={ 600 }
      bgColor={ bgColor }
      color={ color }
      borderRadius="base"
      name={ iconName || 'token-placeholder' }
      transitionProperty="background-color,color"
      transitionDuration="normal"
      transitionTimingFunction="ease"
    />
  );
};

export default chakra(TokenLogoPlaceholder);
