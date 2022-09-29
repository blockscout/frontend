import { HStack, Box, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import ProfileMenuMobile from 'ui/snippets/profileMenu/ProfileMenuMobile';
import SearchBar from 'ui/snippets/searchBar/SearchBar';

import Burger from './Burger';
import ColorModeToggler from './ColorModeToggler';

const Header = () => {
  const bgColor = useColorModeValue('white', 'black');
  return (
    <>
      <Box bgColor={ bgColor } display={{ base: 'block', lg: 'none' }}>
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
          zIndex="sticky"
        >
          <Burger/>
          <NetworkLogo/>
          <ProfileMenuMobile/>
        </Flex>
        <SearchBar/>
      </Box>
      <HStack
        as="header"
        width="100%"
        alignItems="center"
        justifyContent="center"
        gap={ 12 }
        display={{ base: 'none', lg: 'flex' }}
      >
        <SearchBar/>
        <ColorModeToggler/>
        <ProfileMenuDesktop/>
      </HStack>
    </>
  );
};

export default Header;
