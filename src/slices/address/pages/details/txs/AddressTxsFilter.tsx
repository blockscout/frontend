// SPDX-License-Identifier: LicenseRef-Blockscout

import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { AddressFromToFilter } from 'src/slices/address/types/api';

import PopoverFilterRadio from 'src/shared/filters/PopoverFilterRadio';
import useIsInitialLoading from 'src/shared/hooks/useIsInitialLoading';

const OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'from', label: 'Outgoing transactions' },
  { value: 'to', label: 'Incoming transactions' },
];
const collection = createListCollection({ items: OPTIONS });

interface Props {
  hasActiveFilter: boolean;
  initialValue: AddressFromToFilter;
  onFilterChange: (nextValue: string | Array<string>) => void;
  isLoading?: boolean;
}

const AddressTxsFilter = ({ onFilterChange, initialValue, hasActiveFilter, isLoading }: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);

  return (
    <PopoverFilterRadio
      name="txs_filter"
      collection={ collection }
      onChange={ onFilterChange }
      hasActiveFilter={ hasActiveFilter }
      isLoading={ isInitialLoading }
      initialValue={ initialValue }
    />
  );
};

export default React.memo(AddressTxsFilter);
