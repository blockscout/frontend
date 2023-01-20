import {
  Text,
  Radio,
  RadioGroup,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import type { TokenType } from 'types/api/tokenInfo';

import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';

interface Props {
  appliedFiltersNum?: number;
  defaultTypeFilters: Array<TokenType> | undefined;
  onTypeFilterChange: (nextValue: Array<TokenType>) => void;
  withAddressFilter?: boolean;
  onAddressFilterChange?: (nextValue: string) => void;
  defaultAddressFilter?: AddressFromToFilter;
}

const TokenTransferFilter = ({
  onTypeFilterChange,
  defaultTypeFilters,
  appliedFiltersNum,
  withAddressFilter,
  onAddressFilterChange,
  defaultAddressFilter,
}: Props) => {
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  return (
    <PopoverFilter appliedFiltersNum={ appliedFiltersNum } contentProps={{ w: '200px' }}>
      { withAddressFilter && (
        <>
          <Text variant="secondary" fontWeight={ 600 }>Address</Text>
          <RadioGroup
            size="lg"
            onChange={ onAddressFilterChange }
            defaultValue={ defaultAddressFilter || 'all' }
            paddingBottom={ 4 }
            borderBottom="1px solid"
            borderColor={ borderColor }
          >
            <Stack spacing={ 4 }>
              <Radio value="all"><Text fontSize="md">All</Text></Radio>
              <Radio value="from"><Text fontSize="md">From</Text></Radio>
              <Radio value="to"><Text fontSize="md">To</Text></Radio>
            </Stack>
          </RadioGroup>
        </>
      ) }
      <Text variant="secondary" fontWeight={ 600 }>Type</Text>
      <TokenTypeFilter onChange={ onTypeFilterChange } defaultValue={ defaultTypeFilters }/>
    </PopoverFilter>
  );
};

export default React.memo(TokenTransferFilter);
