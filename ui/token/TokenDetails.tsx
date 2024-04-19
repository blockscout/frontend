import { Grid, GridItem, Link, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { scroller } from 'react-scroll';

import type { TokenInfo } from 'types/api/token';

import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getCurrencyValue from 'lib/getCurrencyValue';
import { TOKEN_COUNTERS } from 'stubs/token';
import type { TokenTabs } from 'ui/pages/Token';
import NewDetailsInfoItem from 'ui/shared/NewDetailsInfoItem';
import TruncatedValue from 'ui/shared/TruncatedValue';

interface Props {
  tokenQuery: UseQueryResult<TokenInfo, ResourceError<unknown>>;
  address?: React.ReactNode;
}

const TokenDetails = ({ tokenQuery, address }: Props) => {
  const router = useRouter();
  const hash = router.query.hash?.toString();
  const headingColor = useColorModeValue('#292929', 'gray.17000');

  const tokenCountersQuery = useApiQuery('token_counters', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(router.query.hash),
      placeholderData: TOKEN_COUNTERS,
    },
  });

  const changeUrlAndScroll = useCallback(
    (tab: TokenTabs) => () => {
      router.push(
        { pathname: '/token/[hash]', query: { hash: hash || '', tab } },
        undefined,
        { shallow: true },
      );
      scroller.scrollTo('token-tabs', {
        duration: 500,
        smooth: true,
      });
    },
    [ hash, router ],
  );

  const countersItem = useCallback(
    (item: 'token_holders_count' | 'transfers_count') => {
      const itemValue = tokenCountersQuery.data?.[item];
      if (!itemValue) {
        return 'N/A';
      }
      if (itemValue === '0') {
        return itemValue;
      }

      const tab: TokenTabs =
        item === 'token_holders_count' ? 'holders' : 'token_transfers';

      return (
        <Skeleton isLoaded={ !tokenCountersQuery.isPlaceholderData }>
          <Link onClick={ changeUrlAndScroll(tab) }>
            { Number(itemValue).toLocaleString() }
          </Link>
        </Skeleton>
      );
    },
    [
      tokenCountersQuery.data,
      tokenCountersQuery.isPlaceholderData,
      changeUrlAndScroll,
    ],
  );

  throwOnResourceLoadError(tokenQuery);

  const {
    exchange_rate: exchangeRate,
    total_supply: totalSupply,
    circulating_market_cap: marketCap,
    decimals,
    symbol,
  } = tokenQuery.data || {};

  let totalSupplyValue;

  if (decimals) {
    const totalValue = totalSupply ?
      getCurrencyValue({
        value: totalSupply,
        accuracy: 3,
        accuracyUsd: 2,
        exchangeRate,
        decimals,
      }) :
      undefined;
    totalSupplyValue = totalValue?.valueStr;
  } else {
    totalSupplyValue = Number(totalSupply).toLocaleString();
  }

  return (
    <Grid
      columnGap={ 4 }
      rowGap={ 3 }
      templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
      justifyContent="space-between"
    >
      <GridItem
        border="1px solid #7272728A"
        borderRadius="2xl"
        padding="5"
        maxWidth="380px"
        minHeight="250px"
      >
        <Text
          color={ headingColor }
          fontSize="larger"
          fontWeight="bold"
          marginBottom="3"
        >
          OVERVIEW
        </Text>
        <NewDetailsInfoItem
          title="Max total supply"
          alignSelf="center"
          wordBreak="break-word"
          whiteSpace="pre-wrap"
          isLoading={ tokenQuery.isPlaceholderData }
        >
          <Skeleton
            isLoaded={ !tokenQuery.isPlaceholderData }
            w="100%"
            display="flex"
          >
            <TruncatedValue
              value={ totalSupplyValue || '0' }
              maxW="80%"
              flexShrink={ 0 }
            />
            <TruncatedValue value={ symbol || '' }/>
          </Skeleton>
        </NewDetailsInfoItem>
        <NewDetailsInfoItem
          title="Holders"
          marginTop="2"
          isLoading={ tokenQuery.isPlaceholderData }
        >
          <Skeleton isLoaded={ !tokenCountersQuery.isPlaceholderData }>
            { countersItem('token_holders_count') }
          </Skeleton>
        </NewDetailsInfoItem>
        <NewDetailsInfoItem
          title="Transfers"
          marginTop="2"
          isLoading={ tokenQuery.isPlaceholderData }
        >
          <Skeleton isLoaded={ !tokenCountersQuery.isPlaceholderData }>
            { countersItem('transfers_count') }
          </Skeleton>
        </NewDetailsInfoItem>
      </GridItem>
      <GridItem
        border="1px solid #7272728A"
        borderRadius="2xl"
        padding="5"
        maxWidth="380px"
        minHeight="250px"
      >
        <Text
          color={ headingColor }
          fontSize="larger"
          fontWeight="bold"
          marginBottom="3"
        >
          MARKET
        </Text>
        { exchangeRate && (
          <NewDetailsInfoItem
            title="Price"
            isLoading={ tokenQuery.isPlaceholderData }
          >
            <Skeleton
              isLoaded={ !tokenQuery.isPlaceholderData }
              display="inline-block"
            >
              <span>{ `$${ Number(exchangeRate).toLocaleString(undefined, {
                minimumSignificantDigits: 4,
              }) }` }</span>
            </Skeleton>
          </NewDetailsInfoItem>
        ) }
        { marketCap && (
          <NewDetailsInfoItem
            marginTop="2"
            title="Fully diluted market cap"
            isLoading={ tokenQuery.isPlaceholderData }
          >
            <Skeleton
              isLoaded={ !tokenQuery.isPlaceholderData }
              display="inline-block"
            >
              <span>{ `$${ BigNumber(marketCap).toFormat() }` }</span>
            </Skeleton>
          </NewDetailsInfoItem>
        ) }
      </GridItem>
      <GridItem
        border="1px solid #7272728A"
        borderRadius="2xl"
        padding="5"
        maxWidth="380px"
        minHeight="250px"
      >
        <Text
          color={ headingColor }
          fontSize="larger"
          fontWeight="bold"
          marginBottom="3"
        >
          OTHER INFO
        </Text>
        { decimals && (
          <NewDetailsInfoItem
            title={ `Token Contract (with ${ decimals } deicmals)` }
            isLoading={ tokenQuery.isPlaceholderData }
          >
            { address }
          </NewDetailsInfoItem>
        ) }
      </GridItem>

      { /* {type !== "ERC-20" && (
        <TokenNftMarketplaces
          hash={hash}
          isLoading={tokenQuery.isPlaceholderData}
        />
      )} */ }

      { /* <DetailsSponsoredItem isLoading={tokenQuery.isPlaceholderData} /> */ }
    </Grid>
  );
};

export default React.memo(TokenDetails);
