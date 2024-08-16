/* eslint-disable no-console */
import { HStack, Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import NetworkLogo from 'ui/snippets/networkMenu/NetworkLogo';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import SearchBar from 'ui/snippets/searchBar/SearchBar';
import WalletMenuDesktop from 'ui/snippets/walletMenu/WalletMenuDesktop';

import SearchBarStorage from '../searchBar/SearchBarStorage';
import Burger from './Burger';

type Props = {
  renderSearchBar?: () => React.ReactNode;
  isMarketplaceAppPage?: boolean;
}

const HeaderDesktop = ({ renderSearchBar, isMarketplaceAppPage }: Props) => {
  const router = useRouter();
  const storageSearchbar = React.useCallback(() => {
    const pathname = router.pathname;
    if (pathname.includes('object') || pathname.includes('bucket') || pathname.includes('group')) {
      return true;
    }
    return false;
  }, [ router.pathname ]);
  const specifiedSearchBar = storageSearchbar() ? <SearchBarStorage/> : <SearchBar/>;
  const searchBar = renderSearchBar ? renderSearchBar() : specifiedSearchBar;

  return (
    <HStack
      as="header"
      display={{ base: 'none', lg: 'flex' }}
      position="relative"
      width="100%"
      alignItems="center"
      justifyContent="center"
      paddingBottom="24px"
      gap={ 12 }
      sx={{
        '::before': {
          content: '""',
          position: 'absolute',
          bottom: '0px',
          left: '-24px',
          width: 'calc(100% + 48px)',
          height: '1px',
          backgroundColor: 'rgba(0, 0, 0, 0.06)',
        },
      }}
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
        <Box display="flex">
          { config.features.account.isEnabled && <ProfileMenuDesktop/> }
          { config.features.blockchainInteraction.isEnabled && <WalletMenuDesktop/> }
        </Box>
      ) }
    </HStack>
  );
};

export default React.memo(HeaderDesktop);
