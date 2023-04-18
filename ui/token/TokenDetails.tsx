import { Box, Flex, Grid, GridItem, Link, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { scroller } from 'react-scroll';

import type { TokenInfo, TokenVerifiedInfo } from 'types/api/token';

import useApiQuery from 'lib/api/useApiQuery';
import getCurrencyValue from 'lib/getCurrencyValue';
import type { TokenTabs } from 'ui/pages/Token';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsSponsoredItem from 'ui/shared/DetailsSponsoredItem';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import DetailsSkeletonRow from 'ui/shared/skeletons/DetailsSkeletonRow';

import TokenDetailsVerifiedInfo from './TokenDetails/TokenDetailsVerifiedInfo';

interface Props {
  tokenQuery: UseQueryResult<TokenInfo>;
  verifiedInfoQuery: UseQueryResult<TokenVerifiedInfo>;
  isVerifiedInfoEnabled: boolean;
}

const TokenDetails = ({ tokenQuery, verifiedInfoQuery, isVerifiedInfoEnabled }: Props) => {
  const router = useRouter();

  const tokenCountersQuery = useApiQuery('token_counters', {
    pathParams: { hash: router.query.hash?.toString() },
    queryOptions: { enabled: Boolean(router.query.hash) },
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

    return <Link onClick={ changeUrlAndScroll(tab) }>{ Number(itemValue).toLocaleString() }</Link>;
  }, [ tokenCountersQuery.data, changeUrlAndScroll ]);

  if (tokenQuery.isError) {
    throw Error('Token fetch error', { cause: tokenQuery.error as unknown as Error });
  }

  if (tokenQuery.isLoading || (isVerifiedInfoEnabled && verifiedInfoQuery.isLoading)) {
    return (
      <Grid mt={ 10 } columnGap={ 8 } rowGap={{ base: 5, lg: 7 }} templateColumns={{ base: '1fr', lg: '210px 1fr' }} maxW="1000px">
        <DetailsSkeletonRow w="10%"/>
        <DetailsSkeletonRow w="30%"/>
        <DetailsSkeletonRow w="30%"/>
        <DetailsSkeletonRow w="20%"/>
        <DetailsSkeletonRow w="20%"/>
        <DetailsSkeletonRow w="10%"/>
      </Grid>
    );
  }

  const {
    exchange_rate: exchangeRate,
    total_supply: totalSupply,
    decimals,
    symbol,
    type,
  } = tokenQuery.data;

  let marketcap;
  let totalSupplyValue;

  if (type === 'ERC-20') {
    const totalValue = totalSupply !== null ? getCurrencyValue({ value: totalSupply, accuracy: 3, accuracyUsd: 2, exchangeRate, decimals }) : undefined;
    marketcap = totalValue?.usd;
    totalSupplyValue = totalValue?.valueStr;
  } else {
    totalSupplyValue = Number(totalSupply).toLocaleString();
  }

  const divider = (
    <GridItem
      colSpan={{ base: undefined, lg: 2 }}
      borderBottom="1px solid"
      borderColor="divider"
    />
  );

  return (
    <Grid
      mt={ 8 }
      columnGap={ 8 }
      rowGap={{ base: 1, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }} overflow="hidden"
    >
      { verifiedInfoQuery.data && (
        <>
          <TokenDetailsVerifiedInfo data={ verifiedInfoQuery.data }/>
          { divider }
        </>
      ) }
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
      >
        <Flex w="100%">
          <Box whiteSpace="nowrap" overflow="hidden">
            <HashStringShortenDynamic hash={ totalSupplyValue || '0' }/>
          </Box>
          <Box flexShrink={ 0 }> { symbol || '' }</Box>
        </Flex>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Holders"
        hint="Number of accounts holding the token"
        alignSelf="center"
      >
        { tokenCountersQuery.isLoading && <Skeleton w={ 20 } h={ 4 }/> }
        { !tokenCountersQuery.isLoading && countersItem('token_holders_count') }
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Transfers"
        hint="Number of transfer for the token"
        alignSelf="center"
      >
        { tokenCountersQuery.isLoading && <Skeleton w={ 20 } h={ 4 }/> }
        { !tokenCountersQuery.isLoading && countersItem('transfers_count') }
      </DetailsInfoItem>
      { decimals && (
        <DetailsInfoItem
          title="Decimals"
          hint="Number of digits that come after the decimal place when displaying token value"
          alignSelf="center"
        >
          { decimals }
        </DetailsInfoItem>
      ) }
      <DetailsSponsoredItem/>
    </Grid>
  );
};

export default React.memo(TokenDetails);
