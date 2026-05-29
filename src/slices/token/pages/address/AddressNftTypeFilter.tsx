// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { NFTTokenType } from 'src/slices/token/types/api';

import TokenTypeFilter from 'src/slices/token/components/TokenTypeFilter';

import PopoverFilter from 'src/shared/filters/PopoverFilter';

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
