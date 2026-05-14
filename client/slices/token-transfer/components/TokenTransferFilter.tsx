// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text, Stack, HStack } from '@chakra-ui/react';
import React from 'react';

import type { AddressFromToFilter } from 'client/slices/address/types/api';
import type { TokenType } from 'client/slices/token/types/api';
import type { ClusterChainConfig } from 'types/multichain';

import TokenTypeFilter from 'client/slices/token/components/TokenTypeFilter';

import useIsInitialLoading from 'client/shared/hooks/useIsInitialLoading';

import { Radio, RadioGroup } from 'toolkit/chakra/radio';
import { Hint } from 'toolkit/components/Hint/Hint';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';

interface Props {
  appliedFiltersNum?: number;
  defaultTypeFilters: Array<TokenType> | undefined;
  onTypeFilterChange: (nextValue: Array<TokenType>) => void;
  withAddressFilter?: boolean;
  onAddressFilterChange?: (nextValue: string) => void;
  defaultAddressFilter?: AddressFromToFilter;
  isLoading?: boolean;
  chainConfig?: Array<ClusterChainConfig['app_config']> | ClusterChainConfig['app_config'];
}

const TokenTransferFilter = ({
  onTypeFilterChange,
  defaultTypeFilters,
  appliedFiltersNum,
  withAddressFilter,
  onAddressFilterChange,
  defaultAddressFilter,
  isLoading,
  chainConfig,
}: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);

  const handleAddressFilterChange = React.useCallback(({ value }: { value: string | null }) => {
    if (!value) {
      return;
    }

    onAddressFilterChange?.(value);
  }, [ onAddressFilterChange ]);

  const tokenFilterTitle = (
    <HStack gap={ 1 }>
      <span>Type of transfer</span>
      <Hint
        label={ (
          <Text>
            Token type and transfer type are detected separately.
            This filter applies to the transfer event, not the token's standard. <br/><br/>
            Some tokens implement multiple interfaces. For example, a token classified as
            ERC-1155 may emit ERC-20 Transfer events, so its transfers will match the ERC-20 filter.
          </Text>
        ) }
      />
    </HStack>
  );

  return (
    <PopoverFilter appliedFiltersNum={ appliedFiltersNum } contentProps={{ minW: '220px' }} isLoading={ isInitialLoading }>
      { withAddressFilter && (
        <>
          <Text color="text.secondary" fontWeight={ 600 }>Address</Text>
          <RadioGroup
            size="lg"
            onValueChange={ handleAddressFilterChange }
            defaultValue={ defaultAddressFilter || 'all' }
            paddingBottom={ 4 }
            borderBottom="1px solid"
            borderColor="border.divider"
          >
            <Stack gap={ 4 }>
              <Radio value="all"><Text fontSize="md">All</Text></Radio>
              <Radio value="from"><Text fontSize="md">Outgoing transfers</Text></Radio>
              <Radio value="to"><Text fontSize="md">Incoming transfers</Text></Radio>
            </Stack>
          </RadioGroup>
        </>
      ) }
      <TokenTypeFilter<TokenType>
        onChange={ onTypeFilterChange }
        defaultValue={ defaultTypeFilters }
        nftOnly={ false }
        chainConfig={ chainConfig }
        title={ tokenFilterTitle }
      />
    </PopoverFilter>
  );
};

export default React.memo(TokenTransferFilter);
