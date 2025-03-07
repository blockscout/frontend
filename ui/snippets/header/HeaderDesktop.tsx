import { HStack, Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import RewardsButton from 'ui/rewards/RewardsButton';
import SearchBar from 'ui/snippets/searchBar/SearchBar';
import UserProfileDesktop from 'ui/snippets/user/profile/UserProfileDesktop';
import UserWalletDesktop from 'ui/snippets/user/wallet/UserWalletDesktop';

type Props = {
  renderSearchBar?: () => React.ReactNode;
};

const HeaderDesktop = ({ renderSearchBar }: Props) => {

  const searchBar = renderSearchBar ? renderSearchBar() : <SearchBar/>;

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
          {
            (config.features.account.isEnabled && <UserProfileDesktop/>) ||
            (config.features.blockchainInteraction.isEnabled && <UserWalletDesktop/>)
          }
        </Box>
      ) }
    </HStack>
  );
};

export default React.memo(HeaderDesktop);
