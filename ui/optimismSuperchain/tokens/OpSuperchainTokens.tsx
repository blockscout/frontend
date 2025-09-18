import { HStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/token';

// import useDebounce from 'lib/hooks/useDebounce';
import useIsMobile from 'lib/hooks/useIsMobile';
import getChainIdFromSlug from 'lib/multichain/getChainIdFromSlug';
import getChainSlugFromId from 'lib/multichain/getChainSlugFromId';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TOKEN } from 'stubs/optimismSuperchain';
import { generateListStub } from 'stubs/utils';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import ActionBar from 'ui/shared/ActionBar';
import PopoverFilter from 'ui/shared/filters/PopoverFilter';
import TokenTypeFilter from 'ui/shared/filters/TokenTypeFilter';
import ChainSelect from 'ui/shared/multichain/ChainSelect';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import Tokens from 'ui/tokens/Tokens';
import { getTokenFilterValue } from 'ui/tokens/utils';

const getInitialChainSlug = (chainId: string) => {
  const chainSlug = chainId && getChainSlugFromId(chainId);
  return chainSlug ? [ chainSlug ] : [ 'all' ];
};

const getChainIdFilterValue = (chainSlug: Array<string>) => {
  return chainSlug.includes('all') ? undefined : chainSlug.map(getChainIdFromSlug).filter(Boolean);
};

const OpSuperchainTokens = () => {
  const router = useRouter();
  const isMobile = useIsMobile();

  const q = getQueryParamString(router.query.q);
  const chainId = getQueryParamString(router.query.chain_id);

  const [ chainSlug, setChainSlug ] = React.useState<Array<string>>(getInitialChainSlug(chainId));
  const [ searchTerm, setSearchTerm ] = React.useState<string>(q ?? '');
  const [ tokenTypes, setTokenTypes ] = React.useState<Array<TokenType> | undefined>(getTokenFilterValue(router.query.type));

  // TODO @tom2drum pass debounced search term to filters
  // const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const tokensQuery = useQueryWithPages({
    resourceName: 'multichain:tokens',
    filters: {
      type: tokenTypes?.join(','),
      chain_id: getChainIdFilterValue(chainSlug),
    },
    options: {
      placeholderData: generateListStub<'multichain:tokens'>(TOKEN['token'], 50, {
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
      chain_id: getChainIdFilterValue(chainSlug),
    });
    setTokenTypes(value);
  }, [ tokensQuery, chainSlug ]);

  const handleSearchTermChange = React.useCallback((value: string) => {
    tokensQuery.onFilterChange({
      type: tokenTypes?.join(','),
      chain_id: getChainIdFilterValue(chainSlug),
    });
    setSearchTerm(value);
  }, [ tokenTypes, tokensQuery, chainSlug ]);

  const handleChainSlugChange = React.useCallback(({ value }: { value: Array<string> }) => {
    tokensQuery.onFilterChange({
      chain_id: getChainIdFilterValue(value),
      type: tokenTypes?.join(','),
    });
    setChainSlug(value);
  }, [ setChainSlug, tokensQuery, tokenTypes ]);

  const filter = (
    <PopoverFilter contentProps={{ w: '200px' }} appliedFiltersNum={ tokenTypes?.length }>
      <TokenTypeFilter<TokenType>
        onChange={ handleTokenTypesChange }
        defaultValue={ tokenTypes }
        nftOnly={ false }
      />
    </PopoverFilter>
  );

  const searchInput = (
    <FilterInput
      w={{ base: '100%', lg: '360px' }}
      size="sm"
      onChange={ handleSearchTermChange }
      placeholder="Token name or symbol"
      initialValue={ searchTerm }
    />
  );

  const chainSelect = (
    <ChainSelect
      value={ chainSlug }
      onValueChange={ handleChainSlugChange }
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
        hasActiveFilters={ Boolean(searchTerm || tokenTypes || !chainSlug.includes('all')) }
      />
    </>
  );
};

export default React.memo(OpSuperchainTokens);
