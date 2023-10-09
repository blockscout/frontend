import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { TokensSortingValue } from 'types/api/tokens';
import type { PaginationParams } from 'ui/shared/pagination/types';

import ActionBar from 'ui/shared/ActionBar';
import FilterInput from 'ui/shared/filters/FilterInput';
import Pagination from 'ui/shared/pagination/Pagination';
import Sort from 'ui/shared/sort/Sort';
import { SORT_OPTIONS } from 'ui/tokens/utils';

interface Props {
  pagination: PaginationParams;
  searchTerm: string | undefined;
  onSearchChange: (value: string) => void;
  sort: TokensSortingValue | undefined;
  onSortChange: () => void;
  filter: React.ReactNode;
  inTabsSlot?: boolean;
}

const TokensActionBar = ({
  sort,
  onSortChange,
  searchTerm,
  onSearchChange,
  pagination,
  filter,
  inTabsSlot,
}: Props) => {

  const searchInput = (
    <FilterInput
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
