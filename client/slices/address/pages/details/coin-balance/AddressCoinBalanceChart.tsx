// SPDX-License-Identifier: LicenseRef-Blockscout

import BigNumber from 'bignumber.js';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import { currencyUnits } from 'client/shared/chain/units';

import config from 'configs/app';
import { LineChartWidget } from 'toolkit/components/charts/line/LineChartWidget';
import { useChartsConfig } from 'ui/shared/chart/config';

interface Props {
  addressHash: string;
}

const AddressCoinBalanceChart = ({ addressHash }: Props) => {
  const { data, isPending, isError } = useApiQuery('general:address_coin_balance_chart', {
    pathParams: { hash: addressHash },
  });
  const chartsConfig = useChartsConfig();

  const charts = React.useMemo(() => {
    if (!data) {
      return [];
    }

    return [
      {
        id: 'balance',
        name: 'Value',
        items: data.items.map(({ date, value }) => ({
          date: new Date(date),
          value: BigNumber(value).div(10 ** config.chain.currency.decimals).toNumber(),
        })),
        charts: chartsConfig,
        units: currencyUnits.ether,
      },
    ];
  }, [ chartsConfig, data ]);

  return (
    <LineChartWidget
      isError={ isError }
      title="Balances"
      charts={ charts }
      isLoading={ isPending }
      h="300px"
      emptyText={ data?.days ? `Insufficient data for the past ${ data.days } days` : undefined }
      noEmptyStateIcon
    />
  );
};

export default React.memo(AddressCoinBalanceChart);
