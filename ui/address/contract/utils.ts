import BigNumber from 'bignumber.js';

import config from 'configs/app/config';

export const getNativeCoinValue = (value: string | Array<string>) => {
  const _value = Array.isArray(value) ? value[0] : value;
  return BigNumber(_value).times(10 ** config.network.currency.decimals).toString();
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
