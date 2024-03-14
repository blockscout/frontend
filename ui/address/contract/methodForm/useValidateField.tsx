import React from 'react';
import { getAddress, isAddress, isHex } from 'viem';

import type { SmartContractMethodArgType } from 'types/api/contract';

import type { MatchInt } from './useArgTypeMatchInt';
import { BYTES_REGEXP } from './utils';

interface Params {
  argType: SmartContractMethodArgType;
  argTypeMatchInt: MatchInt | null;
  isOptional: boolean;
}

export default function useValidateField({ isOptional, argType, argTypeMatchInt }: Params) {

  const bytesMatch = React.useMemo(() => {
    return argType.match(BYTES_REGEXP);
  }, [ argType ]);

  return React.useCallback((value: string | undefined) => {
    if (value === undefined || value === '') {
      return isOptional ? true : 'Field is required';
    }

    if (argType === 'address') {
      if (!isAddress(value)) {
        return 'Invalid address format';
      }

      // all lowercase addresses are valid
      const isInLowerCase = value === value.toLowerCase();
      if (isInLowerCase) {
        return true;
      }

      // check if address checksum is valid
      return getAddress(value) === value ? true : 'Invalid address checksum';
    }

    if (argTypeMatchInt) {
      const formattedValue = Number(value);

      if (Object.is(formattedValue, NaN)) {
        return 'Invalid integer format';
      }

      if (formattedValue > argTypeMatchInt.max || formattedValue < argTypeMatchInt.min) {
        const lowerBoundary = argTypeMatchInt.isUnsigned ? '0' : `-1 * 2 ^ ${ Number(argTypeMatchInt.power) - 1 }`;
        const upperBoundary = argTypeMatchInt.isUnsigned ? `2 ^ ${ argTypeMatchInt.power } - 1` : `2 ^ ${ Number(argTypeMatchInt.power) - 1 } - 1`;
        return `Value should be in range from "${ lowerBoundary }" to "${ upperBoundary }" inclusively`;
      }

      return true;
    }

    if (argType === 'bool') {
      if (value !== 'true' && value !== 'false') {
        return 'Invalid boolean format. Allowed values: true, false';
      }
    }

    if (bytesMatch) {
      const [ , length ] = bytesMatch;

      if (!isHex(value)) {
        return 'Invalid bytes format';
      }

      if (length) {
        const valueLengthInBytes = value.replace('0x', '').length / 2;
        return valueLengthInBytes !== Number(length) ? `Value should be ${ length } bytes in length` : true;
      }

      return true;
    }

    return true;
  }, [ isOptional, argType, argTypeMatchInt, bytesMatch ]);
}
