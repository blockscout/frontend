// SPDX-License-Identifier: LicenseRef-Blockscout

import {
  Box,
  Flex,
  chakra,
} from '@chakra-ui/react';
import React from 'react';

import PageTitle from 'src/shell/page/title/PageTitle';

import useStatsQuery from 'src/slices/chain/stats/useStatsQuery';
import GasInfoUpdateTimer from 'src/slices/gas/components/GasInfoUpdateTimer';
import discriminateDetailedPrices from 'src/slices/gas/utils/price';
import NativeTokenIcon from 'src/slices/token/components/icon/TokenIconNative';

import GasTrackerChart from 'src/features/gas-tracker/components/GasTrackerChart';
import GasTrackerFaq from 'src/features/gas-tracker/components/GasTrackerFaq';
import GasTrackerNetworkUtilization from 'src/features/gas-tracker/components/GasTrackerNetworkUtilization';
import GasTrackerPrices from 'src/features/gas-tracker/components/GasTrackerPrices';

import config from 'src/config';
import Time from 'src/shared/date-and-time/Time';

import { Alert } from 'src/toolkit/chakra/alert';
import { Heading } from 'src/toolkit/chakra/heading';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

const GasTracker = () => {
  const { data, isPlaceholderData, isError, error, dataUpdatedAt } = useStatsQuery();

  if (isError) {
    throw new Error(undefined, { cause: error });
  }

  const isLoading = isPlaceholderData;

  const titleSecondRow = (
    <Flex
      alignItems={{ base: 'flex-start', lg: 'center' }}
      fontFamily="heading"
      fontSize="lg"
      fontWeight={ 500 }
      w="100%"
      columnGap={ 3 }
      rowGap={ 1 }
      flexDir={{ base: 'column', lg: 'row' }}
    >
      { typeof data?.network_utilization_percentage === 'number' &&
        <GasTrackerNetworkUtilization percentage={ data.network_utilization_percentage } isLoading={ isLoading }/> }
      { data?.gas_price_updated_at && (
        <Skeleton loading={ isLoading } whiteSpace="pre" display="flex" alignItems="center">
          <span>Last updated </span>
          <Time timestamp={ data.gas_price_updated_at } format="DD MMM, HH:mm:ss" color="text.secondary"/>
          { data.gas_prices_update_in !== null && data.gas_prices_update_in !== 0 && (
            <GasInfoUpdateTimer
              key={ dataUpdatedAt }
              startTime={ dataUpdatedAt }
              duration={ data.gas_prices_update_in }
              ml={ 2 }
            />
          ) }
        </Skeleton>
      ) }
      { data?.coin_price && (
        <Skeleton loading={ isLoading } ml={{ base: 0, lg: 'auto' }} whiteSpace="pre" display="flex" alignItems="center">
          <NativeTokenIcon mr={ 2 } boxSize={ 6 }/>
          <chakra.span color="text.secondary">{ config.chain.currency.symbol }</chakra.span>
          <span> ${ Number(data.coin_price).toLocaleString(undefined, { maximumFractionDigits: 2 }) }</span>
        </Skeleton>
      ) }
    </Flex>
  );

  const snippets = (() => {
    if (!isPlaceholderData && data?.gas_prices?.slow === null && data?.gas_prices.average === null && data.gas_prices.fast === null) {
      return <Alert status="warning">No recent data available</Alert>;
    }

    const prices = discriminateDetailedPrices(data?.gas_prices);

    return prices ? <GasTrackerPrices prices={ prices } isLoading={ isLoading }/> : null;
  })();

  return (
    <>
      <PageTitle title="Gas tracker" secondRow={ titleSecondRow } withTextAd/>
      <Heading level="2" mt={ 8 } mb={ 4 }>{ `Track ${ config.chain.name } gas fees` }</Heading>
      { snippets }
      { config.features.stats.isEnabled && (
        <Box mt={ 12 } _empty={{ display: 'none' }}>
          <GasTrackerChart/>
        </Box>
      ) }
      <GasTrackerFaq/>
    </>
  );
};

export default GasTracker;
