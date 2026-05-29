// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'src/api/socket/types';
import type { Address } from 'src/slices/address/types/api';

import { getResourceKey } from 'src/api/hooks/useApiQuery';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import { currencyUnits } from 'src/slices/chain/units';
import NativeTokenIcon from 'src/slices/token/components/icon/TokenIconNative';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';

interface Props {
  data: Pick<Address, 'block_number_balance_updated_at' | 'coin_balance' | 'hash' | 'exchange_rate'>;
  isLoading?: boolean;
}

const AddressBalance = ({ data, isLoading }: Props) => {
  const [ lastBlockNumber, setLastBlockNumber ] = React.useState<number>(data.block_number_balance_updated_at || 0);
  const queryClient = useQueryClient();

  const updateData = React.useCallback((balance: string, exchangeRate: string, blockNumber: number) => {
    if (blockNumber < lastBlockNumber) {
      return;
    }

    setLastBlockNumber(blockNumber);
    const queryKey = getResourceKey('general:address', { pathParams: { hash: data.hash } });
    queryClient.setQueryData(queryKey, (prevData: Address | undefined) => {
      if (!prevData) {
        return;
      }
      return {
        ...prevData,
        coin_balance: balance,
        exchange_rate: exchangeRate,
        block_number_balance_updated_at: blockNumber,
      };
    });
  }, [ data.hash, lastBlockNumber, queryClient ]);

  const handleNewBalanceMessage: SocketMessage.AddressBalance['handler'] = React.useCallback((payload) => {
    updateData(payload.balance, payload.exchange_rate, payload.block_number);
  }, [ updateData ]);

  const handleNewCoinBalanceMessage: SocketMessage.AddressCurrentCoinBalance['handler'] = React.useCallback((payload) => {
    updateData(payload.coin_balance, payload.exchange_rate, payload.block_number);
  }, [ updateData ]);

  const channel = useSocketChannel({
    topic: `addresses:${ data.hash.toLowerCase() }`,
    isDisabled: !data.coin_balance,
  });
  useSocketMessage({
    channel,
    event: 'balance',
    handler: handleNewBalanceMessage,
  });
  useSocketMessage({
    channel,
    event: 'current_coin_balance',
    handler: handleNewCoinBalanceMessage,
  });

  return (
    <>
      <DetailedInfo.ItemLabel
        hint={ `${ currencyUnits.ether } balance` }
        isLoading={ isLoading }
      >
        Balance
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow>
        <NativeCoinValue
          amount={ data.coin_balance || '0' }
          exchangeRate={ data.exchange_rate }
          startElement={ <NativeTokenIcon boxSize={ 5 } isLoading={ isLoading } mr={ 2 }/> }
          loading={ isLoading }
        />
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(AddressBalance);
