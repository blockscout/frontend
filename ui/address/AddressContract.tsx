import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';

interface Props {
  tabs: Array<TabItemRegular>;
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
    <RoutedTabs tabs={ tabs } variant="outline" colorScheme="gray" size="sm" listProps={ TAB_LIST_PROPS } isLoading={ isLoading }/>
  );
};

export default React.memo(AddressContract);
