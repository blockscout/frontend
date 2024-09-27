import type { IconProps } from '@chakra-ui/react';
import { Icon, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

// eslint-disable-next-line no-restricted-imports
import logoIcon from 'icons/networks/logo-placeholder.svg';

const ChartWatermarkIcon = (props: IconProps) => {
  const watermarkColor = useColorModeValue('link', 'white');
  return (
    <Icon
      { ...props }
      as={ logoIcon }
      position="absolute"
      opacity={ 0.1 }
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      pointerEvents="none"
      viewBox="0 0 114 20"
      color={ watermarkColor }
    />
  );
};

export default ChartWatermarkIcon;
