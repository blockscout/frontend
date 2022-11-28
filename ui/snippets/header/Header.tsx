import { HStack, Box, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import ScrollDirectionContext from 'ui/ScrollDirectionContext';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import ProfileMenuMobile from 'ui/snippets/profileMenu/ProfileMenuMobile';
import SearchBar from 'ui/snippets/searchBar/SearchBar';

import Burger from './Burger';
import ColorModeToggler from './ColorModeToggler';

type Props = {
  hasSearch: boolean;
  hideOnScrollDown?: boolean;
}

const Header = ({ hideOnScrollDown, hasSearch }: Props) => {
  const bgColor = useColorModeValue('white', 'black');

  return (
    <ScrollDirectionContext.Consumer>
      { (scrollDirection) => (
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
              transitionProperty="box-shadow"
              transitionDuration="slow"
              boxShadow={ !hideOnScrollDown && scrollDirection === 'down' ? 'md' : 'none' }
            >
              <Burger/>
              <NetworkLogo/>
              <ProfileMenuMobile/>
            </Flex>
            { hasSearch && <SearchBar withShadow={ !hideOnScrollDown }/> }
          </Box><HStack
            as="header"
            width="100%"
            alignItems="center"
            justifyContent="center"
            gap={ 12 }
            display={{ base: 'none', lg: 'flex' }}
            paddingX={ 12 }
            paddingTop={ 9 }
            paddingBottom={ 8 }
          >
            <Box width="100%">{ hasSearch && <SearchBar/> }</Box>
            <ColorModeToggler/>
            <ProfileMenuDesktop/>
          </HStack>
        </>
      ) }
    </ScrollDirectionContext.Consumer>
  );
};

export default Header;
