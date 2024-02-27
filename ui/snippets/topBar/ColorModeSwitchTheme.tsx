import {
  Flex,
  useColorModeValue,
  useToken,
} from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

import ColorModeSwitchSample from './ColorModeSwitchSample';
import type { ColorTheme } from './utils';

interface Props extends ColorTheme {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  activeHex: string | undefined;
}

const ColorModeSwitchTheme = ({ icon, name, colors, onClick, activeHex }: Props) => {
  const isActive = colors.some((sample) => sample.hex === activeHex);
  const activeColor = useColorModeValue('blackAlpha.800', 'gray.50');
  const activeBgColor = useColorModeValue('blue.50', 'blackAlpha.800');
  const inactiveColor = useColorModeValue('blue.700', 'gray.400');
  const hoverBorderColor = useToken('colors', 'link_hovered');
  const hasOneColor = colors.length === 1;

  return (
    <Flex
      alignItems="center"
      py="10px"
      px="6px"
      cursor="pointer"
      color={ isActive ? activeColor : inactiveColor }
      bgColor={ isActive ? activeBgColor : undefined }
      _hover={{
        color: isActive ? undefined : 'link_hovered',
        '& [data-hex]': !isActive && hasOneColor ? {
          _before: {
            borderColor: hoverBorderColor,
          },
        } : undefined,
      }}
      onClick={ onClick }
      data-hex={ colors[0].hex }
      fontWeight={ 500 }
      borderRadius="base"
    >
      <IconSvg name={ icon } boxSize={ 5 } mr={ 2 }/>
      <span>{ name }</span>
      <Flex columnGap={ 2 } ml="auto" alignItems="center">
        { colors.map((sample) => <ColorModeSwitchSample key={ sample.hex } { ...sample } onClick={ onClick } isActive={ activeHex === sample.hex }/>) }
      </Flex>
    </Flex>
  );
};

export default ColorModeSwitchTheme;
