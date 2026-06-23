// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenType } from '../../../types/api';

import PopoverFilter from 'src/shared/filters/PopoverFilter';

import TokenTypeFilter from '../../../components/TokenTypeFilter';
import { FUNGIBLE_TOKEN_TYPES } from '../utils';

interface Props {
  value: Array<TokenType> | undefined;
  onChange: (value: Array<TokenType>) => void;
}

const AddressFungibleTokensFilter = ({ value, onChange }: Props) => {

  const defaultValue = React.useMemo(() => {
    if (value?.length === FUNGIBLE_TOKEN_TYPES.length && value.every(tokenType => FUNGIBLE_TOKEN_TYPES.includes(tokenType))) {
      return [];
    }
    return value;
  }, [ value ]);

  const handleChange = React.useCallback((value: Array<TokenType>) => {
    if (value.length === 0) {
      onChange(FUNGIBLE_TOKEN_TYPES);
    } else {
      onChange(value);
    }
  }, [ onChange ]);

  return (
    <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ defaultValue?.length }>
      <TokenTypeFilter<TokenType>
        category="fungible"
        onChange={ handleChange }
        defaultValue={ defaultValue }
      />
    </PopoverFilter>
  );
};

export default React.memo(AddressFungibleTokensFilter);
