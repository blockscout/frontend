import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';
import type { TokenType } from 'types/api/token';

import { MultichainProvider } from 'lib/contexts/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';
import ChainSelect from 'ui/shared/multichain/ChainSelect';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useTokenTransfersQuery from 'ui/tokenTransfers/useTokenTransfersQuery';

import OpSuperchainTokenTransfersLocal from './OpSuperchainTokenTransfersLocal';

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

const OpSuperchainTokenTransfers = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);

  const isLocalTab = tab === 'local';

  const queryLocal = useTokenTransfersQuery({ enabled: isLocalTab, isMultichain: true });

  const tabs: Array<TabItemRegular> = React.useMemo(() => {
    return [
      {
        id: 'index',
        title: 'Cross-chain',
        component: <div>Coming soon 🔜</div>,
      },
      {
        id: 'local',
        title: 'Local',
        component: (
          <MultichainProvider chainSlug={ queryLocal.query.chainValue?.[0] }>
            <OpSuperchainTokenTransfersLocal
              query={ queryLocal.query }
              typeFilter={ queryLocal.typeFilter }
              onTokenTypesChange={ queryLocal.onTokenTypesChange }
            />
          </MultichainProvider>
        ),
      },
    ];
  }, [ queryLocal.query, queryLocal.typeFilter, queryLocal.onTokenTypesChange ]);

  const filter = isLocalTab && (
    <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ queryLocal.typeFilter.length }>
      <TokenTypeFilter<TokenType> onChange={ queryLocal.onTokenTypesChange } defaultValue={ queryLocal.typeFilter } nftOnly={ false }/>
    </PopoverFilter>
  );

  const rightSlot = isLocalTab && (
    <>
      { !isMobile && filter }
      <ChainSelect
        value={ queryLocal.query.chainValue }
        onValueChange={ queryLocal.query.onChainValueChange }
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
        listProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ rightSlot }
        rightSlotProps={ rightSlot ? TABS_RIGHT_SLOT_PROPS : undefined }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default React.memo(OpSuperchainTokenTransfers);
