import { HStack, Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import config from 'configs/app';
import SearchBar from 'ui/snippets/searchBar/SearchBarDesktop';

const RewardsButton = dynamic(() => import('ui/rewards/RewardsButton'), { ssr: false });
const UserProfileDynamic = dynamic(() => import('ui/snippets/user/profile/dynamic/UserProfile'), { ssr: false });
const UserProfileAuth0 = dynamic(() => import('ui/snippets/user/profile/auth0/UserProfileDesktop'), { ssr: false });
const UserWalletDesktop = dynamic(() => import('ui/snippets/user/wallet/UserWalletDesktop'), { ssr: false });

type Props = {
  renderSearchBar?: () => React.ReactNode;
};

const HeaderDesktop = ({ renderSearchBar }: Props) => {

  const searchBar = renderSearchBar ? renderSearchBar() : <SearchBar/>;

  const userProfile = (() => {
    const accountFeature = config.features.account;
    if (accountFeature.isEnabled) {
      switch (accountFeature.authProvider) {
        case 'auth0':
          return <UserProfileAuth0/>;
        case 'dynamic':
          return <UserProfileDynamic/>;
        default:
          return null;
      }
    }
    if (config.features.blockchainInteraction.isEnabled) {
      return <UserWalletDesktop/>;
    }
  })();

  return (
    <HStack
      as="header"
      display={{ base: 'none', lg: 'flex' }}
      width="100%"
      alignItems="center"
      justifyContent="center"
      gap={ 6 }
    >
      <Box width="100%">
        { searchBar }
      </Box>
      { config.UI.navigation.layout === 'vertical' && (
        <Box display="flex" gap={ 2 } flexShrink={ 0 }>
          { config.features.rewards.isEnabled && <RewardsButton/> }
          { userProfile }
        </Box>
      ) }
    </HStack>
  );
};

export default React.memo(HeaderDesktop);
