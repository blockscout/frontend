import { HStack } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from 'ui/shared/pagination/types';

import ActionBar from 'ui/shared/ActionBar';
import FilterInput from 'ui/shared/filters/FilterInput';
import Pagination from 'ui/shared/pagination/Pagination';

const pagination: PaginationParams = {
  isVisible: true,
  isLoading: false,
  page: 1,
  hasPages: true,
  hasNextPage: true,
  canGoBackwards: false,
  onNextPageClick: () => {},
  onPrevPageClick: () => {},
  resetPage: () => {},
};

interface Props {
  pagination?: PaginationParams;
  searchTerm: string | undefined;
  onSearchChange: (value: string) => void;
  inTabsSlot?: boolean;
}

const NameDomainsActionBar = ({ searchTerm, onSearchChange }: Props) => {

  const searchInput = (
    <FilterInput
      w={{ base: '100%', lg: '360px' }}
      size="xs"
      onChange={ onSearchChange }
      placeholder="Search by name"
      initialValue={ searchTerm }
    />
  );

  return (
    <>
      <HStack spacing={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { searchInput }
      </HStack>
      <ActionBar
        mt={ -6 }
        display={{ base: pagination.isVisible ? 'flex' : 'none', lg: 'flex' }}
      >
        <HStack spacing={ 3 } display={{ base: 'none', lg: 'flex' }}>
          { searchInput }
        </HStack>
        <Pagination { ...pagination } ml="auto"/>
      </ActionBar>
    </>
  );
};

export default React.memo(NameDomainsActionBar);
