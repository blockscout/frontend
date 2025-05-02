import { Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { Chain, GetBlockReturnType, GetTransactionReturnType, TransactionReceipt } from 'viem';

import type { Transaction } from 'types/api/transaction';

import dayjs from 'lib/date/dayjs';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import hexToDecimal from 'lib/hexToDecimal';
import { publicClient } from 'lib/web3/client';
import { GET_BLOCK, GET_TRANSACTION, GET_TRANSACTION_RECEIPT, GET_TRANSACTION_CONFIRMATIONS } from 'stubs/RPC';
import { SECOND } from 'toolkit/utils/consts';
import { unknownAddress } from 'ui/shared/address/utils';
import ServiceDegradationWarning from 'ui/shared/alerts/ServiceDegradationWarning';
import TestnetWarning from 'ui/shared/alerts/TestnetWarning';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TxInfo from './details/TxInfo';
import type { TxQuery } from './useTxQuery';

type RpcResponseType = [
  GetTransactionReturnType<Chain, 'latest'>,
  TransactionReceipt | null,
  bigint | null,
  GetBlockReturnType<Chain, false, 'latest'> | null,
];

interface Props {
  hash: string;
  txQuery: TxQuery;
}

const TxDetailsDegraded = ({ hash, txQuery }: Props) => {

  const [ originalError ] = React.useState(txQuery.error);

  const query = useQuery<RpcResponseType, unknown, Transaction | null>({
    queryKey: [ 'RPC', 'tx', { hash } ],
    queryFn: async() => {
      if (!publicClient) {
        throw new Error('No public RPC client');
      }

      const tx = await publicClient.getTransaction({ hash: hash as `0x${ string }` });

      if (!tx) {
        throw new Error('Not found');
      }

      const txReceipt = await publicClient.getTransactionReceipt({ hash: hash as `0x${ string }` }).catch(() => null);
      const block = await publicClient.getBlock({ blockHash: tx.blockHash }).catch(() => null);
      const latestBlock = await publicClient.getBlock().catch(() => null);
      const confirmations = latestBlock && block ? latestBlock.number - block.number + BigInt(1) : null;

      return [
        tx,
        txReceipt,
        confirmations,
        block,
      ];
    },
    select: (response) => {
      const [ tx, txReceipt, txConfirmations, block ] = response;

      const status = (() => {
        if (!txReceipt) {
          return null;
        }

        return txReceipt.status === 'success' ? 'ok' : 'error';
      })();

      const gasPrice = txReceipt?.effectiveGasPrice ?? tx.gasPrice;

      return {
        from: { ...unknownAddress, hash: tx.from as string },
        to: tx.to ? { ...unknownAddress, hash: tx.to as string } : null,
        hash: tx.hash as string,
        timestamp: block?.timestamp ? dayjs.unix(Number(block.timestamp)).format() : null,
        confirmation_duration: null,
        status,
        block_number: tx.blockNumber ? Number(tx.blockNumber) : null,
        value: tx.value.toString(),
        gas_price: gasPrice?.toString() ?? null,
        base_fee_per_gas: block?.baseFeePerGas?.toString() ?? null,
        max_fee_per_gas: tx.maxFeePerGas?.toString() ?? null,
        max_priority_fee_per_gas: tx.maxPriorityFeePerGas?.toString() ?? null,
        nonce: tx.nonce,
        position: tx.transactionIndex,
        type: tx.typeHex ? hexToDecimal(tx.typeHex) : null,
        raw_input: tx.input,
        gas_used: txReceipt?.gasUsed?.toString() ?? null,
        gas_limit: tx.gas.toString(),
        confirmations: txConfirmations && txConfirmations > 0 ? Number(txConfirmations) : 0,
        fee: {
          value: txReceipt && gasPrice ? (txReceipt.gasUsed * gasPrice).toString() : null,
          type: 'actual',
        },
        created_contract: txReceipt?.contractAddress ?
          { ...unknownAddress, hash: txReceipt.contractAddress, is_contract: true } :
          null,
        result: '',
        priority_fee: null,
        transaction_burnt_fee: null,
        revert_reason: null,
        decoded_input: null,
        has_error_in_internal_transactions: null,
        token_transfers: null,
        token_transfers_overflow: false,
        exchange_rate: null,
        method: null,
        transaction_types: [],
        transaction_tag: null,
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
    enabled: !txQuery.isPlaceholderData,
    retry: 2,
    retryDelay: 5 * SECOND,
  });

  const hasData = Boolean(query.data);

  React.useEffect(() => {
    if (!query.isPlaceholderData && hasData) {
      txQuery.setRefetchEnabled(true);
    }
  }, [ hasData, query.isPlaceholderData, txQuery ]);

  React.useEffect(() => {
    return () => {
      txQuery.setRefetchEnabled(false);
    };
  }, [ txQuery ]);

  if (!query.data) {
    if (originalError && isCustomAppError(originalError)) {
      throwOnResourceLoadError({ resource: 'general:tx', error: originalError, isError: true });
    }

    return <DataFetchAlert/>;
  }

  return (
    <>
      <Flex rowGap={ 2 } mb={ 6 } flexDir="column">
        <TestnetWarning isLoading={ query.isPlaceholderData }/>
        { originalError?.status !== 404 && <ServiceDegradationWarning isLoading={ query.isPlaceholderData }/> }
      </Flex>
      <TxInfo data={ query.data } isLoading={ query.isPlaceholderData }/>
    </>
  );
};

export default React.memo(TxDetailsDegraded);
