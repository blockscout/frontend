import React from 'react';

import type { RoutedSubTab } from 'ui/shared/RoutedTabs/types';

import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

interface Props {
  tabs: Array<RoutedSubTab>;
}

const AddressContract = ({ tabs }: Props) => {
  return <RoutedTabs tabs={ tabs } variant="outline" colorScheme="gray" size="sm" tabListProps={{ columnGap: 3 }}/>;
};

export default AddressContract;
