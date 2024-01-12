import { Alert } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { Chain, GetBlockReturnType, GetTransactionReturnType, TransactionReceipt } from 'viem';

import type { Transaction } from 'types/api/transaction';

import dayjs from 'lib/date/dayjs';
import hexToDecimal from 'lib/hexToDecimal';
import { publicClient } from 'lib/web3/client';

import TxInfo from './details/TxInfo';

type RpcResponseType = [
  GetTransactionReturnType<Chain, 'latest'>,
  TransactionReceipt | null,
  bigint,
  GetBlockReturnType<Chain, false, 'latest'> | null,
];

interface Props {
  hash: string;
}

const TxDegraded = ({ hash }: Props) => {

  const query = useQuery<RpcResponseType, unknown, Transaction>({
    queryKey: [ 'RPC', 'tx', { hash } ],
    queryFn: async() => {
      const tx = await publicClient.getTransaction({ hash: hash as `0x${ string }` });

      return await Promise.all([
        tx,
        publicClient.getTransactionReceipt({ hash: hash as `0x${ string }` }), // TODO @tom2drum pending tx case when receipt is not available
        publicClient.getTransactionConfirmations({ hash: hash as `0x${ string }` }),
        publicClient.getBlock({ blockHash: tx.blockHash }),
      ]);
    },
    select: (response) => {
      const [ tx, txReceipt, txConfirmations, block ] = response;

      const status = (() => {
        if (!tx.blockNumber) {
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
    // TODO @tom2drum add placeholder data
  });

  return (
    <>
      <Alert status="warning" mb={ 6 }>Blockscout is busy, retrying...</Alert>
      <TxInfo data={ query.data } isLoading={ query.isPlaceholderData }/>
    </>
  );
};

export default React.memo(TxDegraded);
