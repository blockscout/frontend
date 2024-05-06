import React from 'react';

import type { RoutedSubTab } from 'ui/shared/Tabs/types';

import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';

interface Props {
  tabs: Array<RoutedSubTab>;
  isLoading: boolean;
  shouldRender?: boolean;
}

const TAB_LIST_PROPS = {
  columnGap: 3,
};

const AddressContract = ({ tabs, isLoading, shouldRender }: Props) => {
  if (!shouldRender) {
    return null;
  }

  return (
    <RoutedTabs tabs={ tabs } variant="outline" colorScheme="gray" size="sm" tabListProps={ TAB_LIST_PROPS } isLoading={ isLoading }/>
  );
};

export default React.memo(AddressContract);
