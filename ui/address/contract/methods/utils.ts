import type { Abi } from 'abitype';
import type { AbiFunction } from 'viem';
import { getAddress, toBytes, toFunctionSelector, toHex, toRlp } from 'viem';

import type { SmartContractMethodCustomFields, SmartContractMethodRead, SmartContractMethodWrite } from './types';

export const getNativeCoinValue = (value: unknown) => {
  if (typeof value !== 'string') {
    return BigInt(0);
  }

  return BigInt(value);
};

interface DividedAbi {
  read: Array<SmartContractMethodRead>;
  write: Array<SmartContractMethodWrite>;
}

export const isReadMethod = (method: Abi[number]): method is SmartContractMethodRead =>
  method.type === 'function' && (
    method.constant || method.stateMutability === 'view' || method.stateMutability === 'pure'
  );

export const isWriteMethod = (method: Abi[number]): method is SmartContractMethodWrite =>
  (method.type === 'function' || method.type === 'fallback' || method.type === 'receive') &&
    !isReadMethod(method);

const enrichWithMethodId = (method: AbiFunction): SmartContractMethodCustomFields => {
  try {
    return {
      method_id: toFunctionSelector(method).slice(2),
    };
  } catch (error) {
    return {
      is_invalid: true,
    };
  }
};

export function divideAbiIntoMethodTypes(abi: Abi): DividedAbi {
  return {
    read: abi
      .filter(isReadMethod)
      .map((method) => ({
        ...method,
        ...enrichWithMethodId(method),
      })),
    write: abi
      .filter(isWriteMethod)
      .map((method) => {

        if (method.type !== 'function') {
          return method;
        }

        return {
          ...method,
          ...enrichWithMethodId(method),
        };
      }),
  };
}

export const buildFacetTransaction = ({
  chainId,
  to,
  value,
  maxFeePerGas,
  gasLimit,
  data = '0x',
}: {
  chainId: number;
  to: `0x${ string }`;
  value: bigint;
  maxFeePerGas: bigint;
  gasLimit: bigint;
  data?: `0x${ string }`;
}) => {
  const facetTxType = toBytes(70);

  const rlpEncoded = toRlp([
    toHex(chainId),
    getAddress(to),
    toHex(value),
    toHex(maxFeePerGas),
    toHex(gasLimit),
    data,
  ], 'bytes');

  return new Uint8Array([ ...facetTxType, ...rlpEncoded ]);
};
