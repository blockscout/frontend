/* eslint-disable no-console */
import { Box, chakra, useColorMode, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: Props) => {
  const { colorMode } = useColorMode();
  console.log('colorMode', colorMode);
  const { setColorMode } = useColorMode();
  // if (setColorMode) {
  //   setColorMode(theme.config.initialColorMode);
  // }

  React.useEffect(() => {
    // Get the cookie value directly
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('chakra-ui-color-mode='))
      ?.split('=')[1];

    console.log('cookieValue', cookieValue, setColorMode);
    if (cookieValue && setColorMode) {
      // Force sync with cookie value
      setColorMode(cookieValue);
    }
  }, [ setColorMode ]);

  const bgColor = useColorModeValue('white', 'black');

  return (
    <Box
      className={ className }
      minWidth={{ base: '100vw', lg: 'fit-content' }}
      m="0 auto"
      bgColor={ bgColor }
    >
      { children }
    </Box>
  );
};

export default React.memo(chakra(Container));
