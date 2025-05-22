import { HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import getQueryParamString from 'lib/router/getQueryParamString';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import AddressCsvExportLink from 'ui/address/AddressCsvExportLink';
import AddressTxsFilter from 'ui/address/AddressTxsFilter';
import useAddressTxsQuery from 'ui/address/useAddressTxsQuery';
import MultichainSelect from 'ui/shared/multichain/MultichainSelect';
import Pagination from 'ui/shared/pagination/Pagination';
import TxsWithAPISorting from 'ui/txs/TxsWithAPISorting';

export const ADDRESS_MULTICHAIN_TXS_TAB_IDS = [ 'cross_chain_txs', 'local_txs' ];
const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 3,
  marginTop: -6,
};
const ACTION_BAR_HEIGHT_DESKTOP = 68;

const AddressMultichainTxs = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const tab = getQueryParamString(router.query.tab);

  const txsQueryLocal = useAddressTxsQuery({
    addressHash: hash,
    enabled: tab === 'local_txs',
  });

  const rightSlot = tab === 'local_txs' ? (
    <>
      <HStack gap={ 2 }>
        <AddressTxsFilter
          initialValue={ txsQueryLocal.filterValue }
          onFilterChange={ txsQueryLocal.onFilterChange }
          hasActiveFilter={ Boolean(txsQueryLocal.filterValue) }
          isLoading={ txsQueryLocal.query.pagination.isLoading }
        />
        <MultichainSelect loading={ txsQueryLocal.query.pagination.isLoading }/>
      </HStack>
      <HStack gap={ 6 }>
        <AddressCsvExportLink
          address={ hash }
          params={{ type: 'transactions', filterType: 'address', filterValue: txsQueryLocal.filterValue }}
          ml="auto"
          isLoading={ txsQueryLocal.query.pagination.isLoading }
        />
        <Pagination { ...txsQueryLocal.query.pagination } ml={ 8 }/>
      </HStack>
    </>
  ) : null;

  const tabs: Array<TabItemRegular> = React.useMemo(() => {
    return [
      {
        id: 'cross_chain_txs',
        title: 'Cross-chain',
        component: <div>Coming soon 🔜</div>,
      },
      {
        id: 'local_txs',
        title: 'Local',
        component: (
          <TxsWithAPISorting
            // filter={ filter }
            filterValue={ txsQueryLocal.filterValue }
            query={ txsQueryLocal.query }
            currentAddress={ hash }
            enableTimeIncrement
            socketType="address_txs"
            top={ ACTION_BAR_HEIGHT_DESKTOP }
            sorting={ txsQueryLocal.sort }
            setSort={ txsQueryLocal.setSort }
          />
        ),
      },
    ];
  }, [ hash, txsQueryLocal.filterValue, txsQueryLocal.query, txsQueryLocal.setSort, txsQueryLocal.sort ]);

  return (
    <RoutedTabs
      variant="secondary"
      size="sm"
      tabs={ tabs }
      rightSlot={ rightSlot }
      rightSlotProps={{ display: 'flex', justifyContent: 'space-between', ml: 8, widthAllocation: 'available' }}
      listProps={ TAB_LIST_PROPS }
      stickyEnabled
    />
  );
};

export default React.memo(AddressMultichainTxs);
