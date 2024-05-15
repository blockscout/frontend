import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import config from 'configs/app';
import { useScrollDirection } from 'lib/contexts/scrollDirection';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import ProfileMenuMobile from 'ui/snippets/profileMenu/ProfileMenuMobile';
import SearchBar from 'ui/snippets/searchBar/SearchBar';
import WalletMenuMobile from 'ui/snippets/walletMenu/WalletMenuMobile';

import Burger from './Burger';

type Props = {
  hideSearchBar?: boolean;
  renderSearchBar?: () => React.ReactNode;
}

const HeaderMobile = ({ hideSearchBar, renderSearchBar }: Props) => {
  const bgColor = useColorModeValue('white', 'black');
  const scrollDirection = useScrollDirection();
  const { ref, inView } = useInView({ threshold: 1 });

  const searchBar = renderSearchBar ? renderSearchBar() : <SearchBar/>;

  return (
    <Box
      ref={ ref }
      bgColor={ bgColor }
      display={{ base: 'block', lg: 'none' }}
      position="sticky"
      top="-1px"
      left={ 0 }
      zIndex="sticky2"
      pt="1px"
    >
      <Flex
        as="header"
        paddingX={ 3 }
        paddingY={ 2 }
        bgColor={ bgColor }
        width="100%"
        alignItems="center"
        transitionProperty="box-shadow"
        transitionDuration="slow"
        boxShadow={ !inView && scrollDirection === 'down' ? 'md' : 'none' }
      >
        <Burger/>
        <NetworkLogo ml={ 2 } mr="auto"/>
        <Flex columnGap={ 2 }>
          { config.features.account.isEnabled ? <ProfileMenuMobile/> : <Box boxSize={ 10 }/> }
          { config.features.blockchainInteraction.isEnabled && <WalletMenuMobile/> }
        </Flex>
      </Flex>
      { !hideSearchBar && searchBar }
    </Box>
  );
};

export default React.memo(HeaderMobile);
