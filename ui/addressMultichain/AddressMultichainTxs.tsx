import { HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import multichainConfig from 'configs/multichain';
import { MultichainProvider } from 'lib/contexts/multichain';
import getQueryParamString from 'lib/router/getQueryParamString';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
// import AddressCsvExportLink from 'ui/address/AddressCsvExportLink';
import AddressTxsFilter from 'ui/address/AddressTxsFilter';
import useAddressTxsQuery from 'ui/address/useAddressTxsQuery';
import SubchainSelect from 'ui/shared/multichain/SubchainSelect';
import useSubchainSelect from 'ui/shared/multichain/useSubchainSelect';
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

  const subchainSelect = useSubchainSelect();

  const txsQueryLocal = useAddressTxsQuery({
    addressHash: hash,
    enabled: tab === 'local_txs',
    subchain: multichainConfig.chains.find((chain) => chain.id === subchainSelect.value[0]),
  });

  const txsLocalFilter = tab === 'local_txs' ? (
    <AddressTxsFilter
      initialValue={ txsQueryLocal.filterValue }
      onFilterChange={ txsQueryLocal.onFilterChange }
      hasActiveFilter={ Boolean(txsQueryLocal.filterValue) }
      isLoading={ txsQueryLocal.query.pagination.isLoading }
    />
  ) : null;

  const rightSlot = tab === 'local_txs' ? (
    <>
      <HStack gap={ 2 }>
        { txsLocalFilter }
        <SubchainSelect
          loading={ txsQueryLocal.query.pagination.isLoading }
          value={ subchainSelect.value }
          onValueChange={ subchainSelect.onChange }
        />
      </HStack>
      <HStack gap={ 6 }>
        { /* <AddressCsvExportLink
          address={ hash }
          params={{ type: 'transactions', filterType: 'address', filterValue: txsQueryLocal.filterValue }}
          ml="auto"
          isLoading={ txsQueryLocal.query.pagination.isLoading }
        /> */ }
        <Pagination { ...txsQueryLocal.query.pagination } ml={ 8 }/>
      </HStack>
    </>
  ) : null;

  const tabs: Array<TabItemRegular> = [
    {
      id: 'cross_chain_txs',
      title: 'Cross-chain',
      component: <div>Coming soon 🔜</div>,
    },
    {
      id: 'local_txs',
      title: 'Local',
      component: (
        <MultichainProvider subchainId={ subchainSelect.value[0] }>
          <TxsWithAPISorting
            filter={ txsLocalFilter }
            filterValue={ txsQueryLocal.filterValue }
            query={ txsQueryLocal.query }
            currentAddress={ hash }
            enableTimeIncrement
            socketType="address_txs"
            top={ ACTION_BAR_HEIGHT_DESKTOP }
            sorting={ txsQueryLocal.sort }
            setSort={ txsQueryLocal.setSort }
          />
        </MultichainProvider>
      ),
    },
  ];

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
