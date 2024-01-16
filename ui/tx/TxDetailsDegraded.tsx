import { Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { Chain, GetBlockReturnType, GetTransactionReturnType, TransactionReceipt } from 'viem';

import type { Transaction } from 'types/api/transaction';

import type { ResourceError } from 'lib/api/resources';
import dayjs from 'lib/date/dayjs';
import hexToDecimal from 'lib/hexToDecimal';
import { publicClient } from 'lib/web3/client';
import { GET_BLOCK, GET_TRANSACTION, GET_TRANSACTION_RECEIPT, GET_TRANSACTION_CONFIRMATIONS } from 'stubs/RPC';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import ServiceDegradationAlert from 'ui/shared/ServiceDegradationAlert';

import TxInfo from './details/TxInfo';

type RpcResponseType = [
  GetTransactionReturnType<Chain, 'latest'> | null,
  TransactionReceipt | null,
  bigint,
  GetBlockReturnType<Chain, false, 'latest'> | null,
];

interface Props {
  hash: string;
  originalError: ResourceError | null;
}

// TODO @tom2drum try to write tests

const TxDetailsDegraded = ({ hash, originalError }: Props) => {

  const query = useQuery<RpcResponseType, unknown, Transaction | null>({
    queryKey: [ 'RPC', 'tx', { hash } ],
    queryFn: async() => {
      const tx = await publicClient.getTransaction({ hash: hash as `0x${ string }` });

      return Promise.all([
        tx,
        publicClient.getTransactionReceipt({ hash: hash as `0x${ string }` }),
        publicClient.getTransactionConfirmations({ hash: hash as `0x${ string }` }),
        publicClient.getBlock({ blockHash: tx.blockHash }),
      ]);
    },
    select: (response) => {
      const [ tx, txReceipt, txConfirmations, block ] = response;

      if (!tx) {
        return null;
      }

      const status = (() => {
        if (!tx?.blockNumber) {
          return null;
        }

        return txReceipt?.status === 'success' ? 'ok' : 'error';
      })();

      const gasPrice = txReceipt?.effectiveGasPrice ?? tx.gasPrice;
      const unknownAddress = {
        is_contract: false,
        is_verified: false,
        implementation_name: '',
        name: '',
        private_tags: [],
        public_tags: [],
        watchlist_names: [],
      };

      return {
        from: { ...unknownAddress, hash: tx.from as string },
        to: tx.to ? { ...unknownAddress, hash: tx.to as string } : null,
        hash: tx.hash as string,
        timestamp: block?.timestamp ? dayjs.unix(Number(block.timestamp)).format() : null,
        confirmation_duration: null,
        status,
        block: tx.blockNumber ? Number(tx.blockNumber) : null,
        value: tx.value.toString(),
        gas_price: txReceipt?.effectiveGasPrice.toString() ?? tx.gasPrice?.toString() ?? null,
        base_fee_per_gas: block?.baseFeePerGas?.toString() ?? null,
        max_fee_per_gas: tx.maxFeePerGas?.toString() ?? null,
        max_priority_fee_per_gas: tx.maxPriorityFeePerGas?.toString() ?? null,
        nonce: tx.nonce,
        position: tx.transactionIndex,
        type: tx.typeHex ? hexToDecimal(tx.typeHex) : null,
        raw_input: tx.input,
        gas_used: txReceipt?.gasUsed?.toString() ?? null,
        gas_limit: tx.gas.toString(),
        confirmations: Number(txConfirmations),
        fee: {
          value: txReceipt && gasPrice ? (txReceipt.gasUsed * gasPrice).toString() : null,
          type: 'actual',
        },
        created_contract: txReceipt?.contractAddress ?
          { ...unknownAddress, hash: txReceipt.contractAddress, is_contract: true } :
          null,
        result: '',
        priority_fee: null,
        tx_burnt_fee: null,
        revert_reason: null,
        decoded_input: null,
        has_error_in_internal_txs: null,
        token_transfers: null,
        token_transfers_overflow: false,
        exchange_rate: null,
        method: null,
        tx_types: [],
        tx_tag: null,
        actions: [],
      };
    },
    placeholderData: [
      GET_TRANSACTION,
      GET_TRANSACTION_RECEIPT,
      GET_TRANSACTION_CONFIRMATIONS,
      GET_BLOCK,
    ],
    refetchOnMount: false,
  });

  if (!query.data) {
    if (originalError?.status === 404) {
      throw Error('Tx not found', { cause: { status: 404 } as unknown as Error });
    }

    return <DataFetchAlert/>;
  }

  return (
    <>
      { originalError?.status !== 404 && (
        <Skeleton mb={ 6 } isLoaded={ !query.isPlaceholderData }>
          <ServiceDegradationAlert/>
        </Skeleton>
      ) }
      <TxInfo data={ query.data } isLoading={ query.isPlaceholderData }/>
    </>
  );
};

export default React.memo(TxDetailsDegraded);
