import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import useIsMobile from 'lib/hooks/useIsMobile';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { enrichGasStats } from 'ui/shared/gas/enrichGasData';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import GasPrice from 'ui/shared/gas/GasPrice';
import TextSeparator from 'ui/shared/TextSeparator';

import GetGasButton from './GetGasButton';

const TopBarStats = () => {
  const isMobile = useIsMobile();

  const { data, isPlaceholderData, refetch, dataUpdatedAt } = useApiQuery('general:stats', {
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

  const enrichedData = data ? enrichGasStats(data, dataUpdatedAt) : data;

  const hasNativeCoinPrice = data?.coin_price && !config.UI.nativeCoinPrice.isHidden;
  const hasSecondaryCoinPrice = data?.secondary_coin_price && config.chain.secondaryCoin.symbol && (hasNativeCoinPrice ? !isMobile : true);
  // Keep the gas slot visible whenever the gas-tracker feature is enabled and we're on desktop,
  // even if the stats API returns an empty/null payload. Missing values are rendered as "—" below
  // so the top bar never flickers or disappears on transient nulls or partial responses.
  const hasGasSlot = config.features.gasTracker.isEnabled && !isMobile;
  const hasGasPriceValue = Boolean(enrichedData?.gas_prices && enrichedData.gas_prices.average !== null);

  return (
    <>
      { Boolean(config.UI.featuredNetworks.items) && <TextSeparator/> }
      <Flex
        alignItems="center"
        fontWeight={ 500 }
      >
        { hasNativeCoinPrice && (
          <Flex columnGap={ 1 }>
            <Skeleton loading={ isPlaceholderData }>
              <chakra.span color="text.secondary">{ config.chain.currency.symbol } </chakra.span>
              <span>${ Number(data.coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }</span>
            </Skeleton>
            { data.coin_price_change_percentage && !(isMobile && Boolean(config.UI.featuredNetworks.items)) && (
              <Skeleton loading={ isPlaceholderData }>
                <chakra.span color={ Number(data.coin_price_change_percentage) >= 0 ? 'green.500' : 'red.500' }>
                  { Number(data.coin_price_change_percentage).toFixed(2) }%
                </chakra.span>
              </Skeleton>
            ) }
          </Flex>
        ) }
        { hasSecondaryCoinPrice && (
          <Flex columnGap={ 1 } ml={ data?.coin_price ? 3 : 0 }>
            <Skeleton loading={ isPlaceholderData }>
              <chakra.span color="text.secondary">{ config.chain.secondaryCoin.symbol } </chakra.span>
              <span>${ Number(data.secondary_coin_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }) }</span>
            </Skeleton>
          </Flex>
        ) }
        { (hasNativeCoinPrice || hasSecondaryCoinPrice) && hasGasSlot && <TextSeparator/> }
        { hasGasSlot && (
          <>
            <Skeleton loading={ isPlaceholderData } whiteSpace="pre-wrap">
              <chakra.span color="text.secondary">Gas </chakra.span>
              { hasGasPriceValue && enrichedData ? (
                <GasInfoTooltip data={ enrichedData } dataUpdatedAt={ dataUpdatedAt } placement={ !data?.coin_price ? 'bottom-start' : undefined }>
                  <Link>
                    <GasPrice data={ enrichedData.gas_prices?.average ?? null }/>
                  </Link>
                </GasInfoTooltip>
              ) : (
                <chakra.span>—</chakra.span>
              ) }
            </Skeleton>
            { !isPlaceholderData && hasGasPriceValue && <GetGasButton/> }
          </>
        ) }
      </Flex>
    </>
  );
};

export default React.memo(TopBarStats);
