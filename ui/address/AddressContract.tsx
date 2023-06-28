import React from 'react';

import type { RoutedSubTab } from 'ui/shared/Tabs/types';

import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import Web3Provider from 'ui/shared/Web3Provider';

interface Props {
  tabs: Array<RoutedSubTab>;
  addressHash?: string;
}

const TAB_LIST_PROPS = {
  columnGap: 3,
};

const AddressContract = ({ tabs }: Props) => {
  const fallback = React.useCallback(() => {
    const noProviderTabs = tabs.filter(({ id }) => id === 'contact_code');
    return (
      <RoutedTabs tabs={ noProviderTabs } variant="outline" colorScheme="gray" size="sm" tabListProps={ TAB_LIST_PROPS }/>
    );
  }, [ tabs ]);

  return (
    <Web3Provider fallback={ fallback }>
      <RoutedTabs tabs={ tabs } variant="outline" colorScheme="gray" size="sm" tabListProps={ TAB_LIST_PROPS }/>
    </Web3Provider>
  );
};

export default React.memo(AddressContract);
