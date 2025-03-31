import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';

interface Props {
  tabs: Array<TabItemRegular>;
  isLoading: boolean;
  shouldRender?: boolean;
}

const AddressContract = ({ tabs, isLoading, shouldRender }: Props) => {
  if (!shouldRender) {
    return null;
  }

  return (
    <RoutedTabs tabs={ tabs } variant="secondary" size="sm" isLoading={ isLoading }/>
  );
};

export default React.memo(AddressContract);
