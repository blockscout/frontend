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
import AddressAdvancedFilterLink from 'ui/address/AddressAdvancedFilterLink';
import AddressCsvExportLink from 'ui/address/AddressCsvExportLink';
import useAddressTokenTransfersQuery from 'ui/address/useAddressTokenTransfersQuery';
import useAddressCountersQuery from 'ui/address/utils/useAddressCountersQuery';
import ChainSelect from 'ui/shared/multichain/ChainSelect';
import Pagination from 'ui/shared/pagination/Pagination';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';

import ListCounterText from '../components/ListCounterText';
import TokenTransfersLocal from './tokenTransfers/TokenTransfersLocal';

export const ADDRESS_OP_SUPERCHAIN_TOKEN_TRANSFERS_TAB_IDS = [ 'token_transfers_cross_chain' as const, 'token_transfers_local' as const ];
const TABS_RIGHT_SLOT_PROPS = {
  display: 'flex',
  justifyContent: { base: 'flex-end', lg: 'space-between' },
  ml: { base: 0, lg: 8 },
  widthAllocation: 'available' as const,
};
const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 3,
  marginTop: -6,
};

const OpSuperchainAddressTokenTransfers = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const hash = getQueryParamString(router.query.hash);
  const tab = getQueryParamString(router.query.tab) as typeof ADDRESS_OP_SUPERCHAIN_TOKEN_TRANSFERS_TAB_IDS[number] | undefined;
  const isLocalTab = tab === 'token_transfers_local';

  const transfersQueryLocal = useAddressTokenTransfersQuery({
    currentAddress: hash,
    enabled: isLocalTab,
    isMultichain: true,
  });

  const chainSlug = transfersQueryLocal.query.chainValue?.[0];
  const chainData = multichainConfig()?.chains.find(chain => chain.slug === chainSlug);

  const countersQueryLocal = useAddressCountersQuery({
    hash,
    isLoading: transfersQueryLocal.query.isPlaceholderData,
    isEnabled: isLocalTab,
    chainSlug,
  });

  const countersText = (() => {
    if (isLocalTab) {
      return (
        <ListCounterText
          key={ chainSlug }
          value={ countersQueryLocal.data?.token_transfers_count }
          isLoading={ countersQueryLocal.isPlaceholderData || transfersQueryLocal.query.isPlaceholderData }
          type="transfer"
        />
      );
    }

    return null;
  })();

  const rightSlot = (() => {
    if (isLocalTab) {
      const chainSelect = (
        <ChainSelect
          loading={ transfersQueryLocal.query.pagination.isLoading }
          value={ transfersQueryLocal.query.chainValue }
          onValueChange={ transfersQueryLocal.query.onChainValueChange }
        />
      );

      if (isMobile) {
        return chainSelect;
      }

      return (
        <>
          <HStack gap={ 2 }>
            <TokenTransferFilter
              defaultTypeFilters={ transfersQueryLocal.filters.type }
              onTypeFilterChange={ transfersQueryLocal.onTypeFilterChange }
              appliedFiltersNum={ transfersQueryLocal.filters.type.length }
              withAddressFilter
              onAddressFilterChange={ transfersQueryLocal.onAddressFilterChange }
              defaultAddressFilter={ transfersQueryLocal.filters.filter }
              isLoading={ transfersQueryLocal.query.isPlaceholderData }
            />
            <ChainSelect
              loading={ transfersQueryLocal.query.pagination.isLoading }
              value={ transfersQueryLocal.query.chainValue }
              onValueChange={ transfersQueryLocal.query.onChainValueChange }
            />
            { countersText }
          </HStack>
          <HStack gap={ 6 }>
            <AddressAdvancedFilterLink
              isLoading={ transfersQueryLocal.query.isPlaceholderData }
              address={ hash }
              typeFilter={ transfersQueryLocal.filters.type }
              directionFilter={ transfersQueryLocal.filters.filter }
              chainData={ chainData }
            />
            <AddressCsvExportLink
              address={ hash }
              params={{ type: 'token-transfers', filterType: 'address', filterValue: transfersQueryLocal.filters.filter }}
              isLoading={ transfersQueryLocal.query.pagination.isLoading }
              chainData={ chainData }
            />
            <Pagination { ...transfersQueryLocal.query.pagination }/>
          </HStack>
        </>
      );
    }

    return null;
  })();

  const tabs: Array<TabItemRegular> = [
    {
      id: 'token_transfers_cross_chain',
      title: 'Cross-chain',
      component: <div>Coming soon 🔜</div>,
    },
    {
      id: 'token_transfers_local',
      title: 'Local',
      component: (
        <MultichainProvider chainSlug={ transfersQueryLocal.query.chainValue?.[0] }>
          <SocketProvider url={ getSocketUrl(chainData?.config) }>
            { isMobile && countersText }
            <TokenTransfersLocal
              query={ transfersQueryLocal.query }
              filters={ transfersQueryLocal.filters }
              onTypeFilterChange={ transfersQueryLocal.onTypeFilterChange }
              onAddressFilterChange={ transfersQueryLocal.onAddressFilterChange }
              addressHash={ hash }
            />
          </SocketProvider>
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
      rightSlotProps={ TABS_RIGHT_SLOT_PROPS }
      listProps={ isMobile ? undefined : TAB_LIST_PROPS }
      stickyEnabled={ !isMobile }
    />
  );
};

export default React.memo(OpSuperchainAddressTokenTransfers);
