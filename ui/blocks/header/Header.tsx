import { HStack, Box, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import NetworkLogo from 'ui/blocks/networkMenu/NetworkLogo';
import SearchBar from 'ui/blocks/searchBar/SearchBar';

import Burger from './Burger';
import ColorModeToggler from './ColorModeToggler';
import ProfileMenu from './ProfileMenu';

const Header = () => {
  const isMobile = useIsMobile();
  const bgColor = useColorModeValue('white', 'black');

  if (isMobile) {
    return (
      <Box bgColor={ bgColor }>
        <Flex
          as="header"
          position="fixed"
          top={ 0 }
          left={ 0 }
          paddingX={ 4 }
          paddingY={ 2 }
          bgColor={ bgColor }
          width="100%"
          alignItems="center"
          justifyContent="space-between"
          zIndex={ 10 }
        >
          <Burger/>
          <NetworkLogo/>
          <ProfileMenu/>
        </Flex>
        <SearchBar/>
      </Box>
    );
  }

  return (
    <HStack
      as="header"
      width="100%"
      alignItems="center"
      justifyContent="center"
      gap={ 12 }
    >
      <SearchBar/>
      <ColorModeToggler/>
      <ProfileMenu/>
    </HStack>
  );
};

export default Header;
