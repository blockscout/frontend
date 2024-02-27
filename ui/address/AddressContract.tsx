import React from 'react';

import type { RoutedSubTab } from 'ui/shared/Tabs/types';

import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import Web3ModalProvider from 'ui/shared/Web3ModalProvider';

interface Props {
  tabs: Array<RoutedSubTab>;
  addressHash?: string;
}

const TAB_LIST_PROPS = {
  columnGap: 3,
};

const AddressContract = ({ tabs }: Props) => {
  const fallback = React.useCallback(() => {
    const noProviderTabs = tabs.filter(({ id }) => id === 'contact_code' || id.startsWith('read_'));
    return (
      <RoutedTabs tabs={ noProviderTabs } variant="outline" colorScheme="gray" size="sm" tabListProps={ TAB_LIST_PROPS }/>
    );
  }, [ tabs ]);

  return (
    <Web3ModalProvider fallback={ fallback }>
      <RoutedTabs tabs={ tabs } variant="outline" colorScheme="gray" size="sm" tabListProps={ TAB_LIST_PROPS }/>
    </Web3ModalProvider>
  );
};

export default React.memo(AddressContract);
