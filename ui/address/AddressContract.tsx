import React from 'react';

import type { RoutedSubTab } from 'ui/shared/Tabs/types';

import { ContractContextProvider } from 'ui/address/contract/context';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import Web3ModalProvider from 'ui/shared/Web3ModalProvider';

interface Props {
  tabs: Array<RoutedSubTab>;
  addressHash?: string;
}

const TAB_LIST_PROPS = {
  columnGap: 3,
};

const AddressContract = ({ addressHash, tabs }: Props) => {
  const fallback = React.useCallback(() => {
    const noProviderTabs = tabs.filter(({ id }) => id === 'contact_code');
    return <RoutedTabs tabs={ noProviderTabs } variant="outline" colorScheme="gray" size="sm" tabListProps={ TAB_LIST_PROPS }/>;
  }, [ tabs ]);

  return (
    <Web3ModalProvider fallback={ fallback }>
      <ContractContextProvider addressHash={ addressHash }>
        <RoutedTabs tabs={ tabs } variant="outline" colorScheme="gray" size="sm" tabListProps={ TAB_LIST_PROPS }/>
      </ContractContextProvider>
    </Web3ModalProvider>
  );
};

export default React.memo(AddressContract);
