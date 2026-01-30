import { Box } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { groupBy } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADDRESS_PORTFOLIO, TOKEN } from 'stubs/optimismSuperchain';
import { generateListStub } from 'stubs/utils';
import { ZERO } from 'toolkit/utils/consts';
import { calculateUsdValue } from 'ui/address/utils/tokenUtils';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import OpSuperchainAddressPortfolioCards from './OpSuperchainAddressPortfolioCards';
import OpSuperchainAddressPortfolioNetWorth from './OpSuperchainAddressPortfolioNetWorth';
import OpSuperchainAddressTokensListItem from './OpSuperchainAddressTokensListItem';
import OpSuperchainAddressTokensTable from './OpSuperchainAddressTokensTable';

const TYPE_FILTER_VALUE = 'ERC-20,NATIVE';

// TODO @tom2drum add ZRC-2 tokens
const OpSuperchainAddressPortfolioTokens = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);
  const chainIdParam = getQueryParamString(router.query.chain_id);

  const portfolioQuery = useApiQuery('multichainAggregator:address_portfolio', {
    pathParams: { hash },
    queryOptions: {
      placeholderData: ADDRESS_PORTFOLIO,
    },
  });

  const availableChainIds = React.useMemo(() => {
    return portfolioQuery.data?.portfolio?.chain_values ? Object.keys(portfolioQuery.data.portfolio.chain_values) : [];
  }, [ portfolioQuery.data?.portfolio?.chain_values ]);

  const [ selectedChainId, setSelectedChainId ] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!portfolioQuery.isPlaceholderData) {
      const [ chainId ] = chainIdParam ? chainIdParam.split(',').filter((chainId) => availableChainIds.includes(chainId)) : [];
      setSelectedChainId(chainId ?? null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ portfolioQuery.isPlaceholderData ]);

  const tokensQuery = useQueryWithPages({
    resourceName: 'multichainAggregator:address_tokens',
    pathParams: { hash },
    filters: {
      type: TYPE_FILTER_VALUE,
      chain_id: selectedChainId ?? undefined,
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
        // type: TYPE_FILTER_VALUE,
        chain_id: nextValue ?? undefined,
      });
      return nextValue;
    });
  }, [ tokensQuery ]);

  const allTokensQuery = useApiQuery('multichainAggregator:address_tokens', {
    pathParams: { hash },
    queryParams: {
      type: TYPE_FILTER_VALUE,
      chain_id: undefined,
    },
    queryOptions: {
      enabled: !portfolioQuery.isPlaceholderData,
      placeholderData: generateListStub<'multichainAggregator:address_tokens'>(TOKEN, 10, { next_page_params: undefined }),
      refetchOnMount: false,
    },
  });

  const topTokens = React.useMemo(() => {
    const totalUsd = BigNumber(portfolioQuery.data?.portfolio?.total_value ?? '0');
    if (totalUsd.isZero()) {
      return;
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

  const tokensContent = tokensQuery.data?.items ? (
    <>
      <Box hideBelow="lg">
        <OpSuperchainAddressTokensTable
          data={ tokensQuery.data.items }
          top={ tokensQuery.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 64 }
          isLoading={ tokensQuery.isPlaceholderData }
        />
      </Box>
      <Box hideFrom="lg">
        { tokensQuery.data.items.map((item, index) => (
          <OpSuperchainAddressTokensListItem
            key={ item.token.address_hash + (tokensQuery.isPlaceholderData ? index : '') + (item.chain_values ? Object.keys(item.chain_values).join(',') : '') }
            data={ item }
            isLoading={ tokensQuery.isPlaceholderData }
          />
        )) }
      </Box>
    </>
  ) : null;

  const actionBar = tokensQuery.pagination.isVisible && (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...tokensQuery.pagination }/>
    </ActionBar>
  );

  return (
    <Box>
      <OpSuperchainAddressPortfolioNetWorth
        addressHash={ hash }
        netWorth={ portfolioQuery.data?.portfolio?.total_value }
        isLoading={ portfolioQuery.isPlaceholderData || allTokensQuery.isPlaceholderData }
        topTokens={ topTokens }
        hasTokens={ (allTokensQuery.data?.items?.length ?? 0) > 0 }
      />
      <OpSuperchainAddressPortfolioCards
        data={ portfolioQuery.data?.portfolio }
        value={ selectedChainId }
        onChange={ handleSelectedChainChange }
        isLoading={ portfolioQuery.isPlaceholderData }
      />
      <DataListDisplay
        isError={ tokensQuery.isError }
        itemsNum={ tokensQuery.data?.items?.length }
        emptyText="There are no tokens at this address."
        actionBar={ actionBar }
      >
        { tokensContent }
      </DataListDisplay>
    </Box>
  );
};

export default React.memo(OpSuperchainAddressPortfolioTokens);
