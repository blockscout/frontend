import { HStack, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import NetworkLogo from 'ui/navigation/NetworkLogo';

import Burger from './Burger';
import ColorModeToggler from './ColorModeToggler';
import ProfileMenu from './ProfileMenu';
import SearchBar from './SearchBar';

const Header = () => {
  const isMobile = useIsMobile();
  const bgColor = useColorModeValue('white', 'black');

  if (isMobile) {
    return (
      <Flex
        as="header"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        position="fixed"
        bgColor={ bgColor }
        top={ 0 }
        left={ 0 }
        paddingX={ 4 }
        paddingTop={ 2 }
      >
        <Burger/>
        <NetworkLogo/>
        <ProfileMenu/>
      </Flex>
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
