import { Flex, Link, Skeleton, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import useIsMobile from 'lib/hooks/useIsMobile';
import { HOMEPAGE_STATS } from 'stubs/stats';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import GasPrice from 'ui/shared/gas/GasPrice';
import TextSeparator from 'ui/shared/TextSeparator';

import GetGasButton from './GetGasButton';

const TopBarStats = () => {
  const isMobile = useIsMobile();

  const { data, isPlaceholderData, isError, refetch, dataUpdatedAt } = useApiQuery('stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
      refetchOnMount: false,
    },
  });

  React.useEffect(() => {
    if (isPlaceholderData || !data?.gas_price_updated_at) {
      return;
    }

    const endDate = dayjs(dataUpdatedAt).add(data.gas_prices_update_in, 'ms');
    const timeout = endDate.diff(dayjs(), 'ms');

    if (timeout <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      refetch();
    }, timeout);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [ isPlaceholderData, data?.gas_price_updated_at, dataUpdatedAt, data?.gas_prices_update_in, refetch ]);

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
        <Flex columnGap={ 1 }>
          <Skeleton isLoaded={ !isPlaceholderData }>
            <chakra.span color="text_secondary">{ config.chain.currency.symbol } </chakra.span>
            <span>${ Number(data.coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }</span>
          </Skeleton>
          { data.coin_price_change_percentage && (
            <Skeleton isLoaded={ !isPlaceholderData }>
              <chakra.span color={ Number(data.coin_price_change_percentage) >= 0 ? 'green.500' : 'red.500' }>
                { Number(data.coin_price_change_percentage).toFixed(2) }%
              </chakra.span>
            </Skeleton>
          ) }
        </Flex>
      ) }
      { !isMobile && data?.secondary_coin_price && config.chain.secondaryCoin.symbol && (
        <Flex columnGap={ 1 } ml={ data?.coin_price ? 3 : 0 }>
          <Skeleton isLoaded={ !isPlaceholderData }>
            <chakra.span color="text_secondary">{ config.chain.secondaryCoin.symbol } </chakra.span>
            <span>${ Number(data.secondary_coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }</span>
          </Skeleton>
        </Flex>
      ) }
      { data?.coin_price && config.features.gasTracker.isEnabled && <TextSeparator color="divider"/> }
      { data?.gas_prices && data.gas_prices.average !== null && config.features.gasTracker.isEnabled && (
        <>
          <Skeleton isLoaded={ !isPlaceholderData }>
            <chakra.span color="text_secondary">Gas </chakra.span>
            <GasInfoTooltip data={ data } dataUpdatedAt={ dataUpdatedAt } placement={ !data?.coin_price ? 'bottom-start' : undefined }>
              <Link>
                <GasPrice data={ data.gas_prices.average }/>
              </Link>
            </GasInfoTooltip>
          </Skeleton>
          { !isPlaceholderData && <GetGasButton/> }
        </>
      ) }
    </Flex>
  );
};

export default React.memo(TopBarStats);
