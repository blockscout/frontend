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
import useAddressTokenTransfersQuery from 'ui/address/useAddressTokenTransfersQuery';
import ChainSelect from 'ui/shared/multichain/ChainSelect';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';

import TokenTransfersLocal from './tokenTransfers/TokenTransfersLocal';

export const ADDRESS_OP_SUPERCHAIN_TOKEN_TRANSFERS_TAB_IDS = [ 'token_transfers_cross_chain' as const, 'token_transfers_local' as const ];
const TABS_RIGHT_SLOT_PROPS = {
  display: 'flex',
  justifyContent: { base: 'flex-end', lg: 'space-between' },
  ml: { base: 0, lg: 8 },
  widthAllocation: 'available' as const,
};

const OpSuperchainAddressTokenTransfers = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const hash = getQueryParamString(router.query.hash);
  const tab = getQueryParamString(router.query.tab) as typeof ADDRESS_OP_SUPERCHAIN_TOKEN_TRANSFERS_TAB_IDS[number] | undefined;

  const queryLocal = useAddressTokenTransfersQuery({
    currentAddress: hash,
    enabled: tab === 'token_transfers_local',
    isMultichain: true,
  });

  const filterLocal = tab === 'token_transfers_local' && !isMobile ? (
    <TokenTransferFilter
      defaultTypeFilters={ queryLocal.filters.type }
      onTypeFilterChange={ queryLocal.onTypeFilterChange }
      appliedFiltersNum={ queryLocal.filters.type.length }
      withAddressFilter
      onAddressFilterChange={ queryLocal.onAddressFilterChange }
      defaultAddressFilter={ queryLocal.filters.filter }
      isLoading={ queryLocal.query.isPlaceholderData }
    />
  ) : null;

  const rightSlot = tab === 'token_transfers_local' ? (
    <HStack gap={ 2 }>
      { filterLocal }
      <ChainSelect
        loading={ queryLocal.query.pagination.isLoading }
        value={ queryLocal.query.chainValue }
        onValueChange={ queryLocal.query.onChainValueChange }
      />
    </HStack>
  ) : null;

  const chainData = multichainConfig()?.chains.find(chain => chain.slug === queryLocal.query.chainValue?.[0]);

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
        <MultichainProvider chainSlug={ queryLocal.query.chainValue?.[0] }>
          <SocketProvider url={ getSocketUrl(chainData?.config) }>
            <TokenTransfersLocal
              query={ queryLocal.query }
              filters={ queryLocal.filters }
              onTypeFilterChange={ queryLocal.onTypeFilterChange }
              onAddressFilterChange={ queryLocal.onAddressFilterChange }
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
    />
  );
};

export default React.memo(OpSuperchainAddressTokenTransfers);
