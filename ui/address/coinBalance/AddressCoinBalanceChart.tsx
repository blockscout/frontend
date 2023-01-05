import BigNumber from 'bignumber.js';
import React from 'react';

import appConfig from 'configs/app/config';
import useApiQuery from 'lib/api/useApiQuery';
import ChartWidget from 'ui/shared/chart/ChartWidget';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

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

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (!items?.length) {
    return null;
  }

  return (
    <ChartWidget
      chartHeight="200px"
      title="Balances"
      items={ items }
      isLoading={ isLoading }
    />
  );
};

export default React.memo(AddressCoinBalanceChart);
