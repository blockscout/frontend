// SPDX-License-Identifier: LicenseRef-Blockscout

import { createListCollection, Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { INTERNAL_TX } from 'src/slices/internal-tx/stubs';
import TxPendingAlert from 'src/slices/tx/components/TxPendingAlert';
import TxSocketAlert from 'src/slices/tx/components/TxSocketAlert';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import compareBns from 'src/shared/numbers/compareBns';
import Pagination from 'src/shared/pagination/Pagination';
import { generateListStub } from 'src/shared/pagination/utils';
import { default as getNextSortValueShared } from 'src/shared/sort/get-next-sort-value';
import Sort from 'src/shared/sort/Sort';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import InternalTxsZeroValueSwitch from '../../components/InternalTxsZeroValueSwitch';
import { useInternalTxsPaginatedQuery } from '../../hooks/useInternalTxsPaginatedQuery';
import type { Sort as SortValue, SortField } from '../../utils/utils';
import { SORT_OPTIONS, SORT_SEQUENCE } from './sort';
import TxInternalsTable from './TxInternalsTable';

const sortCollection = createListCollection({
  items: SORT_OPTIONS,
});

const getNextSortValue = (getNextSortValueShared<SortField, SortValue>).bind(undefined, SORT_SEQUENCE);

const sortFn = (sort: SortValue) => (a: schemas['InternalTransaction'], b: schemas['InternalTransaction']) => {
  switch (sort) {
    case 'value-desc': {
      return compareBns(b.value, a.value);
    }

    case 'value-asc': {
      return compareBns(a.value, b.value);
    }

    case 'gas-limit-desc': {
      return compareBns(b.gas_limit || '0', a.gas_limit || '0');
    }

    case 'gas-limit-asc': {
      return compareBns(a.gas_limit || '0', b.gas_limit || '0');

    }

    default:
      return 0;
  }
};

interface Props {
  txQuery: TxQuery;
}

const TxInternals = ({ txQuery }: Props) => {
  const isMobile = useIsMobile();
  const [ sort, setSort ] = React.useState<SortValue>('default');
  const { data, isInitialLoading, isTransitioning, isError, pagination, queryHash, isZeroValueShown, onZeroValueToggle } = useInternalTxsPaginatedQuery({
    resourceName: 'core:tx_internal_txs',
    pathParams: { hash: txQuery.data?.hash },
    options: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.hash) && Boolean(txQuery.data?.status),
      placeholderData: generateListStub<'core:tx_internal_txs'>(INTERNAL_TX, 3, { next_page_params: null, meta: { message: null, status: 1 } }),
    },
  });

  const handleSortToggle = React.useCallback((field: SortField) => {
    if (isInitialLoading) {
      return;
    }

    setSort(getNextSortValue(field));
  }, [ isInitialLoading ]);

  const handleSortValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSort(value[0] as SortValue);
  }, []);

  if (!txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data?.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  const filteredData = data?.items
    .slice()
    .sort(sortFn(sort));

  const content = filteredData ? (
    <TableContainerScrollable>
      <TxInternalsTable
        data={ filteredData }
        sort={ sort }
        onSortToggle={ handleSortToggle }
        top={ ACTION_BAR_HEIGHT_DESKTOP }
        isLoading={ isInitialLoading }
        resetKey={ queryHash }
      />
    </TableContainerScrollable>
  ) : null;

  const zeroValueSwitch = (
    <InternalTxsZeroValueSwitch
      isChecked={ isZeroValueShown }
      onChange={ onZeroValueToggle }
      isLoading={ pagination.isLoading }
      ml={{ base: 'auto', lg: 0 }}
    />
  );

  const actionBar = (
    <>
      { isMobile && (
        <Flex mb={ 6 } alignItems="center">
          <Sort
            name="tx_internal_txs_sorting"
            defaultValue={ [ sort ] }
            collection={ sortCollection }
            onValueChange={ handleSortValueChange }
            isLoading={ isInitialLoading }
          />
          { zeroValueSwitch }
        </Flex>
      ) }
      { (!isMobile || pagination.isVisible) && (
        <ActionBar mt={ -6 }>
          { !isMobile && zeroValueSwitch }
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
    </>
  );

  return (
    <DataList
      isError={ isError || txQuery.isError }
      itemsNum={ data?.items.length }
      emptyText="There are no internal transactions for this transaction."
      actionBar={ actionBar }
      showActionBarIfEmpty
      showActionBarIfError
      isTransitioning={ isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default TxInternals;
