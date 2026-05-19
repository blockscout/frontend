// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack, Box } from '@chakra-ui/react';
import React from 'react';

import SearchBar from 'client/slices/search/components/search-bar/SearchBarDesktop';

import UserProfileDesktop from 'client/features/account/components/user-profile/UserProfileDesktop';

import config from 'configs/app';
import RewardsButton from 'ui/rewards/RewardsButton';

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
          <UserProfileDesktop buttonVariant="header"/>
        </Box>
      ) }
    </HStack>
  );
};

export default React.memo(HeaderDesktop);
