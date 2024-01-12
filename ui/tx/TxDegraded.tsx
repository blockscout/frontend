import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { Chain, GetTransactionReturnType } from 'viem';

import type { Transaction } from 'types/api/transaction';

import hexToDecimal from 'lib/hexToDecimal';
import { publicClient } from 'lib/web3/client';

import TxInfo from './details/TxInfo';

interface Props {
  hash: string;
}

const TxDegraded = ({ hash }: Props) => {

  const query = useQuery<GetTransactionReturnType<Chain, 'latest'>, unknown, Transaction>({
    queryKey: [ 'RPC', 'tx', { hash } ],
    queryFn: () => {
      return publicClient.getTransaction({ hash: hash as `0x${ string }` });
    },
    select: (data) => {
    //   console.log('__>__', data);

      return {
        from: { hash: data.from as string },
        to: data.to ? { hash: data.to as string } : null,
        hash: data.hash as string,
        status: data.blockNumber ? 'ok' : null, // TODO @tom2drum handle error status
        block: data.blockNumber ? data.blockNumber?.toString() : null,
        value: data.value.toString(),
        gas_price: data.gasPrice?.toString() ?? null,
        max_fee_per_gas: data.maxFeePerGas?.toString() ?? null,
        max_priority_fee_per_gas: data.maxPriorityFeePerGas?.toString() ?? null,
        nonce: data.nonce,
        position: data.transactionIndex,
        type: data.typeHex ? hexToDecimal(data.typeHex) : null,
        raw_input: data.input,
        // TODO @tom2drum add more fields
        fee: {
          value: '42',
          type: 'actual',
        },
        // additional fields:
        // method
        // confirmations
        // revert_reason
        // timestamp
        // contract creation
        // gas_used + gas_limit
        // tx_burnt_fee
      } as Transaction; // TODO @tom2drum remove type coercion
    },
  });

  return <TxInfo data={ query.data } isLoading={ query.isPending }/>;
};

export default React.memo(TxDegraded);
