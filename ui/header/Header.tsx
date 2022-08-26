import { HStack, VStack, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import NetworkLogo from 'ui/navigation/NetworkLogo';

import Burger from './Burger';
import ColorModeToggler from './ColorModeToggler';
import ProfileMenu from './ProfileMenu';
import SearchBar from './searchBar/SearchBar';

const Header = () => {
  const isMobile = useIsMobile();
  const bgColor = useColorModeValue('white', 'black');

  if (isMobile) {
    return (
      <VStack
        as="header"
        position="fixed"
        top={ 0 }
        left={ 0 }
        paddingX={ 4 }
        paddingY={ 2 }
        bgColor={ bgColor }
        width="100%"
      >
        <Flex
          width="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <Burger/>
          <NetworkLogo/>
          <ProfileMenu/>
        </Flex>
        <SearchBar/>
      </VStack>
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
