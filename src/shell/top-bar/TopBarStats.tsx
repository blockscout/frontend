// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import useStatsQuery from 'src/slices/chain/stats/useStatsQuery';
import GasInfoTooltip from 'src/slices/gas/components/GasInfoTooltip';
import GasPrice from 'src/slices/gas/components/GasPrice';
import discriminateDetailedPrices from 'src/slices/gas/utils/price';

import GetGasButton from 'src/features/get-gas-button/components/GetGasButton';

import config from 'src/config';
import dayjs from 'src/shared/date-and-time/dayjs';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import TextSeparator from 'src/shared/texts/TextSeparator';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

const TopBarStats = () => {
  const isMobile = useIsMobile();

  const { data, isPlaceholderData, isError, refetch, dataUpdatedAt } = useStatsQuery();

  React.useEffect(() => {
    if (isPlaceholderData || !data?.gas_price_updated_at) {
      return;
    }

    const endDate = dayjs(dataUpdatedAt).add(data.gas_prices_update_in ?? 0, 'ms');
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

  const hasNativeCoinPrice = data?.coin_price && !config.chain.currency.isPriceHidden;
  const hasSecondaryCoinPrice = data?.secondary_coin_price && config.chain.secondaryCoin.symbol && (hasNativeCoinPrice ? !isMobile : true);
  const gasPrices = discriminateDetailedPrices(data?.gas_prices);
  const hasGasInfo = gasPrices !== undefined && config.features.gasTracker.isEnabled && !isMobile;

  return (
    <>
      { Boolean(config.shell.topBar.chainMenu.items) && <TextSeparator/> }
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
            { data.coin_price_change_percentage && !(isMobile && Boolean(config.shell.topBar.chainMenu.items)) && (
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
        { (hasNativeCoinPrice || hasSecondaryCoinPrice) && hasGasInfo && <TextSeparator/> }
        { hasGasInfo && (
          <>
            { data && (
              <Skeleton loading={ isPlaceholderData } whiteSpace="pre-wrap">
                <chakra.span color="text.secondary">Gas </chakra.span>
                <GasInfoTooltip data={ data } dataUpdatedAt={ dataUpdatedAt } placement={ !data?.coin_price ? 'bottom-start' : undefined }>
                  <Link>
                    <GasPrice data={ gasPrices.average ?? null }/>
                  </Link>
                </GasInfoTooltip>
              </Skeleton>
            ) }
            { !isPlaceholderData && <GetGasButton/> }
          </>
        ) }
      </Flex>
    </>
  );
};

export default React.memo(TopBarStats);
