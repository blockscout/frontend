import { Box, createListCollection, HStack } from '@chakra-ui/react';
import React from 'react';

import { MultichainProvider } from 'lib/contexts/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import { apos } from 'toolkit/utils/htmlEntities';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import ChainSelect from 'ui/shared/multichain/ChainSelect';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import Sort from 'ui/shared/sort/Sort';
import useVerifiedContractsQuery from 'ui/verifiedContracts/useVerifiedContractsQuery';
import { SORT_OPTIONS } from 'ui/verifiedContracts/utils';
import VerifiedContractsCounters from 'ui/verifiedContracts/VerifiedContractsCounters';
import VerifiedContractsFilter from 'ui/verifiedContracts/VerifiedContractsFilter';
import VerifiedContractsList from 'ui/verifiedContracts/VerifiedContractsList';
import VerifiedContractsTable from 'ui/verifiedContracts/VerifiedContractsTable';

const sortCollection = createListCollection({
  items: SORT_OPTIONS,
});

const OpSuperchainVerifiedContracts = () => {
  const isMobile = useIsMobile();

  const { query, type, searchTerm, sort, onSearchTermChange, onTypeChange, onSortChange } = useVerifiedContractsQuery({ isMultichain: true });
  const { isError, isPlaceholderData, data, pagination, chainValue, onChainValueChange } = query;

  const typeFilter = (
    <VerifiedContractsFilter
      onChange={ onTypeChange }
      defaultValue={ type }
      hasActiveFilter={ Boolean(type) }
    />
  );

  const filterInput = (
    <FilterInput
      w={{ base: '100%', lg: '350px' }}
      size="sm"
      onChange={ onSearchTermChange }
      placeholder="Search by contract name or address"
      initialValue={ searchTerm }
    />
  );

  const sortButton = (
    <Sort
      name="verified_contracts_sorting"
      defaultValue={ [ sort ] }
      collection={ sortCollection }
      onValueChange={ onSortChange }
      isLoading={ isPlaceholderData }
    />
  );

  const actionBar = (
    <>
      <HStack gap={ 3 } mb={ 6 } display={{ base: 'flex', lg: 'none' }}>
        { typeFilter }
        { sortButton }
        { filterInput }
      </HStack>
      { (!isMobile || pagination.isVisible) && (
        <ActionBar mt={ -6 }>
          <HStack gap={ 3 } display={{ base: 'none', lg: 'flex' }}>
            { typeFilter }
            { filterInput }
          </HStack>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
    </>
  );

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        <VerifiedContractsList data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
      <Box hideBelow="lg">
        <VerifiedContractsTable data={ data.items } sort={ sort } setSorting={ onSortChange } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  return (
    <Box>
      <PageTitle
        title="Verified contracts"
        withTextAd
      />
      <ChainSelect
        value={ chainValue }
        onValueChange={ onChainValueChange }
        mb={ 3 }
      />
      <MultichainProvider chainSlug={ chainValue?.[0] }>
        <VerifiedContractsCounters/>
        <DataListDisplay
          isError={ isError }
          itemsNum={ data?.items.length }
          emptyText="There are no verified contracts."
          filterProps={{
            emptyFilteredText: `Couldn${ apos }t find any contract that matches your query.`,
            hasActiveFilters: Boolean(searchTerm || type),
          }}
          actionBar={ actionBar }
        >
          { content }
        </DataListDisplay>
      </MultichainProvider>
    </Box>
  );
};

export default React.memo(OpSuperchainVerifiedContracts);
