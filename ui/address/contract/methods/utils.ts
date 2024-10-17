import type { Abi, AbiFallback, AbiReceive } from 'abitype';
import type { AbiFunction } from 'viem';
import { toFunctionSelector } from 'viem';

import type { SmartContractMethod, SmartContractMethodRead, SmartContractMethodWrite } from './types';

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

export const isMethod = (method: Abi[number]): method is SmartContractMethod =>
  (method.type === 'function' || method.type === 'fallback' || method.type === 'receive');

export const isReadMethod = (method: Abi[number]): method is SmartContractMethodRead =>
  method.type === 'function' && (
    method.constant || method.stateMutability === 'view' || method.stateMutability === 'pure'
  );

export const isWriteMethod = (method: Abi[number]): method is SmartContractMethodWrite =>
  (method.type === 'function' || method.type === 'fallback' || method.type === 'receive') &&
    !isReadMethod(method);

export const enrichWithMethodId = (method: AbiFunction | AbiFallback | AbiReceive): SmartContractMethod => {
  if (method.type !== 'function') {
    return method;
  }

  try {
    return {
      ...method,
      method_id: toFunctionSelector(method).slice(2),
    };
  } catch (error) {
    return {
      ...method,
      is_invalid: true,
    };
  }
};

export function divideAbiIntoMethodTypes(abi: Abi): DividedAbi {
  return {
    read: abi
      .filter(isReadMethod)
      .map(enrichWithMethodId) as Array<SmartContractMethodRead>,
    write: abi
      .filter(isWriteMethod)
      .map(enrichWithMethodId) as Array<SmartContractMethodWrite>,
  };
}
