import {
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorMode,
  useDisclosure,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';

import * as cookies from 'lib/cookies';
import IconSvg from 'ui/shared/IconSvg';

import ColorModeSwitchTheme from './ColorModeSwitchTheme';
import { COLOR_THEMES } from './utils';

const ColorModeSwitch = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { setColorMode, colorMode } = useColorMode();

  const [ activeHex, setActiveHex ] = React.useState<string>();

  const setTheme = React.useCallback((hex: string) => {
    const nextTheme = COLOR_THEMES.find((theme) => theme.colors.some((color) => color.hex === hex));

    if (!nextTheme) {
      return;
    }

    setColorMode(nextTheme.colorMode);

    const varName = nextTheme.colorMode === 'light' ? '--chakra-colors-white' : '--chakra-colors-black';
    window.document.documentElement.style.setProperty(varName, hex);

    cookies.set(cookies.NAMES.COLOR_MODE_HEX, hex);
    window.localStorage.setItem(cookies.NAMES.COLOR_MODE, nextTheme.colorMode);
  }, [ setColorMode ]);

  React.useEffect(() => {
    const cookieColorMode = cookies.get(cookies.NAMES.COLOR_MODE);

    const nextColorMode = (() => {
      if (!cookieColorMode) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      return colorMode;
    })();

    const fallbackHex = (COLOR_THEMES.find(theme => theme.colorMode === nextColorMode && theme.colors.length === 1) ?? COLOR_THEMES[0]).colors[0].hex;
    const cookieHex = cookies.get(cookies.NAMES.COLOR_MODE_HEX) ?? fallbackHex;
    setTheme(cookieHex);
    setActiveHex(cookieHex);
  // should run only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const handleSelect = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const hex = event.currentTarget.getAttribute('data-hex');

    if (!hex) {
      return;
    }

    setTheme(hex);
    setActiveHex(hex);
  }, [ setTheme ]);

  const activeTheme = COLOR_THEMES.find((theme) => theme.colors.some((color) => color.hex === activeHex));

  return (
    <Popover placement="bottom-start" isLazy trigger="click" isOpen={ isOpen } onClose={ onClose }>
      <PopoverTrigger>
        { activeTheme ? (
          <IconButton
            variant="simple"
            colorScheme="blue"
            aria-label="color mode switch"
            icon={ <IconSvg name={ activeTheme.icon } boxSize={ 5 }/> }
            boxSize={ 5 }
            onClick={ onToggle }
          />
        ) : <Skeleton boxSize={ 5 } borderRadius="sm"/> }
      </PopoverTrigger>
      <PopoverContent overflowY="hidden" w="164px" fontSize="sm">
        <PopoverBody boxShadow="2xl" p={ 3 }>
          { COLOR_THEMES.map((theme) => <ColorModeSwitchTheme key={ theme.name } { ...theme } onClick={ handleSelect } activeHex={ activeHex }/>) }
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ColorModeSwitch;
