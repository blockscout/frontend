// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'client/slices/token/types/api';
import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import useTokenTransfersQuery from 'client/slices/token-transfer/hooks/useTokenTransfersQuery';
import TokenTypeFilter from 'client/slices/token/components/TokenTypeFilter';
import { getTokenFilterValue } from 'client/slices/token/utils/list-utils';

import useIsMobile from 'client/shared/hooks/useIsMobile';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import multichainConfig from 'configs/multichain';
import { MultichainProvider } from 'lib/contexts/multichain';
import { EmptyState } from 'toolkit/chakra/empty-state';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import ChainSelect from 'ui/multichain/components/ChainSelect';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';

import MultichainTokenTransfersLocal from './MultichainTokenTransfersLocal';

const TABS_RIGHT_SLOT_PROPS = {
  display: 'flex',
  columnGap: 2,
  ml: { base: 'auto', lg: 6 },
  widthAllocation: 'available' as const,
};
const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 6,
  marginTop: -6,
};

const MultichainTokenTransfers = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);

  const isLocalTab = tab === 'local' || !tab;

  const queryLocal = useTokenTransfersQuery({ enabled: isLocalTab, isMultichain: true });
  const chainId = queryLocal.query.chainValue?.[0];
  const chainData = multichainConfig()?.chains.find(chain => chain.id === chainId);

  const handleChainValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    queryLocal.query.onChainValueChange({ value });
    const chainConfig = multichainConfig()?.chains.find(chain => chain.id === value[0]);
    const tokenTypes = getTokenFilterValue(router.query.type, chainConfig?.app_config);
    if (tokenTypes) {
      const chainTokenTypes = queryLocal.typeFilter.filter(type => tokenTypes.includes(type));
      if (chainTokenTypes.length < queryLocal.typeFilter.length) {
        queryLocal.onTokenTypesChange(chainTokenTypes);
      }
    }
  }, [ queryLocal, router.query.type ]);

  const tabs: Array<TabItemRegular> = React.useMemo(() => {
    return [
      {
        id: 'index',
        title: 'Cross-chain',
        component: <EmptyState type="coming_soon"/>,
      },
      {
        id: 'local',
        title: 'Local',
        component: (
          <MultichainProvider chainId={ chainId }>
            <MultichainTokenTransfersLocal
              query={ queryLocal.query }
              typeFilter={ queryLocal.typeFilter }
              onTokenTypesChange={ queryLocal.onTokenTypesChange }
            />
          </MultichainProvider>
        ),
      },
    ];
  }, [ queryLocal.query, queryLocal.typeFilter, queryLocal.onTokenTypesChange, chainId ]);

  const filter = isLocalTab && (
    <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ queryLocal.typeFilter.length }>
      <TokenTypeFilter<TokenType>
        onChange={ queryLocal.onTokenTypesChange }
        defaultValue={ queryLocal.typeFilter }
        nftOnly={ false }
        chainConfig={ chainData?.app_config }
      />
    </PopoverFilter>
  );

  const rightSlot = isLocalTab && (
    <>
      { !isMobile && filter }
      <ChainSelect
        value={ queryLocal.query.chainValue }
        onValueChange={ handleChainValueChange }
        ml={ isMobile ? 'auto' : undefined }
      />
      { !isMobile && <Pagination { ...queryLocal.query.pagination } ml="auto"/> }
    </>
  );

  return (
    <>
      <PageTitle
        withTextAd
        title="Token transfers"
      />
      <RoutedTabs
        tabs={ tabs }
        defaultTabId="local"
        listProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ rightSlot }
        rightSlotProps={ rightSlot ? TABS_RIGHT_SLOT_PROPS : undefined }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default React.memo(MultichainTokenTransfers);
