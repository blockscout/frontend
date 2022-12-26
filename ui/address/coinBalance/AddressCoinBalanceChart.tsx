import type { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Address } from 'types/api/address';

import appConfig from 'configs/app/config';
import useApiQuery from 'lib/api/useApiQuery';
import ChartWidget from 'ui/shared/chart/ChartWidget';

interface Props {
  addressQuery: UseQueryResult<Address>;
}

const AddressCoinBalanceChart = ({ addressQuery }: Props) => {
  const { data, isLoading, isError } = useApiQuery('address_coin_balance_chart', {
    pathParams: { id: addressQuery.data?.hash },
    queryOptions: { enabled: Boolean(addressQuery.data?.hash) },
  });

  const items = React.useMemo(() => data?.map(({ date, value }) => ({
    date: new Date(date),
    value: BigNumber(value).div(10 ** appConfig.network.currency.decimals).toNumber(),
  })), [ data ]);

  return (
    <ChartWidget
      chartHeight="200px"
      title="Balances"
      items={ items }
      isLoading={ isLoading || isError }
    />
  );
};

export default React.memo(AddressCoinBalanceChart);
