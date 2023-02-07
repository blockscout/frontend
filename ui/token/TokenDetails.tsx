import { Grid, Link, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { scroller } from 'react-scroll';

import type { TokenInfo } from 'types/api/tokenInfo';

import useApiQuery from 'lib/api/useApiQuery';
import getCurrencyValue from 'lib/getCurrencyValue';
import link from 'lib/link/link';
import type { TokenTabs } from 'ui/pages/Token';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsSkeletonRow from 'ui/shared/skeletons/DetailsSkeletonRow';

interface Props {
  tokenQuery: UseQueryResult<TokenInfo>;
}

const TokenDetails = ({ tokenQuery }: Props) => {
  const router = useRouter();

  const tokenCountersQuery = useApiQuery('token_counters', {
    pathParams: { hash: router.query.hash?.toString() },
    queryOptions: { enabled: Boolean(router.query.hash) },
  });

  const changeUrlAndScroll = useCallback((tab: TokenTabs) => () => {
    const newLink = link('token_index', { hash: router.query.hash }, { tab: tab });
    router.push(
      newLink,
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

  if (tokenQuery.isLoading) {
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
  } = tokenQuery.data;

  const totalValue = totalSupply !== null ? getCurrencyValue({ value: totalSupply, accuracy: 3, accuracyUsd: 2, exchangeRate, decimals }) : undefined;

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
          hint="Price per token on the exchanges."
          alignSelf="center"
        >
          { `$${ exchangeRate }` }
        </DetailsInfoItem>
      ) }
      { totalValue?.usd && (
        <DetailsInfoItem
          title="Fully diluted market cap"
          hint="Total supply * Price."
          alignSelf="center"
        >
          { `$${ totalValue?.usd }` }
        </DetailsInfoItem>
      ) }
      <DetailsInfoItem
        title="Max total supply"
        hint="The total amount of tokens issued."
        alignSelf="center"
        wordBreak="break-word"
        whiteSpace="pre-wrap"
      >
        { `${ totalValue?.valueStr || 0 } ${ symbol || '' }` }
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Holders"
        hint="Number of accounts holding the token."
        alignSelf="center"
      >
        { tokenCountersQuery.isLoading && <Skeleton w={ 20 } h={ 4 }/> }
        { !tokenCountersQuery.isLoading && countersItem('token_holders_count') }
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Transfers"
        hint="Number of transfer for the token."
        alignSelf="center"
      >
        { tokenCountersQuery.isLoading && <Skeleton w={ 20 } h={ 4 }/> }
        { !tokenCountersQuery.isLoading && countersItem('transfers_count') }
      </DetailsInfoItem>
      { decimals && (
        <DetailsInfoItem
          title="Decimals"
          hint="Number of digits that come after the decimal place when displaying token value."
          alignSelf="center"
        >
          { decimals }
        </DetailsInfoItem>
      ) }
    </Grid>
  );
};

export default React.memo(TokenDetails);
