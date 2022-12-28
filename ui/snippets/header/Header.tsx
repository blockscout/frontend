import { HStack, Box, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import { useScrollDirection } from 'lib/contexts/scrollDirection';
import IndexingAlert from 'ui/home/IndexingAlert';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import ProfileMenuMobile from 'ui/snippets/profileMenu/ProfileMenuMobile';
import SearchBar from 'ui/snippets/searchBar/SearchBar';

import Burger from './Burger';
import ColorModeToggler from './ColorModeToggler';

type Props = {
  isHomePage?: boolean;
  renderSearchBar?: () => React.ReactNode;
}

const Header = ({ isHomePage, renderSearchBar }: Props) => {
  const bgColor = useColorModeValue('white', 'black');
  const scrollDirection = useScrollDirection();

  const searchBar = renderSearchBar ? renderSearchBar() : <SearchBar/>;

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
          transitionProperty="box-shadow"
          transitionDuration="slow"
          boxShadow={ scrollDirection === 'down' ? 'md' : 'none' }
        >
          <Burger/>
          <NetworkLogo/>
          <ProfileMenuMobile/>
        </Flex>
        { !isHomePage && searchBar }
      </Box>
      <Box
        paddingX={ 12 }
        paddingTop={ 9 }
        display={{ base: 'none', lg: 'block' }}
      >
        <IndexingAlert/>
        { !isHomePage && (
          <HStack
            as="header"
            width="100%"
            alignItems="center"
            justifyContent="center"
            gap={ 12 }
            paddingBottom="52px"
          >
            <Box width="100%">
              { searchBar }
            </Box>
            <ColorModeToggler/>
            <ProfileMenuDesktop/>
          </HStack>
        ) }
      </Box>
    </>
  );
};

export default Header;
