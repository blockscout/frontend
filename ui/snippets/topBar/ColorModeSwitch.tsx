import {
  IconButton,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorMode,
  Flex,
  Box,
  useDisclosure,
  useColorModeValue,
  useToken,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';

import type { ArrayElement } from 'types/utils';

import moonWithStarIcon from 'icons/moon-with-star.svg';
import moonIcon from 'icons/moon.svg';
import sunIcon from 'icons/sun.svg';
import * as cookies from 'lib/cookies';

const THEMES = [
  {
    name: 'Light',
    colorMode: 'light',
    icon: sunIcon,
    colors: [
      { hex: '#FFFFFF', sampleBg: 'linear-gradient(154deg, #EFEFEF 50%, rgba(255, 255, 255, 0.00) 330.86%)' },
    ],
  },
  {
    name: 'Dim',
    colorMode: 'dark',
    icon: moonWithStarIcon,
    colors: [
      { hex: '#232B37', sampleBg: 'linear-gradient(152deg, #232B37 50%, rgba(255, 255, 255, 0.00) 290.71%)' },
      { hex: '#1B2E48', sampleBg: 'linear-gradient(150deg, #1B2E48 50%, rgba(255, 255, 255, 0.00) 312.75%)' },
    ],
  },
  {
    name: 'Dark',
    colorMode: 'dark',
    icon: moonIcon,
    colors: [
      { hex: '#101112', sampleBg: 'linear-gradient(161deg, #000 9.37%, #383838 92.52%)' },
    ],
  },
];

const ColorModeItemRow = (
  { icon, name, colors, onClick, activeHex }:
  ArrayElement<typeof THEMES> & { onClick?: (event: React.MouseEvent<HTMLDivElement>) => void; activeHex: string | undefined },
) => {
  const isActive = colors.some((sample) => sample.hex === activeHex);
  const activeColor = useColorModeValue('blackAlpha.800', 'gray.50');
  const inactiveColor = useColorModeValue('blue.700', 'gray.400');

  return (
    <Flex
      alignItems="center"
      py="10px"
      cursor="pointer"
      color={ isActive ? activeColor : inactiveColor }
      _hover={{ color: 'link_hovered' }}
      onClick={ onClick }
      data-hex={ colors.length === 1 ? colors[0].hex : undefined }
      fontWeight={ 500 }
    >
      <Icon as={ icon } boxSize={ 5 } mr={ 2 }/>
      <span>{ name }</span>
      <Flex columnGap={ 2 } ml="auto" alignItems="center">
        { colors.map((sample) => (<ColorSample key={ sample.hex } { ...sample } onClick={ onClick } isActive={ activeHex === sample.hex }/>)) }
      </Flex>
    </Flex>
  );
};

const ColorSample = (
  { hex, sampleBg, onClick, isActive }:
  ArrayElement<ArrayElement<typeof THEMES>['colors']> & { onClick?: (event: React.MouseEvent<HTMLDivElement>) => void; isActive: boolean },
) => {
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
          borderColor: hoverBorderColor,
        },
      }}
      data-hex={ hex }
      onClick={ onClick }
    />
  );
};

const ColorModeSwitch = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { setColorMode, colorMode } = useColorMode();

  const [ activeHex, setActiveHex ] = React.useState<string>();

  const setTheme = React.useCallback((hex: string) => {
    const nextTheme = THEMES.find((theme) => theme.colors.some((color) => color.hex === hex));

    if (!nextTheme) {
      return;
    }

    setColorMode(nextTheme.colorMode);

    const varName = nextTheme.colorMode === 'light' ? '--chakra-colors-white' : '--chakra-colors-black';
    window.document.documentElement.style.setProperty(varName, hex);

    cookies.set(cookies.NAMES.COLOR_MODE_HEX, hex);
  }, [ setColorMode ]);

  React.useEffect(() => {
    const fallbackHex = (THEMES.find(theme => theme.colorMode === colorMode) ?? THEMES[0]).colors[0].hex;
    const cookieHex = cookies.get(cookies.NAMES.COLOR_MODE_HEX) ?? fallbackHex;
    setTheme(cookieHex);
    setActiveHex(cookieHex);
  // should run only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const handleSelect = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const hex = event.currentTarget.getAttribute('data-hex');

    if (!hex) {
      return;
    }

    setTheme(hex);
    setActiveHex(hex);
  }, [ setTheme ]);

  const activeTheme = THEMES.find((theme) => theme.colors.some((color) => color.hex === activeHex));

  return (
    <Popover placement="bottom-start" isLazy trigger="click" isOpen={ isOpen } onClose={ onClose }>
      <PopoverTrigger>
        { activeTheme ? (
          <IconButton
            variant="simple"
            colorScheme="blue"
            aria-label="color mode switch"
            icon={ <Icon as={ activeTheme.icon } boxSize={ 5 }/> }
            boxSize={ 5 }
            onClick={ onToggle }
          />
        ) : <Skeleton boxSize={ 5 } borderRadius="sm"/> }
      </PopoverTrigger>
      <PopoverContent overflowY="hidden" w="200px" fontSize="sm">
        <PopoverBody boxShadow="2xl">
          { THEMES.map((theme) => <ColorModeItemRow key={ theme.name } { ...theme } onClick={ handleSelect } activeHex={ activeHex }/>) }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(ColorModeSwitch);
