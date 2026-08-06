// SPDX-License-Identifier: LicenseRef-Blockscout

import { Grid } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';

import GasPrice from 'src/slices/gas/components/GasPrice';
import { useHomeRpcDataContext } from 'src/slices/home/contexts/rpc-data-context';
import type { HomeStatsWidgetItem } from 'src/slices/home/utils/stats';
import { homeStatsWidgetCommonStyles, isHomeStatsItemEnabled, sortHomeStatsItems } from 'src/slices/home/utils/stats';

import { getPublicClient, isPublicClientAvailable } from 'src/features/connect-wallet/utils/public-client';

import dayjs from 'src/shared/date-and-time/dayjs';
import StatsWidget from 'src/shared/stats/StatsWidget';
import { GWEI } from 'src/shared/values/entity/utils';

import { Tooltip } from 'src/toolkit/chakra/tooltip';
import { mdash } from 'src/toolkit/utils/htmlEntities';

const TOOLTIP_CONTENT_VALUE = 'Our indexer is experiencing problems, you see the data directly from RPC';
const TOOLTIP_CONTENT_NO_VALUE = 'Our indexer is experiencing problems and we couldn\'t get this data directly from RPC';

const StatsDegraded = () => {

  const [ averageBlockTime, setAverageBlockTime ] = React.useState<number | undefined>(undefined);

  const { blocks, isLoading, enable } = useHomeRpcDataContext();

  const gasPriceQuery = useQuery({
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
    enabled: isPublicClientAvailable,
  });

  React.useEffect(() => {
    enable(true, 'stats-widgets');
    return () => {
      enable(false, 'stats-widgets');
    };
  }, [ enable ]);

  React.useEffect(() => {
    if (blocks.length > 1) {
      const timeDiffs = blocks
        .map((block, index) => {
          if (index > 0) {
            return dayjs(blocks[index - 1].timestamp).diff(dayjs(block.timestamp), 'seconds');
          }
          return 0;
        })
        .slice(1);
      const totalDiff = timeDiffs.reduce((acc, diff) => acc + diff, 0);
      setAverageBlockTime((prev) => {
        if (prev === undefined) {
          return totalDiff / timeDiffs.length;
        }
        return (prev + totalDiff) / (timeDiffs.length + 1);
      });
    }
  }, [ blocks ]);

  const items: Array<HomeStatsWidgetItem> = (() => {
    return [
      {
        id: 'latest_batch' as const,
        icon: 'txn_batches' as const,
        label: 'Latest batch',
        value: mdash,
        isFallback: true,
      },
      {
        id: 'total_blocks' as const,
        icon: 'block' as const,
        label: 'Latest block',
        value: blocks[0] ? blocks[0].height.toLocaleString() : mdash,
        isFallback: blocks[0] === undefined,
      },
      {
        id: 'average_block_time' as const,
        icon: 'clock-light' as const,
        label: 'Average block time',
        value: averageBlockTime ? `${ averageBlockTime.toFixed(1) }s` : mdash,
        isFallback: averageBlockTime === undefined,
      },
      {
        id: 'total_txs' as const,
        icon: 'transactions' as const,
        label: 'Total transactions',
        value: mdash,
        isFallback: true,
      },
      {
        id: 'total_operational_txs' as const,
        icon: 'transactions' as const,
        label: 'Total operational transactions',
        value: mdash,
        isFallback: true,
      },
      {
        id: 'latest_l1_state_batch' as const,
        icon: 'txn_batches' as const,
        label: 'Latest L1 state batch',
        value: mdash,
        isFallback: true,
      },
      {
        id: 'wallet_addresses' as const,
        icon: 'wallet' as const,
        label: 'Wallet addresses',
        value: mdash,
        isFallback: true,
      },
      {
        id: 'gas_tracker' as const,
        icon: 'gas' as const,
        label: 'Gas tracker',
        value: gasPriceQuery.data ? <GasPrice data={ gasPriceQuery.data }/> : mdash,
        isFallback: !gasPriceQuery.data,
        isLoading: gasPriceQuery.isLoading,
      },
      {
        id: 'btc_locked' as const,
        icon: 'coins/bitcoin' as const,
        label: 'BTC Locked in 2WP',
        value: mdash,
        isFallback: true,
      },
      {
        id: 'current_epoch' as const,
        icon: 'hourglass' as const,
        label: 'Current epoch',
        value: mdash,
        isFallback: true,
      },
    ]
      .filter(Boolean)
      .filter(isHomeStatsItemEnabled)
      .sort(sortHomeStatsItems);;
  })();

  if (items.length === 0) {
    return null;
  }

  return (
    <Grid
      gridTemplateColumns="1fr 1fr"
      gridGap={{ base: 1, lg: 2 }}
      flexBasis="50%"
      flexGrow={ 1 }
    >
      { items.map(({ id, ...item }) => {
        const isLoadingState = item.isLoading || isLoading;
        return (
          <Tooltip
            key={ id }
            content={ item.value !== mdash ? TOOLTIP_CONTENT_VALUE : TOOLTIP_CONTENT_NO_VALUE }
            disabled={ isLoadingState }
          >
            <StatsWidget
              { ...item }
              isLoading={ isLoadingState }
              { ...homeStatsWidgetCommonStyles }
            />
          </Tooltip>
        );
      }) }
    </Grid>

  );
};

export default React.memo(StatsDegraded);
