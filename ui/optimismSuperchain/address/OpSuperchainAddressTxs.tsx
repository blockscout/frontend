import { HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import multichainConfig from 'configs/multichain';
import getSocketUrl from 'lib/api/getSocketUrl';
import { MultichainProvider } from 'lib/contexts/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { SocketProvider } from 'lib/socket/context';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import AddressCsvExportLink from 'ui/address/AddressCsvExportLink';
import AddressTxsFilter from 'ui/address/AddressTxsFilter';
import useAddressTxsQuery from 'ui/address/useAddressTxsQuery';
import useAddressCountersQuery from 'ui/address/utils/useAddressCountersQuery';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import ChainSelect from 'ui/shared/multichain/ChainSelect';
import Pagination from 'ui/shared/pagination/Pagination';
import TxsWithAPISorting from 'ui/txs/TxsWithAPISorting';

import ListCounterText from '../components/ListCounterText';

export const ADDRESS_OP_SUPERCHAIN_TXS_TAB_IDS = [ 'txs_cross_chain' as const, 'txs_local' as const ];
const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 3,
  marginTop: -6,
};
const TABS_RIGHT_SLOT_PROPS = {
  display: 'flex',
  justifyContent: { base: 'flex-end', lg: 'space-between' },
  ml: { base: 0, lg: 8 },
  widthAllocation: 'available' as const,
};

const AddressOpSuperchainTxs = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const hash = getQueryParamString(router.query.hash);
  const tab = getQueryParamString(router.query.tab) as typeof ADDRESS_OP_SUPERCHAIN_TXS_TAB_IDS[number] | undefined;

  const txsQueryLocal = useAddressTxsQuery({
    addressHash: hash,
    enabled: tab === 'txs_local',
    isMultichain: true,
  });

  const chainSlug = txsQueryLocal.query.chainValue?.[0];
  const chainData = multichainConfig()?.chains.find(chain => chain.slug === chainSlug);

  const countersQueryLocal = useAddressCountersQuery({
    hash,
    isLoading: txsQueryLocal.query.isPlaceholderData,
    isEnabled: tab === 'txs_local',
    chainSlug,
  });

  const txsLocalFilter = tab === 'txs_local' ? (
    <AddressTxsFilter
      initialValue={ txsQueryLocal.filterValue }
      onFilterChange={ txsQueryLocal.onFilterChange }
      hasActiveFilter={ Boolean(txsQueryLocal.filterValue) }
      isLoading={ txsQueryLocal.query.pagination.isLoading }
    />
  ) : null;

  const countersText = (() => {
    if (tab === 'txs_local') {
      return (
        <ListCounterText
          key={ chainSlug }
          value={ countersQueryLocal.data?.transactions_count }
          isLoading={ countersQueryLocal.isPlaceholderData || txsQueryLocal.query.isPlaceholderData }
          type="transaction"
        />
      );
    }

    return null;
  })();

  const chainSelect = (
    <ChainSelect
      loading={ txsQueryLocal.query.pagination.isLoading }
      value={ txsQueryLocal.query.chainValue }
      onValueChange={ txsQueryLocal.query.onChainValueChange }
    />
  );

  const rightSlot = (() => {
    if (tab === 'txs_local') {
      if (isMobile) {
        return chainSelect;
      }

      return (
        <>
          <HStack gap={ 2 }>
            { txsLocalFilter }
            { chainSelect }
            { countersText }
          </HStack>
          <HStack gap={ 6 }>
            <AddressCsvExportLink
              address={ hash }
              params={{ type: 'transactions', filterType: 'address', filterValue: txsQueryLocal.filterValue }}
              isLoading={ txsQueryLocal.query.pagination.isLoading }
              chainConfig={ chainData?.config }
            />
            <Pagination { ...txsQueryLocal.query.pagination }/>
          </HStack>
        </>
      );
    }
  })();

  const tabs: Array<TabItemRegular> = [
    {
      id: 'txs_cross_chain',
      title: 'Cross-chain',
      component: <div>Coming soon 🔜</div>,
    },
    {
      id: 'txs_local',
      title: 'Local',
      component: (
        <SocketProvider url={ getSocketUrl(chainData?.config) }>
          <MultichainProvider chainSlug={ txsQueryLocal.query.chainValue?.[0] }>
            { isMobile && countersText }
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
        </SocketProvider>
      ),
    },
  ];

  return (
    <RoutedTabs
      variant="secondary"
      size="sm"
      tabs={ tabs }
      rightSlot={ rightSlot }
      rightSlotProps={ TABS_RIGHT_SLOT_PROPS }
      listProps={ isMobile ? undefined : TAB_LIST_PROPS }
      stickyEnabled={ !isMobile }
    />
  );
};

export default React.memo(AddressOpSuperchainTxs);
