import { Box, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';
import type { TokenType } from 'types/api/token';

import useBridgedTokensQueryCrossChain from 'client/features/cross-chain-txs/hooks/useBridgedTokensQuery';
import BridgedTokensIndex from 'client/features/cross-chain-txs/pages/bridged-tokens/BridgedTokensIndex';
import { BRIDGED_TOKENS_SORT_COLLECTION } from 'client/features/cross-chain-txs/utils/bridged-tokens-sort';
import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import type { SlotProps } from 'toolkit/components/AdaptiveTabs/AdaptiveTabsList';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import ActionBar from 'ui/shared/ActionBar';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import Sort from 'ui/shared/sort/Sort';
import TokensList from 'ui/tokens/Tokens';
import TokensBridgedChainsFilter from 'ui/tokens/TokensBridgedChainsFilter';
import useBridgedTokensQuery from 'ui/tokens/useBridgedTokensQuery';
import useTokensQuery from 'ui/tokens/useTokensQuery';
import { TOKENS_SORT_COLLECTION } from 'ui/tokens/utils';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 6,
  marginTop: -5,
  alignItems: 'center',
};
const TABS_HEIGHT = 88;

const TABS_RIGHT_SLOT_PROPS: SlotProps = {
  ml: 8,
  widthAllocation: 'available',
};

const bridgedTokensFeature = config.features.bridgedTokens;
const crossChainTxsFeature = config.features.crossChainTxs;

const Tokens = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const tab = getQueryParamString(router.query.tab);

  const allTokensQuery = useTokensQuery({
    enabled: tab === 'all' || !tab,
  });

  const bridgedTokensQuery = useBridgedTokensQuery({
    enabled: tab === 'bridged' && bridgedTokensFeature.isEnabled,
  });

  const bridgedTokensQueryCrossChain = useBridgedTokensQueryCrossChain({
    enabled: tab === 'bridged' && crossChainTxsFeature.isEnabled,
  });

  const hasMultipleTabs = bridgedTokensFeature.isEnabled || crossChainTxsFeature.isEnabled;

  const pagination = (() => {
    if (tab === 'bridged') {
      if (crossChainTxsFeature.isEnabled) {
        return bridgedTokensQueryCrossChain.query.pagination;
      }
      return bridgedTokensQuery.query.pagination;
    }
    return allTokensQuery.query.pagination;
  })();

  const filter = (() => {
    if (tab === 'bridged') {
      if (crossChainTxsFeature.isEnabled) {
        return null;
      }

      return (
        <PopoverFilter contentProps={{ maxW: '350px' }} appliedFiltersNum={ bridgedTokensQuery.bridgeChains?.length }>
          <TokensBridgedChainsFilter onChange={ bridgedTokensQuery.onBridgeChainsChange } defaultValue={ bridgedTokensQuery.bridgeChains }/>
        </PopoverFilter>
      );
    }

    return (
      <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ allTokensQuery.tokenTypes?.length }>
        <TokenTypeFilter<TokenType> onChange={ allTokensQuery.onTokenTypesChange } defaultValue={ allTokensQuery.tokenTypes } nftOnly={ false }/>
      </PopoverFilter>
    );
  })();

  const searchInput = (() => {
    if (tab === 'bridged') {
      if (crossChainTxsFeature.isEnabled) {
        return null;
      }

      return (
        <FilterInput
          key="bridged-search-input"
          w={{ base: '100%', lg: '360px' }}
          size="sm"
          onChange={ bridgedTokensQuery.onSearchTermChange }
          placeholder="Token name or symbol"
          initialValue={ bridgedTokensQuery.searchTerm }
        />
      );
    }

    return (
      <FilterInput
        key="all-search-input"
        w={{ base: '100%', lg: '360px' }}
        size="sm"
        onChange={ allTokensQuery.onSearchTermChange }
        placeholder="Token name or symbol"
        initialValue={ allTokensQuery.searchTerm }
      />
    );
  })();

  const sortButton = (() => {
    if (!isMobile) {
      return null;
    }

    if (tab === 'bridged') {
      if (crossChainTxsFeature.isEnabled) {
        return (
          <Sort
            name="bridged_tokens_sorting"
            defaultValue={ [ bridgedTokensQueryCrossChain.sort ] }
            collection={ BRIDGED_TOKENS_SORT_COLLECTION }
            onValueChange={ bridgedTokensQueryCrossChain.onSortChange }
          />
        );
      }

      return (
        <Sort
          name="bridged_tokens_sorting"
          defaultValue={ [ bridgedTokensQuery.sort ] }
          collection={ TOKENS_SORT_COLLECTION }
          onValueChange={ bridgedTokensQuery.onSortChange }
        />
      );
    }

    return (
      <Sort
        name="tokens_sorting"
        defaultValue={ [ allTokensQuery.sort ] }
        collection={ TOKENS_SORT_COLLECTION }
        onValueChange={ allTokensQuery.onSortChange }
      />
    );
  })();

  const actionBar = (() => {
    if (isMobile) {
      if (crossChainTxsFeature.isEnabled) {
        return (
          <ActionBar>
            { sortButton }
            <Pagination { ...pagination } ml="auto"/>
          </ActionBar>
        );
      }

      return (
        <>
          <HStack gap={ 3 }>
            { filter }
            { sortButton }
            { searchInput }
          </HStack>
          { pagination.isVisible && (
            <ActionBar mt={ 0 }>
              <Pagination { ...pagination } ml="auto"/>
            </ActionBar>
          ) }
        </>
      );
    }

    if (hasMultipleTabs) {
      return null;
    }

    return (
      <ActionBar>
        <HStack gap={ 3 }>
          { filter }
          { searchInput }
        </HStack>
        <Pagination { ...pagination } ml="auto"/>
      </ActionBar>
    );
  })();

  const tabsRightSlot = (() => {
    if (hasMultipleTabs && !isMobile) {
      return (
        <HStack justifyContent="space-between">
          <HStack gap={ 3 }>
            { filter }
            { searchInput }
          </HStack>
          <Pagination { ...pagination }/>
        </HStack>
      );
    }
    return null;
  })();

  const description = (() => {
    if (!bridgedTokensFeature.isEnabled) {
      return null;
    }

    const bridgesListText = bridgedTokensFeature.bridges.map((item, index, array) => {
      return item.title + (index < array.length - 2 ? ', ' : '') + (index === array.length - 2 ? ' and ' : '');
    });

    return (
      <Box fontSize="sm" mb={ 4 } mt={ 1 } whiteSpace="pre-wrap" flexWrap="wrap">
        List of the tokens bridged through { bridgesListText } extensions
      </Box>
    );
  })();

  const tabs: Array<TabItemRegular> = [
    {
      id: 'all',
      title: 'All',
      component: (
        <TokensList
          query={ allTokensQuery.query }
          sort={ allTokensQuery.sort }
          onSortChange={ allTokensQuery.onSortChange }
          actionBar={ actionBar }
          hasActiveFilters={ Boolean(allTokensQuery.searchTerm || allTokensQuery.tokenTypes) }
          tableTop={ hasMultipleTabs ? TABS_HEIGHT : undefined }
        />
      ),
    },
    bridgedTokensFeature.isEnabled && !crossChainTxsFeature.isEnabled ? {
      id: 'bridged',
      title: 'Bridged',
      component: (
        <TokensList
          query={ bridgedTokensQuery.query }
          sort={ bridgedTokensQuery.sort }
          onSortChange={ bridgedTokensQuery.onSortChange }
          actionBar={ actionBar }
          hasActiveFilters={ Boolean(bridgedTokensQuery.searchTerm || bridgedTokensQuery.bridgeChains) }
          description={ description }
          tableTop={ TABS_HEIGHT }
        />
      ),
    } : undefined,
    crossChainTxsFeature.isEnabled ? {
      id: 'bridged',
      title: 'Bridged',
      component: (
        <BridgedTokensIndex
          query={ bridgedTokensQueryCrossChain.query }
          sort={ bridgedTokensQueryCrossChain.sort }
          onSortChange={ bridgedTokensQueryCrossChain.onSortChange }
          actionBar={ actionBar }
          hasActiveFilters={ false }
          tableTop={ TABS_HEIGHT }
        />
      ),
    } : undefined,
  ].filter(Boolean);

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `Tokens on ${ config.chain.name }` : 'Tokens' }
        withTextAd
      />
      <RoutedTabs
        tabs={ tabs }
        listProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ tabsRightSlot }
        rightSlotProps={ tabsRightSlot ? TABS_RIGHT_SLOT_PROPS : undefined }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default Tokens;
