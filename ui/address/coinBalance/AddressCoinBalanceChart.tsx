import BigNumber from 'bignumber.js';
import React from 'react';

import type { AddressCoinBalanceHistoryChart } from 'types/api/address';
import type { TokenInfo } from 'types/api/token';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { currencyUnits } from 'lib/units';
import { ChartWidget } from 'toolkit/components/charts/ChartWidget';
import { useChartsConfig } from 'ui/shared/chart/config';

interface Props {
  addressHash: string;
  tokenFilter: string;
  token?: TokenInfo;
}

const AddressCoinBalanceChart = ({ addressHash, tokenFilter, token }: Props) => {
  const { data, isPending, isError } = useApiQuery('general:address_coin_balance_chart', {
    pathParams: { hash: addressHash },
    queryParams: { token_contract_address_hash: tokenFilter },
  });
  const chartsConfig = useChartsConfig();

  const charts = React.useMemo(() => {
    if (!data) {
      return [];
    }

    const items: AddressCoinBalanceHistoryChart['items'] = Array.isArray(data) ?
      data as AddressCoinBalanceHistoryChart['items'] :
      data.items;
    const decimals = Number(token?.decimals ?? config.chain.currency.decimals);
    const units = token?.symbol || currencyUnits.ether;

    return [
      {
        id: 'balance',
        name: 'Value',
        items: items.map(({ date, value }) => ({
          date: new Date(date),
          value: BigNumber(value).div(BigNumber(10).pow(decimals)).toNumber(),
        })),
        charts: chartsConfig,
        units,
      },
    ];
  }, [ chartsConfig, data, token ]);

  return (
    <ChartWidget
      isError={ isError }
      title="Balances"
      charts={ charts }
      isLoading={ isPending }
      h="300px"
      emptyText={ !Array.isArray(data) && data?.days ? `Insufficient data for the past ${ data.days } days` : undefined }
    />
  );
};

export default React.memo(AddressCoinBalanceChart);
