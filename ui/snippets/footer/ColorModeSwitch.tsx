import type { ColorMode } from '@chakra-ui/react';
import {
  IconButton,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorMode,
  Text,
  Tooltip,
  Flex,
  Box,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';

import moonIcon from 'icons/moon.svg';
import sunIcon from 'icons/sun.svg';
import * as cookies from 'lib/cookies';

const COLORS = [
  { hex: '#101112', name: 'Black', colorMode: 'dark' },
  { hex: '#1A1E25', name: 'Dark', colorMode: 'dark' },
  { hex: '#232B37', name: 'Dim dark', colorMode: 'dark' },
  { hex: '#F5F6F8', name: 'Light', colorMode: 'light' },
  { hex: '#FAFBFB', name: 'Off-white', colorMode: 'light' },
  { hex: '#FFFFFF', name: 'White', colorMode: 'light' },
];

function getInitialIndex(colorMode: ColorMode, hex: string | undefined): number {
  const index = COLORS.findIndex((color) => color.hex === hex);
  if (index === -1) {
    return colorMode === 'dark' ? COLORS.findIndex((color) => color.colorMode === colorMode) : COLORS.findLastIndex((color) => color.colorMode === colorMode);
  }

  return index;
}

const ColorModeSwitch = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { toggleColorMode, colorMode } = useColorMode();

  const cookieHex = cookies.get(cookies.NAMES.COLOR_MODE_HEX);

  const [ index, setIndex ] = React.useState(getInitialIndex(colorMode, cookieHex));

  const setColorMode = React.useCallback((index: number) => {
    const color = COLORS[index];
    if (colorMode !== color.colorMode) {
      toggleColorMode();
    }

    const varName = color.colorMode === 'light' ? '--chakra-colors-white' : '--chakra-colors-black';
    window.document.documentElement.style.setProperty(varName, color.hex);

    cookies.set(cookies.NAMES.COLOR_MODE_HEX, color.hex);
  }, [ colorMode, toggleColorMode ]);

  React.useEffect(() => {
    setColorMode(index);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const hex = event.currentTarget.getAttribute('data-hex');
    const nextIndex = COLORS.findIndex((item) => item.hex === hex);
    if (nextIndex === -1) {
      return;
    }

    setColorMode(nextIndex);
    setIndex(nextIndex);
  }, [ setColorMode ]);

  const handleGoToLastClick = React.useCallback(() => {
    setIndex(COLORS.length - 1);
    setColorMode(COLORS.length - 1);
  }, [ setColorMode ]);

  const handleGoToFirstClick = React.useCallback(() => {
    setIndex(0);
    setColorMode(0);
  }, [ setColorMode ]);

  return (
    <Popover placement="bottom-start" isLazy trigger="click" isOpen={ isOpen } onClose={ onClose }>
      <PopoverTrigger>
        <IconButton
          variant="outline"
          colorScheme="gray"
          aria-label="color mode switch"
          icon={ <Icon as={ sunIcon } boxSize={ 5 }/> }
          boxSize={ 8 }
          onClick={ onToggle }
        />
      </PopoverTrigger>
      <PopoverContent overflowY="hidden" w="240px">
        <PopoverBody boxShadow="2xl">
          <Text variant="secondary" fontSize="sm" textAlign="center" mt={ 2 } mb={ 1 }>
            { COLORS[index].name }
          </Text>
          <Flex justifyContent="center" alignItems="center" columnGap={ 3 } py={ 4 }>
            <Icon
              as={ moonIcon }
              boxSize={ 4 }
              color="text_secondary"
              cursor="pointer"
              onClick={ handleGoToFirstClick }
            />
            <Flex as="ul">
              { COLORS.map((color, i) => (
                <Tooltip label={ color.name } key={ color.hex } placement="top">
                  <Box
                    as="li"
                    boxSize={ 5 }
                    listStyleType="none"
                    cursor="pointer"
                    bgColor={ color.hex }
                    data-hex={ color.hex }
                    onClick={ handleSelect }
                    zIndex={ i === index ? 1 : 0 }
                    outline={ i === index ? '1px solid' : '0px solid' }
                    outlineColor="text_secondary"
                    outlineOffset={ 0 }
                    _first={{
                      borderTopLeftRadius: 'sm',
                      borderBottomLeftRadius: 'sm',
                    }}
                    _last={{
                      borderTopRightRadius: 'sm',
                      borderBottomRightRadius: 'sm',
                    }}
                  />
                </Tooltip>
              )) }
            </Flex>
            <Icon
              as={ sunIcon }
              boxSize={ 5 }
              color="text_secondary"
              cursor="pointer"
              onClick={ handleGoToLastClick }
            />
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ColorModeSwitch;
