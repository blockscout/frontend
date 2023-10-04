import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/token';
import type { TokensSortingValue } from 'types/api/tokens';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import useDebounce from 'lib/hooks/useDebounce';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TOKEN_INFO_ERC_20 } from 'stubs/token';
import { generateListStub } from 'stubs/utils';
import Tag from 'ui/shared/chakra/Tag';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TokensList from 'ui/tokens/Tokens';
import TokensActionBar from 'ui/tokens/TokensActionBar';
import { getSortParamsFromValue, getSortValueFromQuery, getTokenFilterValue, getBridgedChainsFilterValue } from 'ui/tokens/utils';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  py: 5,
  marginTop: -5,
  alignItems: 'center',
};

const TABS_RIGHT_SLOT_PROPS = {
  ml: 8,
  flexGrow: 1,
};

const bridgedTokensFeature = config.features.bridgedTokens;

const Tokens = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const tab = getQueryParamString(router.query.tab);
  const q = getQueryParamString(router.query.q);

  const [ searchTerm, setSearchTerm ] = React.useState<string>(q ?? '');
  const [ sort, setSort ] = React.useState<TokensSortingValue | undefined>(getSortValueFromQuery(router.query));
  const [ tokenTypes, setTokenTypes ] = React.useState<Array<TokenType> | undefined>(getTokenFilterValue(router.query.type));
  const [ bridgeChains, setBridgeChains ] = React.useState<Array<string> | undefined>(getBridgedChainsFilterValue(router.query.chain_ids));

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const tokensQuery = useQueryWithPages({
    resourceName: 'tokens',
    filters: { q: debouncedSearchTerm, type: tokenTypes },
    sorting: getSortParamsFromValue(sort),
    options: {
      enabled: tab === 'all' || !tab,
      placeholderData: generateListStub<'tokens'>(
        TOKEN_INFO_ERC_20,
        50,
        {
          next_page_params: {
            holder_count: 81528,
            items_count: 50,
            name: '',
            market_cap: null,
          },
        },
      ),
    },
  });

  const tokensBridgedQuery = useQueryWithPages({
    resourceName: 'tokens_bridged',
    filters: { q: debouncedSearchTerm, chain_ids: bridgeChains },
    sorting: getSortParamsFromValue(sort),
    options: {
      enabled: bridgedTokensFeature.isEnabled && tab === 'bridged',
      placeholderData: generateListStub<'tokens'>(
        TOKEN_INFO_ERC_20,
        50,
        {
          next_page_params: {
            holder_count: 81528,
            items_count: 50,
            name: '',
            market_cap: null,
          },
        },
      ),
    },
  });

  const handleSearchTermChange = React.useCallback((value: string) => {
    tab === 'bridged' ?
      tokensBridgedQuery.onFilterChange({ q: value, chain_ids: bridgeChains }) :
      tokensQuery.onFilterChange({ q: value, type: tokenTypes });
    setSearchTerm(value);
  }, [ bridgeChains, tab, tokenTypes, tokensBridgedQuery, tokensQuery ]);

  const handleTokenTypesChange = React.useCallback((value: Array<TokenType>) => {
    tokensQuery.onFilterChange({ q: debouncedSearchTerm, type: value });
    setTokenTypes(value);
  }, [ debouncedSearchTerm, tokensQuery ]);

  const handleBridgeChainsChange = React.useCallback((value: Array<string>) => {
    tokensBridgedQuery.onFilterChange({ q: debouncedSearchTerm, chain_ids: value });
    setBridgeChains(value);
  }, [ debouncedSearchTerm, tokensBridgedQuery ]);

  const handleSortChange = React.useCallback((value?: TokensSortingValue) => {
    setSort(value);
    tab === 'bridged' ?
      tokensBridgedQuery.onSortingChange(getSortParamsFromValue(value)) :
      tokensQuery.onSortingChange(getSortParamsFromValue(value));
  }, [ tab, tokensBridgedQuery, tokensQuery ]);

  const handleTabChange = React.useCallback(() => {
    setSearchTerm('');
    setSort(undefined);
    setTokenTypes(undefined);
    setBridgeChains(undefined);
  }, []);

  const pagination = tab === 'bridged' ? tokensBridgedQuery.pagination : tokensQuery.pagination;

  const actionBar = (
    <TokensActionBar
      pagination={ pagination }
      tokenTypes={ tokenTypes }
      onTokenTypesChange={ handleTokenTypesChange }
      searchTerm={ searchTerm }
      onSearchChange={ handleSearchTermChange }
      sort={ sort }
      onSortChange={ handleSortChange }
      bridgeChains={ bridgeChains }
      onBridgeChainsChange={ handleBridgeChainsChange }
      inTabsSlot={ !isMobile && bridgedTokensFeature.isEnabled }
      activeTab={ tab }
    />
  );

  const bridgedTokensDescription = (() => {
    if (!bridgedTokensFeature.isEnabled) {
      return null;
    }

    return (
      <Flex fontSize="sm" mb={ 4 } mt={ 1 } alignItems="center" whiteSpace="pre-wrap" flexWrap="wrap">
        <span>List of the tokens bridged through </span>
        { bridgedTokensFeature.bridges.map((item, index, array) => {
          return (
            <React.Fragment key={ item.type }>
              <span>{ item.title } </span>
              <Tag>{ item.short_title }</Tag>
              { index === array.length - 2 && <span> and </span> }
              { index < array.length - 2 && <span>, </span> }
            </React.Fragment>
          );
        }) }
        <span> extensions</span>
      </Flex>
    );
  })();

  const tabs: Array<RoutedTab> = [
    {
      id: 'all',
      title: 'All',
      component: (
        <TokensList
          query={ tokensQuery }
          sort={ sort }
          onSortChange={ handleSortChange }
          actionBar={ isMobile ? actionBar : null }
          hasActiveFilters={ Boolean(searchTerm || tokenTypes) }
        />
      ),
    },
    bridgedTokensFeature.isEnabled ? {
      id: 'bridged',
      title: 'Bridged',
      component: (
        <TokensList
          query={ tokensBridgedQuery }
          sort={ sort }
          onSortChange={ handleSortChange }
          actionBar={ isMobile ? actionBar : null }
          hasActiveFilters={ Boolean(searchTerm || bridgeChains) }
          description={ bridgedTokensDescription }
        />
      ),
    } : undefined,
  ].filter(Boolean);

  return (
    <>
      <PageTitle title="Tokens" withTextAd/>
      { tabs.length === 1 && !isMobile && actionBar }
      <RoutedTabs
        tabs={ tabs }
        tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ !isMobile ? actionBar : null }
        rightSlotProps={ !isMobile ? TABS_RIGHT_SLOT_PROPS : undefined }
        stickyEnabled={ !isMobile }
        onTabChange={ handleTabChange }
      />
    </>
  );
};

export default Tokens;
