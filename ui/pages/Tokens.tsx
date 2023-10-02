import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/token';
import type { TokensSortingValue } from 'types/api/tokens';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import useDebounce from 'lib/hooks/useDebounce';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TOKEN_INFO_ERC_20 } from 'stubs/token';
import { generateListStub } from 'stubs/utils';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TokensList from 'ui/tokens/Tokens';
import TokensActionBar from 'ui/tokens/TokensActionBar';
import { getSortParamsFromValue, getSortValueFromQuery, getTokenFilterValue } from 'ui/tokens/utils';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  py: 5,
  marginTop: -5,
  alignItems: 'center',
};

const Tokens = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const tab = getQueryParamString(router.query.tab);
  const q = getQueryParamString(router.query.q);

  const [ searchTerm, setSearchTerm ] = React.useState<string>(q ?? '');
  const [ sort, setSort ] = React.useState<TokensSortingValue | undefined>(getSortValueFromQuery(router.query));
  const [ tokenTypes, setTokenTypes ] = React.useState<Array<TokenType> | undefined>(getTokenFilterValue(router.query.type));
  const [ bridgeChains, setBridgeChains ] = React.useState<Array<string>>();

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
      enabled: tab === 'bridged',
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
    tokensQuery.onFilterChange({ q: value, type: tokenTypes });
    setSearchTerm(value);
  }, [ tokenTypes, tokensQuery ]);

  const handleTokenTypesChange = React.useCallback((value: Array<TokenType>) => {
    tokensQuery.onFilterChange({ q: debouncedSearchTerm, type: value });
    setTokenTypes(value);
  }, [ debouncedSearchTerm, tokensQuery ]);

  const handleBridgeChainsChange = React.useCallback((value: Array<string>) => {
    setBridgeChains(value);
  }, [ ]);

  const handleSortChange = React.useCallback((value?: TokensSortingValue) => {
    setSort(value);
    tokensQuery.onSortingChange(getSortParamsFromValue(value));
  }, [ setSort, tokensQuery ]);

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
      inTabsSlot={ !isMobile }
      activeTab={ tab }
    />
  );

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
    {
      id: 'bridged',
      title: 'Bridged',
      component: (
        <TokensList
          query={ tokensBridgedQuery }
          sort={ sort }
          onSortChange={ handleSortChange }
          actionBar={ isMobile ? actionBar : null }
          hasActiveFilters={ Boolean(searchTerm || tokenTypes) }
        />
      ),
    },
  ];

  return (
    <>
      <PageTitle title="Tokens" withTextAd/>
      { tabs.length === 1 && !isMobile && actionBar }
      <RoutedTabs
        tabs={ tabs }
        tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
        rightSlot={ !isMobile ? actionBar : null }
        stickyEnabled={ !isMobile }
      />
    </>
  );
};

export default Tokens;
