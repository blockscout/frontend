import { Checkbox, CheckboxGroup, HStack, Text } from '@chakra-ui/react';
import React from 'react';

import type { EnsDomainLookupFiltersOptions } from 'types/api/ens';
import type { PaginationParams } from 'ui/shared/pagination/types';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import ActionBar from 'ui/shared/ActionBar';
import FilterInput from 'ui/shared/filters/FilterInput';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import Pagination from 'ui/shared/pagination/Pagination';
import Sort from 'ui/shared/sort/Sort';

import type { Sort as TSort } from './utils';
import { SORT_OPTIONS } from './utils';

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
  filterValue: EnsDomainLookupFiltersOptions;
  onFilterValueChange: (nextValue: EnsDomainLookupFiltersOptions) => void;
  sort: TSort | undefined;
  onSortChange: (nextValue: TSort | undefined) => void;
  isLoading: boolean;
}

const NameDomainsActionBar = ({ searchTerm, onSearchChange, filterValue, onFilterValueChange, sort, onSortChange, isLoading }: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);

  const searchInput = (
    <FilterInput
      w={{ base: '100%', lg: '360px' }}
      size="xs"
      onChange={ onSearchChange }
      placeholder="Search by name"
      initialValue={ searchTerm }
      isLoading={ isInitialLoading }
    />
  );

  const filter = (
    <PopoverFilter appliedFiltersNum={ filterValue.length } contentProps={{ w: '220px' }} isLoading={ isInitialLoading }>
      <div>
        <CheckboxGroup size="lg" onChange={ onFilterValueChange } value={ filterValue } defaultValue={ filterValue }>
          <Text variant="secondary" fontWeight={ 600 } mb={ 3 } fontSize="sm">Address</Text>
          <Checkbox value="ownedBy" display="block">
            Owned by
          </Checkbox>
          <Checkbox
            value="resolvedTo"
            display="block"
            mt={ 5 }
            mb={ 4 }
            pb={ 4 }
            borderBottom="1px solid"
            borderColor="divider"
          >
            Resolved to address
          </Checkbox>
          <Text variant="secondary" fontWeight={ 600 } mb={ 3 } fontSize="sm">Status</Text>
          <Checkbox value="withInactive" display="block">
            Include expired
          </Checkbox>
        </CheckboxGroup>
      </div>
    </PopoverFilter>
  );

  const sortButton = (
    <Sort
      options={ SORT_OPTIONS }
      sort={ sort }
      setSort={ onSortChange }
      isLoading={ isInitialLoading }
    />
  );

  return (
    <>
      <HStack spacing={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { filter }
        { sortButton }
        { searchInput }
      </HStack>
      <ActionBar
        mt={ -6 }
        display={{ base: pagination.isVisible ? 'flex' : 'none', lg: 'flex' }}
      >
        <HStack spacing={ 3 } display={{ base: 'none', lg: 'flex' }}>
          { filter }
          { searchInput }
        </HStack>
        <Pagination { ...pagination } ml="auto"/>
      </ActionBar>
    </>
  );
};

export default React.memo(NameDomainsActionBar);
