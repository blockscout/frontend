// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Chain, GetTransactionReturnType, TransactionReceipt } from 'viem';

import type { schemas } from '@blockscout/api-types';

import { toAddressModel } from 'src/slices/address/utils/model';

import hexToDecimal from 'src/shared/data/transformers/hex-to-decimal';
import dayjs from 'src/shared/date-and-time/dayjs';

interface Params {
  tx: GetTransactionReturnType<Chain, 'latest'>;
  receipt: TransactionReceipt | null;
  confirmations: bigint | null;
  block: { timestamp: bigint | null; baseFeePerGas: bigint | null | undefined } | null;
}

function getBaseTxData({ tx, receipt, confirmations, block }: Params) {
  const status = (() => {
    if (!receipt) {
      return null;
    }

    return receipt.status === 'success' ? 'ok' as const : 'error' as const;
  })();

  const gasPrice = receipt?.effectiveGasPrice ?? tx.gasPrice;

  return {
    from: toAddressModel({ hash: tx.from as string }),
    to: tx.to ? toAddressModel({ hash: tx.to as string }) : null,
    hash: tx.hash as string,
    timestamp: block?.timestamp ? dayjs.unix(Number(block.timestamp)).format() : null,
    confirmation_duration: [],
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
    gas_used: receipt?.gasUsed?.toString() ?? null,
    gas_limit: tx.gas.toString(),
    confirmations: confirmations && confirmations > 0 ? Number(confirmations) : 0,
    fee: {
      value: receipt && gasPrice ? (receipt.gasUsed * gasPrice).toString() : null,
      type: 'actual' as const,
    },
    created_contract: receipt?.contractAddress ?
      toAddressModel({ hash: receipt.contractAddress, is_contract: true }) :
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
    historic_exchange_rate: null,
    method: null,
    transaction_types: [],
    transaction_tag: null,
    authorization_list: [],
    fhe_operations_count: 0,
    is_pending_update: false,
  };
}

export function formatTxDetailsRpcData({ tx, receipt, confirmations, block }: Params): schemas['TransactionResponse'] | null {

  return getBaseTxData({ tx, receipt, confirmations, block });
}

export function formatTxListRpcData({ tx, receipt, confirmations, block }: Params): schemas['Transaction'] | null {
  return getBaseTxData({ tx, receipt, confirmations, block });
}
