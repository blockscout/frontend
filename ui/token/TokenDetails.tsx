import { Box, Flex, Grid, Link, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { scroller } from 'react-scroll';

import type { TokenInfo } from 'types/api/token';

import useApiQuery from 'lib/api/useApiQuery';
import getCurrencyValue from 'lib/getCurrencyValue';
import { TOKEN_COUNTERS } from 'stubs/token';
import type { TokenTabs } from 'ui/pages/Token';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsSponsoredItem from 'ui/shared/DetailsSponsoredItem';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  tokenQuery: UseQueryResult<TokenInfo>;
}

const TokenDetails = ({ tokenQuery }: Props) => {
  const router = useRouter();

  const tokenCountersQuery = useApiQuery('token_counters', {
    pathParams: { hash: router.query.hash?.toString() },
    queryOptions: { enabled: Boolean(router.query.hash), placeholderData: TOKEN_COUNTERS },
  });

  const changeUrlAndScroll = useCallback((tab: TokenTabs) => () => {
    router.push(
      { pathname: '/token/[hash]', query: { hash: router.query.hash?.toString() || '', tab } },
      undefined,
      { shallow: true },
    );
    scroller.scrollTo('token-tabs', {
      duration: 500,
      smooth: true,
    });
  }, [ router ]);

  const countersItem = useCallback((item: 'token_holders_count' | 'transfers_count') => {
    const itemValue = tokenCountersQuery.data?.[item];
    if (!itemValue) {
      return 'N/A';
    }
    if (itemValue === '0') {
      return itemValue;
    }

    const tab: TokenTabs = item === 'token_holders_count' ? 'holders' : 'token_transfers';

    return <Link onClick={ changeUrlAndScroll(tab) }>{ itemValue }</Link>;
  }, [ tokenCountersQuery.data, changeUrlAndScroll ]);

  if (tokenQuery.isError) {
    throw Error('Token fetch error', { cause: tokenQuery.error as unknown as Error });
  }

  const {
    exchange_rate: exchangeRate,
    total_supply: totalSupply,
    decimals,
    symbol,
    type,
  } = tokenQuery.data || {};

  let marketcap;
  let totalSupplyValue;

  if (type === 'ERC-20') {
    const totalValue = totalSupply ? getCurrencyValue({ value: totalSupply, accuracy: 3, accuracyUsd: 2, exchangeRate, decimals }) : undefined;
    marketcap = totalValue?.usd;
    totalSupplyValue = totalValue?.valueStr;
  } else {
    totalSupplyValue = Number(totalSupply).toLocaleString('en');
  }

  return (
    <Grid
      mt={ 8 }
      columnGap={ 8 }
      rowGap={{ base: 1, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} overflow="hidden"
    >
      { exchangeRate && (
        <DetailsInfoItem
          title="Price"
          hint="Price per token on the exchanges"
          alignSelf="center"
        >
          { `$${ exchangeRate }` }
        </DetailsInfoItem>
      ) }
      { marketcap && (
        <DetailsInfoItem
          title="Fully diluted market cap"
          hint="Total supply * Price"
          alignSelf="center"
        >
          { `$${ marketcap }` }
        </DetailsInfoItem>
      ) }
      <DetailsInfoItem
        title="Max total supply"
        hint="The total amount of tokens issued"
        alignSelf="center"
        wordBreak="break-word"
        whiteSpace="pre-wrap"
        isLoading={ tokenQuery.isPlaceholderData }
      >
        <Skeleton isLoaded={ !tokenQuery.isPlaceholderData }>
          <Flex w="100%">
            <Box whiteSpace="nowrap" overflow="hidden">
              <HashStringShortenDynamic hash={ totalSupplyValue || '0' }/>
            </Box>
            <Box flexShrink={ 0 }> { symbol || '' }</Box>
          </Flex>
        </Skeleton>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Holders"
        hint="Number of accounts holding the token"
        alignSelf="center"
        isLoading={ tokenQuery.isPlaceholderData }
      >
        <Skeleton isLoaded={ !tokenCountersQuery.isPlaceholderData }>
          { countersItem('token_holders_count') }
        </Skeleton>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Transfers"
        hint="Number of transfer for the token"
        alignSelf="center"
        isLoading={ tokenQuery.isPlaceholderData }
      >
        <Skeleton isLoaded={ !tokenCountersQuery.isPlaceholderData }>
          { countersItem('transfers_count') }
        </Skeleton>
      </DetailsInfoItem>
      { decimals && (
        <DetailsInfoItem
          title="Decimals"
          hint="Number of digits that come after the decimal place when displaying token value"
          alignSelf="center"
          isLoading={ tokenQuery.isPlaceholderData }
        >
          <Skeleton isLoaded={ !tokenQuery.isPlaceholderData } minW={ 6 }>
            { decimals }
          </Skeleton>
        </DetailsInfoItem>
      ) }
      <DetailsSponsoredItem/>
    </Grid>
  );
};

export default React.memo(TokenDetails);
