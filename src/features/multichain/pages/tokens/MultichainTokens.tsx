// SPDX-License-Identifier: LicenseRef-Blockscout

import { HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'src/slices/token/types/api';

import ActionBar from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import TokenTypeFilter from 'src/slices/token/components/TokenTypeFilter';
import Tokens from 'src/slices/token/pages/index/TokensList';
import { getTokenFilterValue } from 'src/slices/token/utils/list-utils';

import multichainConfig from 'src/features/multichain/chains-config';
import ChainSelect from 'src/features/multichain/components/ChainSelect';
import { TOKEN } from 'src/features/multichain/stubs';

import PopoverFilter from 'src/shared/filters/PopoverFilter';
import useDebounce from 'src/shared/hooks/useDebounce';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

const getChainIdFilterValue = (chainIds: Array<string>) => {
  return chainIds.includes('all') ? undefined : chainIds.filter(Boolean);
};

const MultichainTokens = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const chainConfigs = React.useMemo(() => {
    return multichainConfig()?.chains.map((chain) => chain.app_config);
  }, []);

  const q = getQueryParamString(router.query.query);
  const chainIdParam = getQueryParamString(router.query.chain_id);

  const [ chainIds, setChainIds ] = React.useState<Array<string>>(chainIdParam ? [ chainIdParam ] : [ 'all' ]);
  const [ searchTerm, setSearchTerm ] = React.useState<string>(q ?? '');
  const [ tokenTypes, setTokenTypes ] = React.useState<Array<TokenType> | undefined>(
    getTokenFilterValue(router.query.type, chainConfigs),
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const tokensQuery = useQueryWithPages({
    resourceName: 'multichainAggregator:tokens',
    filters: {
      type: tokenTypes?.join(','),
      chain_id: getChainIdFilterValue(chainIds),
      query: debouncedSearchTerm,
    },
    options: {
      placeholderData: generateListStub<'multichainAggregator:tokens'>(TOKEN['token'], 50, {
        next_page_params: {
          page_size: 50,
          page_token: 'token',
        },
      },
      ),
    },
  });

  const handleTokenTypesChange = React.useCallback((value: Array<TokenType>) => {
    tokensQuery.onFilterChange({
      type: value.join(','),
      chain_id: getChainIdFilterValue(chainIds),
      query: debouncedSearchTerm,
    });
    setTokenTypes(value);
  }, [ tokensQuery, chainIds, debouncedSearchTerm ]);

  const handleSearchTermChange = React.useCallback((value: string) => {
    tokensQuery.onFilterChange({
      type: tokenTypes?.join(','),
      chain_id: getChainIdFilterValue(chainIds),
      query: value,
    });
    setSearchTerm(value);
  }, [ tokenTypes, tokensQuery, chainIds ]);

  const handleChainIdsChange = React.useCallback(({ value }: { value: Array<string> }) => {
    tokensQuery.onFilterChange({
      chain_id: getChainIdFilterValue(value),
      type: tokenTypes?.join(','),
      query: debouncedSearchTerm,
    });
    setChainIds(value);
  }, [ tokensQuery, tokenTypes, debouncedSearchTerm ]);

  const filter = (
    <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ tokenTypes?.length }>
      <TokenTypeFilter<TokenType>
        onChange={ handleTokenTypesChange }
        defaultValue={ tokenTypes }
        nftOnly={ false }
        chainConfig={ chainConfigs }
      />
    </PopoverFilter>
  );

  const searchInput = (
    <FilterInput
      w={{ base: '100%', lg: '360px' }}
      minW={{ base: 'auto', lg: '250px' }}
      size="sm"
      onChange={ handleSearchTermChange }
      placeholder="Token name or symbol"
      initialValue={ searchTerm }
    />
  );

  const chainSelect = (
    <ChainSelect
      value={ chainIds }
      onValueChange={ handleChainIdsChange }
      withAllOption
    />
  );

  const actionBar = isMobile ? (
    <>
      <HStack gap={ 3 }>
        { filter }
        { chainSelect }
        { searchInput }
      </HStack>
      { tokensQuery.pagination.isVisible && (
        <ActionBar mt={ 0 } justifyContent="flex-end">
          <Pagination { ...tokensQuery.pagination }/>
        </ActionBar>
      ) }
    </>
  ) : (
    <ActionBar
      mt={ -6 }
      justifyContent="space-between"
    >
      <HStack gap={ 3 }>
        { filter }
        { chainSelect }
        { searchInput }
      </HStack>
      <Pagination { ...tokensQuery.pagination }/>
    </ActionBar>
  );

  return (
    <>
      <PageTitle title="Tokens" withTextAd/>
      <Tokens
        query={ tokensQuery }
        actionBar={ actionBar }
        hasActiveFilters={ Boolean(searchTerm || tokenTypes || !chainIds.includes('all')) }
      />
    </>
  );
};

export default React.memo(MultichainTokens);
