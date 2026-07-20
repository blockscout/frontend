// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Abi } from 'abitype';
import { encodeFunctionData, toFunctionSelector } from 'viem';
import { estimateGas } from 'viem/actions';

import type { MethodType, SmartContractMethod, SmartContractMethodRead, SmartContractMethodWrite } from './types';

import wagmiConfig from 'src/features/connect-wallet/utils/wagmi-config';

import { collator } from 'src/shared/texts/collator';

// 20% headroom so the tx does not OOG between estimate and inclusion
const GAS_ESTIMATE_BUFFER_NUMERATOR = BigInt(120);
const GAS_ESTIMATE_BUFFER_DENOMINATOR = BigInt(100);

export const getNativeCoinValue = (value: unknown) => {
  if (typeof value !== 'string') {
    return BigInt(0);
  }

  return BigInt(value);
};

export const isMethod = (method: Abi[number]) =>
  (method.type === 'function' || method.type === 'fallback' || method.type === 'receive');

export const isReadMethod = (method: SmartContractMethod): method is SmartContractMethodRead =>
  (
    method.type === 'function' &&
    (method.constant || method.stateMutability === 'view' || method.stateMutability === 'pure')
  ) || (
    method.type === 'fallback' && method.stateMutability === 'view'
  );

export const isWriteMethod = (method: SmartContractMethod): method is SmartContractMethodWrite =>
  (method.type === 'function' || method.type === 'fallback' || method.type === 'receive') &&
    !isReadMethod(method);

export const enrichWithMethodId = (method: SmartContractMethod): SmartContractMethod => {
  if (method.type !== 'function') {
    return method;
  }

  try {
    return {
      ...method,
      method_id: toFunctionSelector(method),
    };
  } catch (error) {
    return {
      ...method,
      is_invalid: true,
    };
  }
};

export const addInputsToFallback = (method: SmartContractMethod): SmartContractMethod => {
  if (method.type === 'fallback') {
    return {
      ...method,
      inputs: [ { internalType: 'bytes', name: 'input', type: 'bytes' } ],
      outputs: [ { internalType: 'bytes', name: 'output', type: 'bytes' } ],
    };
  }

  return method;
};

const getNameForSorting = (method: SmartContractMethod) => {
  if ('name' in method) {
    return method.name;
  }

  return method.type === 'fallback' ? 'fallback' : 'receive';
};

export const formatAbi = (abi: Abi) => {

  const methods = abi.filter(isMethod) as Array<SmartContractMethod>;

  return methods
    .map(enrichWithMethodId)
    .map(addInputsToFallback)
    .sort((a, b) => {
      const aName = getNameForSorting(a);
      const bName = getNameForSorting(b);
      return collator.compare(aName, bName);
    });
};

export const TYPE_FILTER_OPTIONS: Array<{ value: MethodType; title: string }> = [
  { value: 'all', title: 'All' },
  { value: 'read', title: 'Read' },
  { value: 'write', title: 'Write' },
];

interface EstimateTransactionGasParams {
  account: `0x${ string }` | undefined;
  to: `0x${ string }`;
  value: bigint;
  abiItem: SmartContractMethod;
  args: Array<unknown>;
  chainId?: number;
}

export async function estimateTransactionGas(params: EstimateTransactionGasParams) {
  const { account, to, value, abiItem, args, chainId } = params;

  const data = (() => {
    if (abiItem.type === 'fallback') {
      return typeof args[0] === 'string' && args[0].startsWith('0x') ? args[0] as `0x${ string }` : undefined;
    }

    if (abiItem.type === 'receive') {
      return;
    }

    return encodeFunctionData({
      abi: [ abiItem ],
      functionName: abiItem.name,
      args,
    });
  })();

  // Use viem estimateGas on the public client — wagmi/actions estimateGas falls back to
  // getConnectorClient when account is undefined, which breaks disconnected reads/simulates.
  const client = wagmiConfig.config.getClient({ chainId });
  return estimateGas(client, {
    account,
    to,
    value,
    data,
  });
}

export function withGasEstimateBuffer(estimatedGas: bigint) {
  return estimatedGas * GAS_ESTIMATE_BUFFER_NUMERATOR / GAS_ESTIMATE_BUFFER_DENOMINATOR;
}
