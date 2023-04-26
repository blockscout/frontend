import BigNumber from 'bignumber.js';

import config from 'configs/app/config';

export const getNativeCoinValue = (value: string | Array<unknown>) => {
  const _value = Array.isArray(value) ? value[0] : value;

  if (typeof _value !== 'string') {
    return '0';
  }

  return BigNumber(_value).times(10 ** config.network.currency.decimals).toString();
};

export const addZeroesAllowed = (valueType: string) => {
  if (valueType.includes('[')) {
    return false;
  }

  const REGEXP = /u?int(\d+)/i;

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
