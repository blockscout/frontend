import {
  Box,
  useColorModeValue,
  useToken,
} from '@chakra-ui/react';
import React from 'react';

import type { ColorThemeColor } from './utils';

interface Props extends ColorThemeColor {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  isActive: boolean;
}

const ColorModeSwitchSample = ({ hex, sampleBg, onClick, isActive }: Props) => {
  const borderColor = useColorModeValue('white', 'black');
  const activeBorderColor = useToken('colors', useColorModeValue('blackAlpha.800', 'gray.50'));
  const hoverBorderColor = useToken('colors', 'link_hovered');

  return (
    <Box
      bg={ sampleBg }
      boxSize={ 5 }
      borderRadius="full"
      borderWidth="1px"
      borderColor={ borderColor }
      position="relative"
      _before={{
        position: 'absolute',
        display: 'block',
        content: '""',
        top: '-2px',
        left: '-2px',
        width: 'calc(100% + 2px)',
        height: 'calc(100% + 2px)',
        borderStyle: 'solid',
        borderRadius: 'full',
        borderWidth: '1px',
        borderColor: isActive ? activeBorderColor : 'transparent',
      }}
      _hover={{
        _before: {
          borderColor: isActive ? activeBorderColor : hoverBorderColor,
        },
      }}
      data-hex={ hex }
      onClick={ onClick }
    />
  );
};

export default ColorModeSwitchSample;
