// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';

import GasInfoTooltip from 'src/slices/gas/components/GasInfoTooltip';
import GasPrice from 'src/slices/gas/components/GasPrice';
import discriminateDetailedPrices from 'src/slices/gas/utils/price';

import { getPublicClient, isPublicClientAvailable } from 'src/features/connect-wallet/utils/public-client';

import { GWEI } from 'src/shared/values/entity/utils';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

import HomeStatsWidget from '../HomeStatsWidget';
import useStatsHome from '../useStatsHome';
import { RPC_TOOLTIP_CONTENT_NO_VALUE, RPC_TOOLTIP_CONTENT_VALUE } from '../utils';

const HomeStatsGasTracker = () => {
  const statsQuery = useStatsHome();

  const isRpcEnabled = isPublicClientAvailable && statsQuery.isError;

  const rpcQuery = useQuery({
    queryKey: [ 'RPC', 'gas-price' ],
    queryFn: async() => {
      const publicClient = await getPublicClient();
      if (!publicClient) {
        return null;
      }
      return publicClient.getGasPrice();
    },
    select: (data) => {
      if (!data) {
        return null;
      }
      const price = BigNumber(data.toString()).div(GWEI).toNumber();
      return {
        price,
        fiat_price: null,
        time: null,
        base_fee: null,
        priority_fee: null,
        priority_fee_wei: null,
        wei: null,
      };
    },
    enabled: isRpcEnabled,
  });

  const isLoading = statsQuery.isLoading || (isRpcEnabled && rpcQuery.isLoading);

  const gasPricesData = React.useMemo(() => {
    if (statsQuery?.data.gas_prices && statsQuery.data.gas_prices.average) {
      return {
        gas_prices: statsQuery.data.gas_prices,
        gas_price_updated_at: statsQuery.data.gas_price_updated_at ?? null,
        gas_prices_update_in: statsQuery.data.gas_prices_update_in ?? null,
      };
    }
  }, [ statsQuery.data ]);

  const infoTooltip = !isRpcEnabled && gasPricesData ? (
    <GasInfoTooltip data={ gasPricesData } dataUpdatedAt={ statsQuery.dataUpdatedAt }>
      <SpriteIcon
        isLoading={ statsQuery.isLoading }
        name="info"
        boxSize={ 5 }
        flexShrink={ 0 }
        cursor="pointer"
        color="icon.secondary"
        _hover={{ color: 'hover' }}
      />
    </GasInfoTooltip>
  ) : null;

  const value = (() => {
    if (isRpcEnabled) {
      return rpcQuery.data ? <GasPrice data={ rpcQuery.data }/> : mdash;
    }
    const gasPrices = discriminateDetailedPrices(statsQuery.data?.gas_prices);
    if (!gasPrices) {
      return;
    }
    return gasPrices.average ? <GasPrice data={ gasPrices.average }/> : 'N/A';
  })();

  if (!value) {
    return null;
  }

  return (
    <Tooltip
      content={ value !== mdash ? RPC_TOOLTIP_CONTENT_VALUE : RPC_TOOLTIP_CONTENT_NO_VALUE }
      disabled={ !(isRpcEnabled && !rpcQuery.isLoading) }
    >
      <HomeStatsWidget
        label="Gas tracker"
        icon="gas"
        value={ value }
        href={{ pathname: '/gas-tracker' }}
        hint={ infoTooltip }
        isLoading={ isLoading }
      />
    </Tooltip>
  );
};

export default React.memo(HomeStatsGasTracker);
