import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Address, AddressCoinBalanceHistoryChart } from 'types/api/address';
import { QueryKeys } from 'types/client/queries';

import appConfig from 'configs/app/config';
import useFetch from 'lib/hooks/useFetch';
import ChartWidget from 'ui/shared/chart/ChartWidget';

interface Props {
  addressQuery: UseQueryResult<Address>;
}

const AddressCoinBalanceChart = ({ addressQuery }: Props) => {
  const fetch = useFetch();
  const { data, isLoading, isError } = useQuery<unknown, unknown, AddressCoinBalanceHistoryChart>(
    [ QueryKeys.addressCoinBalanceHistoryByDay, addressQuery.data?.hash ],
    async() => fetch(`/node-api/addresses/${ addressQuery.data?.hash }/coin-balance-history-by-day`,
    ), {
      enabled: Boolean(addressQuery.data?.hash),
    });

  const items = React.useMemo(() => data?.map(({ date, value }) => ({
    date: new Date(date),
    value: BigNumber(value).div(10 ** appConfig.network.currency.decimals).toNumber(),
  })), [ data ]);

  return (
    <ChartWidget
      title="Balances"
      items={ items }
      isLoading={ isLoading || isError }
    />
  );
};

export default React.memo(AddressCoinBalanceChart);
