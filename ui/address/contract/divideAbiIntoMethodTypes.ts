import type { Abi } from 'abitype';
import { toFunctionSelector } from 'viem';

import type { SmartContractMethodRead, SmartContractMethodWrite } from './types';

interface Result {
  read: Array<SmartContractMethodRead>;
  write: Array<SmartContractMethodWrite>;
}

const isReadMethod = (method: Abi[number]): method is SmartContractMethodRead =>
  method.type === 'function' && (
    method.constant || method.stateMutability === 'view' || method.stateMutability === 'pure'
  );

const isWriteMethod = (method: Abi[number]): method is SmartContractMethodWrite =>
  (method.type === 'function' || method.type === 'fallback' || method.type === 'receive') &&
    !isReadMethod(method);

export default function divideAbiIntoMethodTypes(abi: Abi): Result {
  return {
    read: abi
      .filter(isReadMethod)
      .map((method) => ({
        ...method,
        method_id: toFunctionSelector(method).slice(2),
      })),
    write: abi
      .filter(isWriteMethod)
      .map((method) => {

        if (method.type !== 'function') {
          return method;
        }

        return {
          ...method,
          method_id: toFunctionSelector(method).slice(2),
        };
      }),
  };
}
