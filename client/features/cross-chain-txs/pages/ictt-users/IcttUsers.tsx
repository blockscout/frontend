import { Box, createListCollection } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { CrossChainChainsStatsSorting, CrossChainChainsStatsSortingField, CrossChainChainsStatsSortingValue } from '../../types/api';

import useIsMobile from 'lib/hooks/useIsMobile';
import { INTERCHAIN_STATS_CHAINS_ITEM } from 'stubs/interchainIndexer';
import { generateListStub } from 'stubs/utils';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import Sort from 'ui/shared/sort/Sort';

import { ICTT_USERS_SORT_OPTIONS } from '../../utils/ictt-sort';
import IcttUsersListItem from './IcttUsersListItem';
import IcttUsersTable from './IcttUsersTable';

const sortCollection = createListCollection({
  items: ICTT_USERS_SORT_OPTIONS,
});

const IcttUsers = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [ sort, setSort ] = React.useState<CrossChainChainsStatsSortingValue>(
    getSortValueFromQuery<CrossChainChainsStatsSortingValue>(router.query, ICTT_USERS_SORT_OPTIONS) ?? 'default',
  );

  const { data, isPlaceholderData, isError, onSortingChange, pagination } = useQueryWithPages({
    resourceName: 'interchainIndexer:stats_chains',
    sorting: getSortParamsFromValue<CrossChainChainsStatsSortingValue, CrossChainChainsStatsSortingField, CrossChainChainsStatsSorting['order']>(sort),
    options: {
      placeholderData: generateListStub<'interchainIndexer:stats_chains'>(INTERCHAIN_STATS_CHAINS_ITEM, 50, { next_page_params: { page_token: 'token' } }),
    },
  });

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSort(value[0] as CrossChainChainsStatsSortingValue);
    onSortingChange(value[0] === 'default' ? undefined : getSortParamsFromValue(value[0] as CrossChainChainsStatsSortingValue));
  }, [ onSortingChange ]);

  const actionBar = isMobile || pagination.isVisible ? (
    <ActionBar>
      <Sort
        name="ictt_users_sorting"
        defaultValue={ [ sort ] }
        collection={ sortCollection }
        onValueChange={ handleSortChange }
        isLoading={ isPlaceholderData }
        hideFrom="lg"
      />
      <Pagination { ...pagination } ml="auto"/>
    </ActionBar>
  ) : null;

  return (
    <>
      <PageTitle
        title="ICTT users"
        withTextAd
        secondRow="Number of unique users per chain who sent and received cross-chain token transfers"
        secondRowProps={{ minH: 'auto' }}
      />
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no ICTT users."
        emptyStateProps={{
          term: 'ICTT user',
        }}
        actionBar={ actionBar }
      >
        { data?.items ? (
          <>
            <Box hideFrom="lg">
              { data.items.map((item, index) => (
                <IcttUsersListItem key={ String(item.id) + (isPlaceholderData ? index : '') } data={ item } isLoading={ isPlaceholderData }/>
              )) }
            </Box>
            <Box hideBelow="lg">
              <IcttUsersTable data={ data.items } sort={ sort } setSorting={ handleSortChange } isLoading={ isPlaceholderData }/>
            </Box>
          </>
        ) : null }
      </DataListDisplay>
    </>
  );
};

export default React.memo(IcttUsers);
