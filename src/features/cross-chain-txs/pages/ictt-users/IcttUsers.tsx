// SPDX-License-Identifier: LicenseRef-Blockscout

import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { CrossChainChainsStatsSorting, CrossChainChainsStatsSortingField, CrossChainChainsStatsSortingValue } from '../../types/api';

import ActionBar from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';
import getSortParamsFromValue from 'src/shared/sort/get-sort-params-from-value';
import getSortValueFromQuery from 'src/shared/sort/get-sort-value-from-query';
import Sort from 'src/shared/sort/Sort';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import { INTERCHAIN_STATS_CHAINS_ITEM } from '../../stubs/messages';
import { ICTT_USERS_SORT_OPTIONS } from '../../utils/ictt-sort';
import IcttUsersTable from './IcttUsersTable';

const sortCollection = createListCollection({
  items: ICTT_USERS_SORT_OPTIONS,
});

const IcttUsers = () => {
  const isMobile = useIsMobile();

  const { data, isInitialLoading, isTransitioning, isError, sorting, onSortingChange, pagination, queryHash } = useApiPaginatedQuery({
    resourceName: 'interchainIndexer:stats_chains',
    options: {
      placeholderData: generateListStub<'interchainIndexer:stats_chains'>(INTERCHAIN_STATS_CHAINS_ITEM, 50, { next_page_params: { page_token: 'token' } }),
    },
  });

  const sort = getSortValueFromQuery<CrossChainChainsStatsSortingValue>({ ...sorting }, ICTT_USERS_SORT_OPTIONS) ?? 'default';

  const handleSortChange = React.useCallback(({ value }: { value: Array<string> }) => {
    onSortingChange(
      getSortParamsFromValue<CrossChainChainsStatsSortingValue, CrossChainChainsStatsSortingField, CrossChainChainsStatsSorting['order']>(
        value[0] as CrossChainChainsStatsSortingValue,
      ),
    );
  }, [ onSortingChange ]);

  const actionBar = isMobile || pagination.isVisible ? (
    <ActionBar>
      <Sort
        name="ictt_users_sorting"
        defaultValue={ [ sort ] }
        collection={ sortCollection }
        onValueChange={ handleSortChange }
        isLoading={ isInitialLoading }
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
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no ICTT users."
        emptyStateProps={{
          term: 'ICTT user',
        }}
        actionBar={ actionBar }
        isTransitioning={ isTransitioning }
      >
        { data?.items ? (
          <TableContainerScrollable>
            <IcttUsersTable
              data={ data.items }
              sort={ sort }
              setSorting={ handleSortChange }
              isLoading={ isInitialLoading }
              resetKey={ queryHash }
            />
          </TableContainerScrollable>
        ) : null }
      </DataList>
    </>
  );
};

export default React.memo(IcttUsers);
