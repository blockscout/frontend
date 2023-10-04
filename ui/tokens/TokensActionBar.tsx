import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'types/api/token';
import type { TokensSortingValue } from 'types/api/tokens';
import type { PaginationParams } from 'ui/shared/pagination/types';

import ActionBar from 'ui/shared/ActionBar';
import FilterInput from 'ui/shared/filters/FilterInput';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';
import Pagination from 'ui/shared/pagination/Pagination';
import Sort from 'ui/shared/sort/Sort';
import { SORT_OPTIONS } from 'ui/tokens/utils';

import TokensBridgedChainsFilter from './TokensBridgedChainsFilter';

interface Props {
  pagination: PaginationParams;
  searchTerm: string | undefined;
  onSearchChange: (value: string) => void;
  tokenTypes: Array<TokenType> | undefined;
  onTokenTypesChange: (value: Array<TokenType>) => void;
  sort: TokensSortingValue | undefined;
  onSortChange: () => void;
  bridgeChains: Array<string> | undefined;
  onBridgeChainsChange: (value: Array<string>) => void;
  activeTab: string;
  inTabsSlot?: boolean;
}

const TokensActionBar = ({
  tokenTypes,
  onTokenTypesChange,
  sort,
  onSortChange,
  searchTerm,
  onSearchChange,
  bridgeChains,
  onBridgeChainsChange,
  pagination,
  activeTab,
  inTabsSlot,
}: Props) => {
  const tokenTypeFilter = (
    <PopoverFilter isActive={ tokenTypes && tokenTypes.length > 0 } contentProps={{ w: '200px' }} appliedFiltersNum={ tokenTypes?.length }>
      <TokenTypeFilter onChange={ onTokenTypesChange } defaultValue={ tokenTypes }/>
    </PopoverFilter>
  );

  const bridgedChainsFilter = (
    <PopoverFilter isActive={ bridgeChains && bridgeChains.length > 0 } contentProps={{ maxW: '350px' }} appliedFiltersNum={ bridgeChains?.length }>
      <TokensBridgedChainsFilter onChange={ onBridgeChainsChange } defaultValue={ bridgeChains }/>
    </PopoverFilter>
  );

  const filter = activeTab === 'bridged' ? bridgedChainsFilter : tokenTypeFilter;

  const searchInput = (
    <FilterInput
      key={ activeTab }
      w={{ base: '100%', lg: '360px' }}
      size="xs"
      onChange={ onSearchChange }
      placeholder="Token name or symbol"
      initialValue={ searchTerm }
    />
  );

  return (
    <>
      <HStack spacing={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { filter }
        <Sort
          key={ activeTab }
          options={ SORT_OPTIONS }
          setSort={ onSortChange }
          sort={ sort }
        />
        { searchInput }
      </HStack>
      <ActionBar
        mt={ inTabsSlot ? 0 : -6 }
        py={ inTabsSlot ? 0 : undefined }
        justifyContent={ inTabsSlot ? 'space-between' : undefined }
        display={{ base: pagination.isVisible ? 'flex' : 'none', lg: 'flex' }}
      >
        <HStack spacing={ 3 } display={{ base: 'none', lg: 'flex' }}>
          { filter }
          { searchInput }
        </HStack>
        <Pagination { ...pagination } ml={ inTabsSlot ? 8 : 'auto' }/>
      </ActionBar>
    </>
  );
};

export default React.memo(TokensActionBar);
