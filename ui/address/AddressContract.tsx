import React from 'react';

import type { RoutedSubTab } from 'ui/shared/RoutedTabs/types';

import { ContractContextProvider } from 'ui/address/contract/context';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

interface Props {
  tabs: Array<RoutedSubTab>;
}

const TAB_LIST_PROPS = {
  columnGap: 3,
};

const AddressContract = ({ tabs }: Props) => {
  return (
    <ContractContextProvider>
      <RoutedTabs tabs={ tabs } variant="outline" colorScheme="gray" size="sm" tabListProps={ TAB_LIST_PROPS }/>
    </ContractContextProvider>
  );
};

export default React.memo(AddressContract);
