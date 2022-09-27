import { HStack, Box, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import ProfileMenuMobile from 'ui/snippets/profileMenu/ProfileMenuMobile';
import SearchBar from 'ui/snippets/searchBar/SearchBar';

import Burger from './Burger';
import ColorModeToggler from './ColorModeToggler';

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
          zIndex="sticky"
        >
          <Burger/>
          <NetworkLogo/>
          <ProfileMenuMobile/>
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
      paddingX={ 12 }
      paddingTop={ 9 }
      gap={ 12 }
    >
      <SearchBar/>
      <ColorModeToggler/>
      <ProfileMenuDesktop/>
    </HStack>
  );
};

export default Header;
