// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack, Box } from '@chakra-ui/react';
import config from 'client/config';
import React from 'react';

import SearchBar from 'client/slices/search/components/search-bar/SearchBarDesktop';

import UserProfileDesktop from 'client/features/account/components/user-profile/UserProfileDesktop';
import RewardsButton from 'client/features/rewards/components/RewardsButton';

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
      { config.shell.navigation.layout === 'vertical' && (
        <Box display="flex" gap={ 2 } flexShrink={ 0 }>
          { config.features.rewards.isEnabled && <RewardsButton/> }
          <UserProfileDesktop buttonVariant="header"/>
        </Box>
      ) }
    </HStack>
  );
};

export default React.memo(HeaderDesktop);
