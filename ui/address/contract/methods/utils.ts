import type { Abi, AbiFallback, AbiReceive } from 'abitype';
import type { AbiFunction } from 'viem';
import { toFunctionSelector } from 'viem';

import type { MethodType, SmartContractMethod, SmartContractMethodRead, SmartContractMethodWrite } from './types';

export const getNativeCoinValue = (value: unknown) => {
  if (typeof value !== 'string') {
    return BigInt(0);
  }

  return BigInt(value);
};

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
      method_id: toFunctionSelector(method),
    };
  } catch (error) {
    return {
      ...method,
      is_invalid: true,
    };
  }
};

export const TYPE_FILTER_OPTIONS: Array<{ value: MethodType; title: string }> = [
  { value: 'all', title: 'All' },
  { value: 'read', title: 'Read' },
  { value: 'write', title: 'Write' },
];
