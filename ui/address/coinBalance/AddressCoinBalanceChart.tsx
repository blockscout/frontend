import BigNumber from 'bignumber.js';
import React from 'react';

import appConfig from 'configs/app/config';
import useApiQuery from 'lib/api/useApiQuery';
import ChartWidget from 'ui/shared/chart/ChartWidget';

interface Props {
  addressHash: string;
}

const AddressCoinBalanceChart = ({ addressHash }: Props) => {
  const { data, isLoading, isError } = useApiQuery('address_coin_balance_chart', {
    pathParams: { id: addressHash },
  });

  const items = React.useMemo(() => data?.map(({ date, value }) => ({
    date: new Date(date),
    value: BigNumber(value).div(10 ** appConfig.network.currency.decimals).toNumber(),
  })), [ data ]);

  return (
    <ChartWidget
      isError={ isError }
      title="Balances"
      items={ items }
      isLoading={ isLoading }
      h="250px"
    />
  );
};

export default React.memo(AddressCoinBalanceChart);
