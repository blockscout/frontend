// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { mapValues } from 'es-toolkit';
import React from 'react';
import { isMobile } from 'react-device-detect';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import { getAdditionalTokenTypes } from 'src/slices/token/utils/token-types';

import useApiQuery from 'src/api/hooks/useApiQuery';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import AddressPortfolioNetWorth from 'src/slices/token/pages/address/portfolio/AddressPortfolioNetWorth';
import AddressPortfolioTokensTable from 'src/slices/token/pages/address/portfolio/AddressPortfolioTokensTable';
import { calculateUsdValue, getTopTokens } from 'src/slices/token/pages/address/portfolio/utils';

import { ADDRESS_PORTFOLIO, TOKEN } from 'src/features/multichain/stubs';

import { clusterConfig } from 'src/shared/external-chains/cluster-config';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { useDebouncedFilterChange } from 'src/shared/pagination/useDebouncedFilterChange';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import { useRouter } from 'src/shared/router/useRouter';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';
import { FilterInput } from 'src/toolkit/components/filters/FilterInput';

import MultichainAddressPortfolioCards from './MultichainAddressPortfolioCards';
import { useIncludePoorReputationTokens } from './useIncludePoorReputationTokens';

interface Props {
  addressData: multichain.GetAddressResponse | undefined;
  isLoading: boolean;
}

const MultichainAddressPortfolioTokens = ({ addressData, isLoading }: Props) => {
  const config = clusterConfig();
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const chainIdParam = getQueryParamString(router.query.chain_id);

  const tokenReputationFilter = useIncludePoorReputationTokens();

  const portfolioQuery = useApiQuery('multichainAggregator:address_portfolio', {
    pathParams: { hash },
    queryParams: {
      include_poor_reputation_tokens: tokenReputationFilter,
    },
    queryOptions: {
      placeholderData: ADDRESS_PORTFOLIO,
    },
  });

  const portfolioData = React.useMemo(() => {
    return {
      ...mapValues(addressData?.chain_infos ?? {}, () => '0'),
      ...portfolioQuery.data?.portfolio?.chain_values,
    };
  }, [ addressData?.chain_infos, portfolioQuery.data?.portfolio?.chain_values ]);

  const selectedChainId = React.useMemo(() => {
    const [ chainId ] = chainIdParam ? chainIdParam.split(',').filter((chainId) => Object.keys(portfolioData).includes(chainId)) : [];
    return chainId ?? null;
  }, [ chainIdParam, portfolioData ]);

  const typeFilter = React.useMemo(() => {
    const additionalTypes = getAdditionalTokenTypes(
      config?.chains
        .filter((chain) => Object.keys(portfolioData).includes(chain.id))
        .map((chain) => chain.app_config),
    );
    return [ 'ERC-20', 'NATIVE', ...additionalTypes.map(({ id }) => id) ].filter(Boolean).join(',');
  }, [ config?.chains, portfolioData ]);

  const tokensQuery = useApiPaginatedQuery({
    resourceName: 'multichainAggregator:address_tokens',
    pathParams: { hash },
    queryParams: {
      type: typeFilter,
      chain_id: selectedChainId ?? undefined,
      include_poor_reputation_tokens: tokenReputationFilter,
    },
    options: {
      enabled: !portfolioQuery.isPlaceholderData,
      placeholderData: generateListStub<'multichainAggregator:address_tokens'>(TOKEN, 10, { next_page_params: undefined }),
    },
    noScroll: true,
  });

  const searchTerm = getQueryParamString(tokensQuery.filters.query);
  const { onFilterChange } = tokensQuery;

  const handleSelectedChainChange = React.useCallback((chainId: string) => {
    const nextValue = chainId === selectedChainId ? undefined : chainId;
    onFilterChange({ chain_id: nextValue, query: searchTerm });
  }, [ onFilterChange, selectedChainId, searchTerm ]);

  const handleSearchTermChange = useDebouncedFilterChange((value) => {
    onFilterChange({ chain_id: selectedChainId ?? undefined, query: value });
  });

  const allTokensQuery = useApiQuery('multichainAggregator:address_tokens', {
    pathParams: { hash },
    queryParams: {
      type: typeFilter,
      chain_id: undefined,
      include_poor_reputation_tokens: tokenReputationFilter,
    },
    queryOptions: {
      enabled: !portfolioQuery.isPlaceholderData,
      placeholderData: generateListStub<'multichainAggregator:address_tokens'>(TOKEN, 10, { next_page_params: undefined }),
      refetchOnMount: false,
    },
  });

  const topTokens = React.useMemo(() => {
    const holdings = allTokensQuery.data?.items?.map((item) => ({
      symbol: item.token.symbol ?? 'Unknown',
      usd: calculateUsdValue(item)?.usd,
    }));

    return getTopTokens(holdings, BigNumber(portfolioQuery.data?.portfolio?.total_value ?? '0'));
  }, [ allTokensQuery.data?.items, portfolioQuery.data?.portfolio?.total_value ]);

  const searchInput = (
    <FilterInput
      w={{ base: '100%', lg: '350px' }}
      size="sm"
      onChange={ handleSearchTermChange }
      placeholder="Filter by token name or symbol"
      initialValue={ searchTerm }
    />
  );

  const tokensContent = tokensQuery.data?.items ? (
    <TableContainerScrollable>
      <AddressPortfolioTokensTable
        data={ tokensQuery.data.items }
        top={ ACTION_BAR_HEIGHT_DESKTOP }
        isLoading={ tokensQuery.isInitialLoading }
        resetKey={ tokensQuery.queryHash }
      />
    </TableContainerScrollable>
  ) : null;

  const actionBar = (
    <>
      <Box hideFrom="lg" mt={ 6 } mb={ 3 }>
        { searchInput }
      </Box>
      { (!isMobile || tokensQuery.pagination.isVisible) && (
        <ActionBar mt={{ base: -3, lg: 0 }}>
          <Box hideBelow="lg">
            { searchInput }
          </Box>
          <Pagination ml="auto" { ...tokensQuery.pagination }/>
        </ActionBar>
      ) }
    </>
  );

  return (
    <Box>
      <AddressPortfolioNetWorth
        addressHash={ hash }
        netWorth={ portfolioQuery.data?.portfolio?.total_value }
        isLoading={ portfolioQuery.isPlaceholderData || allTokensQuery.isPlaceholderData || isLoading }
        topTokens={ topTokens }
        hasAdBanner
        hasMultichainButtons
      />
      <MultichainAddressPortfolioCards
        chainValues={ portfolioData }
        totalValue={ portfolioQuery.data?.portfolio?.total_value }
        selectedChainId={ selectedChainId }
        onChange={ handleSelectedChainChange }
        isLoading={ portfolioQuery.isPlaceholderData || isLoading }
      />
      <DataList
        isError={ tokensQuery.isError }
        itemsNum={ tokensQuery.data?.items?.length }
        actionBar={ actionBar }
        hasActiveFilters={ Boolean(searchTerm) || Boolean(selectedChainId) }
        emptyStateProps={{
          term: 'token',
        }}
        isTransitioning={ tokensQuery.isTransitioning }
      >
        { tokensContent }
      </DataList>
    </Box>
  );
};

export default React.memo(MultichainAddressPortfolioTokens);
