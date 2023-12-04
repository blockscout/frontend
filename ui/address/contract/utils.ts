import type { Abi } from 'abitype';

import type { SmartContractWriteMethod } from 'types/api/contract';

export const getNativeCoinValue = (value: string | Array<unknown>) => {
  const _value = Array.isArray(value) ? value[0] : value;

  if (typeof _value !== 'string') {
    return BigInt(0);
  }

  return BigInt(_value);
};

export const addZeroesAllowed = (valueType: string) => {
  if (valueType.includes('[')) {
    return false;
  }

  const REGEXP = /^u?int(\d+)/i;

  const match = valueType.match(REGEXP);
  const power = match?.[1];

  if (power) {
    // show control for all inputs which allows to insert 10^18 or greater numbers
    return Number(power) >= 64;
  }

  return false;
};

interface ExtendedError extends Error {
  detectedNetwork?: {
    chain: number;
    name: string;
  };
  reason?: string;
}

export function isExtendedError(error: unknown): error is ExtendedError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function prepareAbi(abi: Abi, item: SmartContractWriteMethod): Abi {
  if ('name' in item) {
    const hasMethodsWithSameName = abi.filter((abiItem) => 'name' in abiItem ? abiItem.name === item.name : false).length > 1;

    if (hasMethodsWithSameName) {
      return abi.filter((abiItem) => {
        if (!('name' in abiItem)) {
          return true;
        }

        if (abiItem.name !== item.name) {
          return true;
        }

        if (abiItem.inputs.length !== item.inputs.length) {
          return false;
        }

        return abiItem.inputs.every(({ name, type }) => {
          const itemInput = item.inputs.find((input) => input.name === name);
          return Boolean(itemInput) && itemInput?.type === type;
        });
      });
    }
  }

  return abi;
}
