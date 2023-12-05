import { HStack, Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import SearchBar from 'ui/snippets/searchBar/SearchBar';

type Props = {
  isHomePage?: boolean;
  renderSearchBar?: () => React.ReactNode;
}

const HeaderDesktop = ({ isHomePage, renderSearchBar }: Props) => {

  if (isHomePage) {
    return null;
  }

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
      <Box width="100%">
        { searchBar }
      </Box>
      { config.features.account.isEnabled && <ProfileMenuDesktop/> }
    </HStack>
  );
};

export default React.memo(HeaderDesktop);
