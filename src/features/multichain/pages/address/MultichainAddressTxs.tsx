// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import { SocketProvider } from 'src/api/socket/context';
import getSocketUrl from 'src/api/socket/get-socket-url';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import useAddressCountersQuery from 'src/slices/address/hooks/useAddressCountersQuery';
import AddressTxsFilter from 'src/slices/address/pages/details/txs/AddressTxsFilter';
import useAddressTxsQuery from 'src/slices/address/pages/details/txs/useAddressTxsQuery';
import TxsWithApiSorting from 'src/slices/tx/pages/index/list/TxsWithApiSorting';

import TransactionsCrossChainContent from 'src/features/cross-chain-txs/components/txs/TransactionsCrossChainContent';
import { INTERCHAIN_MESSAGE } from 'src/features/cross-chain-txs/stubs/messages';
import CsvExport from 'src/features/csv-export/components/CsvExport';
import multichainConfig from 'src/features/multichain/chains-config';
import ChainSelect from 'src/features/multichain/components/ChainSelect';
import ListCounterText from 'src/features/multichain/components/ListCounterText';
import { MultichainProvider } from 'src/features/multichain/context';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { EmptyState } from 'src/toolkit/chakra/empty-state';
import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

import getAvailableChainIds from './get-available-chain-ids';

export const ADDRESS_MULTICHAIN_TXS_TAB_IDS = [ 'txs_cross_chain' as const, 'txs_local' as const ];
const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 3,
  marginTop: -6,
};
const TABS_RIGHT_SLOT_PROPS = {
  display: 'flex',
  justifyContent: { base: 'flex-end', lg: 'space-between' },
  alignItems: 'center',
  ml: { base: 0, lg: 8 },
  widthAllocation: 'available' as const,
};

interface Props {
  addressData: multichain.GetAddressResponse | undefined;
  isLoading: boolean;
}

const MultichainAddressTxs = ({ addressData, isLoading }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const hash = getQueryParamString(router.query.hash);
  const tab = getQueryParamString(router.query.tab) as typeof ADDRESS_MULTICHAIN_TXS_TAB_IDS[number] | 'txs' | undefined;
  const isLocalTab = tab === 'txs_local' || tab === 'txs';

  const chainIds = React.useMemo(() => getAvailableChainIds(addressData), [ addressData ]);

  const txsQueryCrossChain = useQueryWithPages({
    resourceName: 'interchainIndexer:address_messages',
    pathParams: { hash },
    options: {
      placeholderData: generateListStub<'interchainIndexer:address_messages'>(INTERCHAIN_MESSAGE, 50, { next_page_params: undefined }),
      enabled: !isLoading && !isLocalTab,
    },
  });

  const txsQueryLocal = useAddressTxsQuery({
    addressHash: hash,
    enabled: !isLoading && isLocalTab && chainIds.length > 0,
    isMultichain: true,
    chainIds,
  });

  const chainId = txsQueryLocal.query.chainValue?.[0];
  const chainData = multichainConfig()?.chains.find(chain => chain.id === chainId);

  const countersQueryLocal = useAddressCountersQuery({
    hash,
    isLoading: txsQueryLocal.query.isPlaceholderData || isLoading,
    isEnabled: !isLoading && isLocalTab && chainIds.length > 0,
    chain: chainData,
  });

  const txsLocalFilter = isLocalTab ? (
    <AddressTxsFilter
      initialValue={ txsQueryLocal.filterValue }
      onFilterChange={ txsQueryLocal.onFilterChange }
      hasActiveFilter={ Boolean(txsQueryLocal.filterValue) }
      isLoading={ txsQueryLocal.query.pagination.isLoading }
    />
  ) : null;

  const countersText = (() => {
    if (isLocalTab) {
      return (
        <ListCounterText
          key={ chainId }
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
      chainIds={ chainIds }
    />
  );

  const rightSlot = (() => {
    if (isLocalTab) {
      if (chainIds.length === 0) {
        return null;
      }

      if (isMobile) {
        return chainSelect;
      }

      return (
        <>
          <Flex alignItems="center">
            <HStack gap={ 2 }>
              { txsLocalFilter }
              { chainSelect }
              <CsvExport
                type="address_txs"
                resourceName="core:address_csv_export_txs"
                pathParams={{ hash }}
                queryParams={ txsQueryLocal.filterValue ? {
                  filter_type: 'address',
                  filter_value: txsQueryLocal.filterValue,
                } : undefined }
                chainData={ chainData }
                loadingInitial={ txsQueryLocal.query.pagination.isLoading }
              />
            </HStack>
            { countersText }
          </Flex>
          <Pagination ml="auto" { ...txsQueryLocal.query.pagination }/>
        </>
      );
    }

    if (isMobile) {
      return null;
    }

    return <Pagination ml="auto" { ...txsQueryCrossChain.pagination }/>;
  })();

  const tabs: Array<TabItemRegular> = [
    {
      id: 'txs_cross_chain',
      title: 'Cross-chain',
      component: config.features.crossChainTxs.isEnabled ? (
        <>
          { isMobile && !isLocalTab && txsQueryCrossChain.pagination.isVisible && (
            <ActionBar>
              <Pagination ml="auto" { ...txsQueryCrossChain.pagination }/>
            </ActionBar>
          ) }
          <TransactionsCrossChainContent
            items={ txsQueryCrossChain.data?.items }
            pagination={ txsQueryCrossChain.pagination }
            isLoading={ txsQueryCrossChain.isPlaceholderData }
            isError={ txsQueryCrossChain.isError }
            stickyHeader
            currentAddress={ hash }
          />
        </>
      ) : <EmptyState type="coming_soon"/>,
    },
    {
      id: [ 'txs_local', 'txs' ],
      title: 'Local',
      component: chainIds.length > 0 ? (
        <SocketProvider url={ getSocketUrl(chainData?.app_config) }>
          <MultichainProvider chainId={ chainId }>
            { isMobile && countersText }
            <TxsWithApiSorting
              filter={ txsLocalFilter }
              filterValue={ txsQueryLocal.filterValue }
              query={ txsQueryLocal.query }
              currentAddress={ hash }
              enableTimeIncrement
              socketType="address_txs"
              top={ ACTION_BAR_HEIGHT_DESKTOP }
              sorting={ txsQueryLocal.sort }
              setSort={ txsQueryLocal.setSort }
              showTableView
            />
          </MultichainProvider>
        </SocketProvider>
      ) : <p>There are no transactions.</p>,
    },
  ];

  return (
    <RoutedTabs
      variant="secondary"
      size="sm"
      tabs={ tabs }
      defaultTabId="txs_local"
      rightSlot={ rightSlot }
      rightSlotProps={ TABS_RIGHT_SLOT_PROPS }
      listProps={ isMobile ? undefined : TAB_LIST_PROPS }
      stickyEnabled={ !isMobile }
    />
  );
};

export default React.memo(MultichainAddressTxs);
