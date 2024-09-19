import { HStack, Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import ProfileDesktop from 'ui/snippets/profile/ProfileDesktop';
import SearchBar from 'ui/snippets/searchBar/SearchBar';
import WalletDesktop from 'ui/snippets/wallet/WalletDesktop';

import Burger from './Burger';

type Props = {
  renderSearchBar?: () => React.ReactNode;
  isMarketplaceAppPage?: boolean;
}

const HeaderDesktop = ({ renderSearchBar, isMarketplaceAppPage }: Props) => {

  const searchBar = renderSearchBar ? renderSearchBar() : <SearchBar/>;

  return (
    <HStack
      as="header"
      display={{ base: 'none', lg: 'flex' }}
      width="100%"
      alignItems="center"
      justifyContent="center"
      gap={ 12 }
    >
      { isMarketplaceAppPage && (
        <Box display="flex" alignItems="center" gap={ 3 }>
          <Burger isMarketplaceAppPage/>
          <NetworkLogo isCollapsed/>
        </Box>
      ) }
      <Box width="100%">
        { searchBar }
      </Box>
      { config.UI.navigation.layout === 'vertical' && (
        <Box display="flex" flexShrink={ 0 }>
          {
            (config.features.account.isEnabled && <ProfileDesktop/>) ||
            (config.features.blockchainInteraction.isEnabled && <WalletDesktop/>)
          }
        </Box>
      ) }
    </HStack>
  );
};

export default React.memo(HeaderDesktop);
