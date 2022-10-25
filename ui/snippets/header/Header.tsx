import { HStack, Box, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import useScrollDirection from 'lib/hooks/useScrollDirection';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import ProfileMenuMobile from 'ui/snippets/profileMenu/ProfileMenuMobile';
import SearchBar from 'ui/snippets/searchBar/SearchBar';

import Burger from './Burger';
import ColorModeToggler from './ColorModeToggler';

const Header = ({ hideOnScrollDown }: {hideOnScrollDown?: boolean}) => {
  const scrollDirection = useScrollDirection();
  const bgColor = useColorModeValue('white', 'black');

  const transform = hideOnScrollDown && scrollDirection === 'down' ? 'translateY(-60px)' : 'translateY(0)';
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
          zIndex="sticky2"
          transform={ transform }
          transitionProperty="transform,box-shadow"
          transitionDuration="slow"
          boxShadow={ scrollDirection === 'down' ? 'md' : 'none' }
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
        paddingX={ 12 }
        paddingTop={ 9 }
        paddingBottom="52px"
      >
        <SearchBar/>
        <ColorModeToggler/>
        <ProfileMenuDesktop/>
      </HStack>
    </>
  );
};

export default Header;
