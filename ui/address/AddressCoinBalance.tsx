import { useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Address, AddressCoinBalanceHistoryResponse } from 'types/api/address';

import { getResourceKey } from 'lib/api/useApiQuery';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import SocketAlert from 'ui/shared/SocketAlert';

import AddressCoinBalanceChart from './coinBalance/AddressCoinBalanceChart';
import AddressCoinBalanceHistory from './coinBalance/AddressCoinBalanceHistory';

interface Props {
  addressQuery: UseQueryResult<Address>;
}

const AddressCoinBalance = ({ addressQuery }: Props) => {
  const [ socketAlert, setSocketAlert ] = React.useState(false);
  const queryClient = useQueryClient();

  const coinBalanceQuery = useQueryWithPages({
    resourceName: 'address_coin_balance',
    pathParams: { id: addressQuery.data?.hash },
    options: {
      enabled: Boolean(addressQuery.data),
    },
  });

  const handleSocketError = React.useCallback(() => {
    setSocketAlert(true);
  }, []);

  const handleNewSocketMessage: SocketMessage.AddressCoinBalance['handler'] = React.useCallback((payload) => {
    setSocketAlert(false);

    queryClient.setQueryData(
      getResourceKey('address_coin_balance', { pathParams: { id: addressQuery.data?.hash } }),
      (prevData: AddressCoinBalanceHistoryResponse | undefined) => {
        if (!prevData) {
          return;
        }

        return {
          ...prevData,
          items: [
            payload.coin_balance,
            ...prevData.items,
          ],
        };
      });
  }, [ addressQuery.data?.hash, queryClient ]);

  const channel = useSocketChannel({
    topic: `addresses:${ addressQuery.data?.hash.toLowerCase() }`,
    onSocketClose: handleSocketError,
    onSocketError: handleSocketError,
    isDisabled: addressQuery.isLoading || addressQuery.isError || !addressQuery.data.hash || coinBalanceQuery.pagination.page !== 1,
  });
  useSocketMessage({
    channel,
    event: 'coin_balance',
    handler: handleNewSocketMessage,
  });

  return (
    <>
      { socketAlert && <SocketAlert mb={ 6 }/> }
      <AddressCoinBalanceChart/>
      <AddressCoinBalanceHistory query={ coinBalanceQuery }/>
    </>
  );
};

export default React.memo(AddressCoinBalance);
