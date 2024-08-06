import { chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import colors from 'theme/foundations/colors';
import IconSvg from 'ui/shared/IconSvg';

const TokenLogoPlaceholder = ({ className }: { className?: string }) => {
  const bgColor = useColorModeValue('gray.200', colors.grayTrue[600]);
  const color = useColorModeValue('gray.400', colors.grayTrue[200]);

  return (
    <IconSvg
      className={ className }
      fontWeight={ 600 }
      bgColor={ bgColor }
      color={ color }
      borderRadius="base"
      name="token-placeholder"
      transitionProperty="background-color,color"
      transitionDuration="normal"
      transitionTimingFunction="ease"
    />
  );
};

export default chakra(TokenLogoPlaceholder);
