import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { AddressCoinBalanceHistoryResponse } from 'types/api/address';

import { getResourceKey } from 'lib/api/useApiQuery';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import SocketAlert from 'ui/shared/SocketAlert';

import AddressCoinBalanceChart from './coinBalance/AddressCoinBalanceChart';
import AddressCoinBalanceHistory from './coinBalance/AddressCoinBalanceHistory';

const AddressCoinBalance = () => {
  const [ socketAlert, setSocketAlert ] = React.useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const addressHash = String(router.query?.id);
  const coinBalanceQuery = useQueryWithPages({
    resourceName: 'address_coin_balance',
    pathParams: { id: addressHash },
  });

  const handleSocketError = React.useCallback(() => {
    setSocketAlert(true);
  }, []);

  const handleNewSocketMessage: SocketMessage.AddressCoinBalance['handler'] = React.useCallback((payload) => {
    setSocketAlert(false);

    queryClient.setQueryData(
      getResourceKey('address_coin_balance', { pathParams: { id: addressHash } }),
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
  }, [ addressHash, queryClient ]);

  const channel = useSocketChannel({
    topic: `addresses:${ addressHash.toLowerCase() }`,
    onSocketClose: handleSocketError,
    onSocketError: handleSocketError,
    isDisabled: !addressHash || coinBalanceQuery.pagination.page !== 1,
  });
  useSocketMessage({
    channel,
    event: 'coin_balance',
    handler: handleNewSocketMessage,
  });

  return (
    <>
      { socketAlert && <SocketAlert mb={ 6 }/> }
      <AddressCoinBalanceChart addressHash={ addressHash }/>
      <AddressCoinBalanceHistory query={ coinBalanceQuery }/>
    </>
  );
};

export default React.memo(AddressCoinBalance);
