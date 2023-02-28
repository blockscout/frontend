import { Box, Flex, Hide, Show, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { VerifiedContract, VerifiedContractsFilters } from 'types/api/contracts';

import compareBns from 'lib/bigint/compareBns';
import useDebounce from 'lib/hooks/useDebounce';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { apos } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
import EmptySearchResult from 'ui/apps/EmptySearchResult';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import FilterInput from 'ui/shared/filters/FilterInput';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import type { Sort, SortField } from 'ui/verifiedContracts/utils';
import VerifiedContractsFilter from 'ui/verifiedContracts/VerifiedContractsFilter';
import VerifiedContractsTable from 'ui/verifiedContracts/VerifiedContractsTable';

const SORT_SEQUENCE: Record<SortField, Array<Sort | undefined>> = {
  balance: [ 'balance-desc', 'balance-asc', undefined ],
  txs: [ 'txs-desc', 'txs-asc', undefined ],
};

const getNextSortValue = (field: SortField) => (prevValue: Sort | undefined) => {
  const sequence = SORT_SEQUENCE[field];
  const curIndex = sequence.findIndex((sort) => sort === prevValue);
  const nextIndex = curIndex + 1 > sequence.length - 1 ? 0 : curIndex + 1;
  return sequence[nextIndex];
};

const sortFn = (sort: Sort | undefined) => (a: VerifiedContract, b: VerifiedContract) => {
  switch (sort) {
    case 'balance-desc': {
      const result = compareBns(b.coin_balance, a.coin_balance);
      return a.coin_balance === b.coin_balance ? 0 : result;
    }

    case 'balance-asc': {
      const result = compareBns(a.coin_balance, b.coin_balance);
      return a.coin_balance === b.coin_balance ? 0 : result;
    }

    case 'txs-desc': {
      const result = (a.tx_count || 0) > (b.tx_count || 0) ? -1 : 1;
      return a.tx_count === b.tx_count ? 0 : result;
    }

    case 'txs-asc': {
      const result = (a.tx_count || 0) > (b.tx_count || 0) ? 1 : -1;
      return a.tx_count === b.tx_count ? 0 : result;
    }

    default:
      return 0;
  }
};

const VerifiedContracts = () => {
  const router = useRouter();
  const [ searchTerm, setSearchTerm ] = React.useState(getQueryParamString(router.query.q) || undefined);
  const [ type, setType ] = React.useState(getQueryParamString(router.query.filter) as VerifiedContractsFilters['filter'] || undefined);
  const [ sort, setSort ] = React.useState<Sort>();

  const debouncedSearchTerm = useDebounce(searchTerm || '', 300);

  const { isError, isLoading, data, isPaginationVisible, pagination, onFilterChange } = useQueryWithPages({
    resourceName: 'verified_contracts',
    filters: { q: debouncedSearchTerm, filter: type },
  });

  const handleSearchTemChange = React.useCallback((value: string) => {
    onFilterChange({ q: value, filter: type });
    setSearchTerm(value);
  }, [ type, onFilterChange ]);

  const handleTypeChange = React.useCallback((value: string | Array<string>) => {
    if (Array.isArray(value)) {
      return;
    }

    if ((value === 'vyper' || value === 'solidity')) {
      onFilterChange({ q: debouncedSearchTerm, filter: value });
      setType(value);
      return;
    }

    onFilterChange({ q: debouncedSearchTerm, filter: undefined });
    setType(undefined);
  }, [ debouncedSearchTerm, onFilterChange ]);

  const handleSortToggle = React.useCallback((field: SortField) => {
    return () => {
      setSort(getNextSortValue(field));
    };
  }, []);

  const typeFilter = <VerifiedContractsFilter onChange={ handleTypeChange } defaultValue={ type } isActive={ Boolean(type) }/>;

  const filterInput = (
    <FilterInput
      w={{ base: '100%', lg: '350px' }}
      size="xs"
      onChange={ handleSearchTemChange }
      placeholder="Search by contract name or address"
      initialValue={ searchTerm }
    />
  );

  const bar = (
    <>
      <Flex columnGap={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { typeFilter }
        { filterInput }
      </Flex>
      <ActionBar mt={ -6 }>
        <Flex columnGap={ 3 } display={{ base: 'none', lg: 'flex' }}>
          { typeFilter }
          { filterInput }
        </Flex>
        { isPaginationVisible && <Pagination ml="auto" { ...pagination }/> }
      </ActionBar>
    </>
  );

  const content = (() => {
    if (isError) {
      return <DataFetchAlert/>;
    }

    if (isLoading) {
      return (
        <>
          <Show below="lg" ssr={ false }>
            <SkeletonList/>
          </Show>
          <Hide below="lg" ssr={ false }>
            <SkeletonTable columns={ [ '50%', '130px', '130px', '50%', '80px', '110px', '120px' ] }/>
          </Hide>
        </>
      );
    }

    if (data.items.length === 0 && !searchTerm && !type) {
      return <Text as="span">There are no verified contracts</Text>;
    }

    if (data.items.length === 0) {
      return <EmptySearchResult text={ `Couldn${ apos }t find any contract that matches your query.` }/>;
    }

    const sortedData = data.items.slice().sort(sortFn(sort));

    return (
      <>
        <Show below="lg" ssr={ false }>
          { '<AddressIntTxsList data={ data.items } currentAddress={ hash }/>' }
        </Show>
        <Hide below="lg" ssr={ false }>
          <VerifiedContractsTable data={ sortedData } sort={ sort } onSortToggle={ handleSortToggle }/>
        </Hide>
      </>
    );
  })();

  return (
    <Box>
      <PageTitle text="Verified contracts" withTextAd/>
      { bar }
      { content }
    </Box>
  );
};

export default VerifiedContracts;
