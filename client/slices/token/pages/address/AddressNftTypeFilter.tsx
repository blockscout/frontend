// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { NFTTokenType } from 'client/slices/token/types/api';

import TokenTypeFilter from 'client/slices/token/components/TokenTypeFilter';

import PopoverFilter from 'ui/shared/filters/PopoverFilter';

interface Props {
  value: Array<NFTTokenType> | undefined;
  onChange: (value: Array<NFTTokenType>) => void;
}

const AddressNftTypeFilter = ({ value, onChange }: Props) => {
  return (
    <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ value?.length }>
      <TokenTypeFilter<NFTTokenType> nftOnly onChange={ onChange } defaultValue={ value }/>
    </PopoverFilter>
  );
};

export default React.memo(AddressNftTypeFilter);
