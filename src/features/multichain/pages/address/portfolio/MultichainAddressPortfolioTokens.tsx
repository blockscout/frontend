// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { groupBy, mapValues } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';
import { isMobile } from 'react-device-detect';

import type * as multichain from '@blockscout/multichain-aggregator-types';
import { getAdditionalTokenTypes } from 'src/slices/token/utils/token-types';

import useApiQuery from 'src/api/hooks/useApiQuery';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { calculateUsdValue } from 'src/slices/token/pages/address/utils';

import multichainConfig from 'src/features/multichain/chains-config';
import { ADDRESS_PORTFOLIO, TOKEN } from 'src/features/multichain/stubs';

import useDebounce from 'src/shared/hooks/useDebounce';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import * as cookies from 'src/shared/storage/cookies';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';
import { FilterInput } from 'src/toolkit/components/filters/FilterInput';
import { ZERO } from 'src/toolkit/utils/consts';

import MultichainAddressPortfolioCards from './MultichainAddressPortfolioCards';
import MultichainAddressPortfolioNetWorth from './MultichainAddressPortfolioNetWorth';
import MultichainAddressTokensTable from './MultichainAddressTokensTable';

interface Props {
  addressData: multichain.GetAddressResponse | undefined;
  isLoading: boolean;
  onChainChange?: (chainId: string | null) => void;
}

const MultichainAddressPortfolioTokens = ({ addressData, isLoading, onChainChange }: Props) => {
  const config = multichainConfig();
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const chainIdParam = getQueryParamString(router.query.chain_id);
  const q = getQueryParamString(router.query.query);

  const [ searchTerm, setSearchTerm ] = React.useState(q || undefined);
  const debouncedSearchTerm = useDebounce(searchTerm || '', 300);

  const tokenReputationFilter = React.useMemo(() => {
    return cookies.get(cookies.NAMES.SHOW_POOR_REPUTATION_TOKENS) === 'true' ? true : false;
  }, []);

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

  const [ selectedChainId, setSelectedChainId ] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!portfolioQuery.isPlaceholderData && !isLoading) {
      const [ chainId ] = chainIdParam ? chainIdParam.split(',').filter((chainId) => Object.keys(portfolioData).includes(chainId)) : [];
      setSelectedChainId(chainId ?? null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ portfolioQuery.isPlaceholderData, isLoading ]);

  const typeFilter = React.useMemo(() => {
    const additionalTypes = getAdditionalTokenTypes(
      config?.chains
        .filter((chain) => Object.keys(portfolioData).includes(chain.id))
        .map((chain) => chain.app_config),
    );
    return [ 'ERC-20', 'NATIVE', ...additionalTypes.map(({ id }) => id) ].filter(Boolean).join(',');
  }, [ config?.chains, portfolioData ]);

  const tokensQuery = useQueryWithPages({
    resourceName: 'multichainAggregator:address_tokens',
    pathParams: { hash },
    filters: {
      type: typeFilter,
      chain_id: selectedChainId ?? undefined,
      query: debouncedSearchTerm,
      include_poor_reputation_tokens: tokenReputationFilter,
    },
    options: {
      enabled: !portfolioQuery.isPlaceholderData,
      placeholderData: generateListStub<'multichainAggregator:address_tokens'>(TOKEN, 10, { next_page_params: undefined }),
    },
    noScroll: true,
  });

  const handleSelectedChainChange = React.useCallback((chainId: string) => {
    setSelectedChainId((prev) => {
      const nextValue = chainId === prev ? null : chainId;
      tokensQuery.onFilterChange({
        chain_id: nextValue ?? undefined,
        query: debouncedSearchTerm,
      });
      onChainChange?.(nextValue);
      return nextValue;
    });
  }, [ tokensQuery, debouncedSearchTerm, onChainChange ]);

  const handleSearchTermChange = React.useCallback((value: string) => {
    setSearchTerm(value);
    tokensQuery.onFilterChange({ query: value });
  }, [ tokensQuery ]);

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
    if (allTokensQuery.data?.items?.length === 0) {
      return;
    }

    const totalUsd = BigNumber(portfolioQuery.data?.portfolio?.total_value ?? '0');
    if (totalUsd.isZero()) {
      const hasOneToken = allTokensQuery.data?.items?.length === 1;
      if (hasOneToken) {
        return [
          { symbol: allTokensQuery.data?.items?.[0]?.token.symbol ?? 'Unknown', share: 1 },
        ];
      }
      return [
        { symbol: 'Others', share: 1 },
      ];
    }

    const usdBalances = allTokensQuery.data?.items?.map((item) => ({
      symbol: item.token.symbol ?? 'Unknown',
      usd: calculateUsdValue(item).usd,
    }));
    const groups = groupBy(usdBalances ?? [], (item) => item.symbol);
    const topTokens = Object.entries(groups)
      .map(([ symbol, items ]) => ({
        symbol,
        usd: items.reduce((acc, item) => acc.plus(item.usd ?? ZERO), ZERO),
      }))
      .filter((item) => item.usd.gt(0))
      .sort((a, b) => b.usd.minus(a.usd).toNumber())
      .slice(0, 2)
      .map((item) => ({
        symbol: item.symbol,
        share: item.usd.div(totalUsd).toNumber(),
      }));

    const othersShare = 1 - topTokens.reduce((acc, item) => acc + item.share, 0);

    return [
      ...topTokens,
      othersShare > 0 ? {
        symbol: 'Others',
        share: othersShare,
      } : undefined,
    ].filter(Boolean);
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
      <MultichainAddressTokensTable
        data={ tokensQuery.data.items }
        top={ ACTION_BAR_HEIGHT_DESKTOP }
        isLoading={ tokensQuery.isPlaceholderData }
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
      <MultichainAddressPortfolioNetWorth
        addressHash={ hash }
        netWorth={ portfolioQuery.data?.portfolio?.total_value }
        isLoading={ portfolioQuery.isPlaceholderData || allTokensQuery.isPlaceholderData || isLoading }
        topTokens={ topTokens }
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
        hasActiveFilters={ Boolean(debouncedSearchTerm) || Boolean(selectedChainId) }
        emptyStateProps={{
          term: 'token',
        }}
      >
        { tokensContent }
      </DataList>
    </Box>
  );
};

export default React.memo(MultichainAddressPortfolioTokens);
