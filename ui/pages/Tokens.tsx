import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/token';
import type { TokensSortingValue, TokensSortingField, TokensSorting } from 'types/api/tokens';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import useDebounce from 'lib/hooks/useDebounce';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TOKEN_INFO_ERC_20 } from 'stubs/token';
import { generateListStub } from 'stubs/utils';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TokensList from 'ui/tokens/Tokens';
import TokensActionBar from 'ui/tokens/TokensActionBar';
import TokensBridgedChainsFilter from 'ui/tokens/TokensBridgedChainsFilter';
import { SORT_OPTIONS, getTokenFilterValue, getBridgedChainsFilterValue } from 'ui/tokens/utils';

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
  const [ sort, setSort ] = React.useState<TokensSortingValue | undefined>(getSortValueFromQuery<TokensSortingValue>(router.query, SORT_OPTIONS));
  const [ tokenTypes, setTokenTypes ] = React.useState<Array<TokenType> | undefined>(getTokenFilterValue(router.query.type));
  const [ bridgeChains, setBridgeChains ] = React.useState<Array<string> | undefined>(getBridgedChainsFilterValue(router.query.chain_ids));

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const tokensQuery = useQueryWithPages({
    resourceName: tab === 'bridged' ? 'tokens_bridged' : 'tokens',
    filters: tab === 'bridged' ? { q: debouncedSearchTerm, chain_ids: bridgeChains } : { q: debouncedSearchTerm, type: tokenTypes },
    sorting: getSortParamsFromValue<TokensSortingValue, TokensSortingField, TokensSorting['order']>(sort),
    options: {
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
      tokensQuery.onFilterChange({ q: value, chain_ids: bridgeChains }) :
      tokensQuery.onFilterChange({ q: value, type: tokenTypes });
    setSearchTerm(value);
  }, [ bridgeChains, tab, tokenTypes, tokensQuery ]);

  const handleTokenTypesChange = React.useCallback((value: Array<TokenType>) => {
    tokensQuery.onFilterChange({ q: debouncedSearchTerm, type: value });
    setTokenTypes(value);
  }, [ debouncedSearchTerm, tokensQuery ]);

  const handleBridgeChainsChange = React.useCallback((value: Array<string>) => {
    tokensQuery.onFilterChange({ q: debouncedSearchTerm, chain_ids: value });
    setBridgeChains(value);
  }, [ debouncedSearchTerm, tokensQuery ]);

  const handleSortChange = React.useCallback((value?: TokensSortingValue) => {
    setSort(value);
    tokensQuery.onSortingChange(getSortParamsFromValue(value));
  }, [ tokensQuery ]);

  const handleTabChange = React.useCallback(() => {
    setSearchTerm('');
    setSort(undefined);
    setTokenTypes(undefined);
    setBridgeChains(undefined);
  }, []);

  const filter = tab === 'bridged' ? (
    <PopoverFilter isActive={ bridgeChains && bridgeChains.length > 0 } contentProps={{ maxW: '350px' }} appliedFiltersNum={ bridgeChains?.length }>
      <TokensBridgedChainsFilter onChange={ handleBridgeChainsChange } defaultValue={ bridgeChains }/>
    </PopoverFilter>
  ) : (
    <PopoverFilter isActive={ tokenTypes && tokenTypes.length > 0 } contentProps={{ w: '200px' }} appliedFiltersNum={ tokenTypes?.length }>
      <TokenTypeFilter<TokenType> onChange={ handleTokenTypesChange } defaultValue={ tokenTypes } nftOnly={ false }/>
    </PopoverFilter>
  );

  const actionBar = (
    <TokensActionBar
      key={ tab }
      pagination={ tokensQuery.pagination }
      filter={ filter }
      searchTerm={ searchTerm }
      onSearchChange={ handleSearchTermChange }
      sort={ sort }
      onSortChange={ handleSortChange }
      inTabsSlot={ !isMobile && bridgedTokensFeature.isEnabled }
    />
  );

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
          query={ tokensQuery }
          sort={ sort }
          onSortChange={ handleSortChange }
          actionBar={ isMobile ? actionBar : null }
          hasActiveFilters={ Boolean(searchTerm || bridgeChains) }
          description={ description }
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
