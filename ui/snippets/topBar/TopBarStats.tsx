import { chakra, Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { asymp, tilde } from 'lib/html-entities';
import { HOMEPAGE_STATS } from 'stubs/stats';
import TextSeparator from 'ui/shared/TextSeparator';

const TopBarStats = () => {
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
      refetchOnMount: false,
    },
  });

  if (isError) {
    return <div/>;
  }

  return (
    <Flex
      alignItems="center"
      fontSize="xs"
      fontWeight={ 500 }
    >
      { data?.coin_price && (
        <Skeleton isLoaded={ !isPlaceholderData }>
          <span>{ config.chain.governanceToken.symbol || config.chain.currency.symbol }</span>
          <span> ${ Number(data.coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }</span>
        </Skeleton>
      ) }
      { data?.coin_price && data.gas_prices && <TextSeparator color="divider"/> }
      { data?.gas_prices && (
        <Skeleton isLoaded={ !isPlaceholderData }>
          <span>Gas:</span>
          <span> ${ Number(data.gas_prices.average).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }</span>
          <chakra.span display={{ base: 'none', lg: 'inline' }}> { asymp } 18 Gwei per txn</chakra.span>
          { data.average_block_time && (
            <chakra.span display={{ base: 'none', lg: 'inline' }}> { tilde } { (data.average_block_time / 1000).toFixed(1) } s</chakra.span>
          ) }
        </Skeleton>
      ) }
    </Flex>
  );
};

export default React.memo(TopBarStats);
