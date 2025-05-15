import type { IconProps } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import React from 'react';

// eslint-disable-next-line no-restricted-imports
import logoIcon from 'icons/networks/logo-placeholder.svg';

const ChartWatermarkIcon = (props: IconProps) => {
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
      color={{ _light: 'link', _dark: 'white' }}
    />
  );
};

export default ChartWatermarkIcon;
