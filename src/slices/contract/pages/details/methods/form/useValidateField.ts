// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import { getAddress, isAddress, isHex } from 'viem';

import type { MatchInt } from './utils';
import { BYTES_REGEXP } from './utils';

interface Params {
  argType: string;
  argTypeMatchInt: MatchInt | null;
  isOptional: boolean;
}

type FieldValue = string | boolean;

type ValidationResult = true | string;

function validateAddress(value: FieldValue): ValidationResult {
  // Stryker disable next-line ConditionalExpression: the typeof check only narrows the type, isAddress already returns false for a boolean
  if (typeof value !== 'string' || !isAddress(value, { strict: false })) {
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

function parseBigInt(value: FieldValue): bigint | null {
  try {
    return BigInt(value);
  } catch (error) {
    return null;
  }
}

function getIntRangeError({ isUnsigned, power }: MatchInt): string {
  const lowerBoundary = isUnsigned ? '0' : `-1 * 2 ^ ${ Number(power) - 1 }`;
  const upperBoundary = isUnsigned ? `2 ^ ${ power } - 1` : `2 ^ ${ Number(power) - 1 } - 1`;
  return `Value should be in range from "${ lowerBoundary }" to "${ upperBoundary }" inclusively`;
}

function validateInt(value: FieldValue, argTypeMatchInt: MatchInt): ValidationResult {
  const valueBi = parseBigInt(value);

  if (typeof value !== 'string' || valueBi === null) {
    return 'Invalid integer format';
  }

  if (valueBi > argTypeMatchInt.max || valueBi < argTypeMatchInt.min) {
    return getIntRangeError(argTypeMatchInt);
  }

  return true;
}

function validateBytes(value: FieldValue, length: string | undefined): ValidationResult {
  if (!isHex(value)) {
    return 'Invalid bytes format';
  }

  if (!length) {
    return true;
  }

  const valueLengthInBytes = value.replace('0x', '').length / 2;
  return valueLengthInBytes !== Number(length) ? `Value should be ${ length } bytes in length` : true;
}

export default function useValidateField({ isOptional, argType, argTypeMatchInt }: Params) {

  const bytesMatch = React.useMemo(() => {
    return argType.match(BYTES_REGEXP);
  }, [ argType ]);

  // some values are formatted before they are sent to the validator
  // see ./useFormatFieldValue.tsx hook
  return React.useCallback((value: FieldValue | undefined): ValidationResult => {
    if (value === undefined || value === '') {
      return isOptional ? true : 'Field is required';
    }

    if (argType === 'address') {
      return validateAddress(value);
    }

    if (argTypeMatchInt) {
      return validateInt(value, argTypeMatchInt);
    }

    if (argType === 'bool' && typeof value !== 'boolean') {
      return 'Invalid boolean format. Allowed values: true, false';
    }

    if (bytesMatch) {
      return validateBytes(value, bytesMatch[1]);
    }

    return true;
  }, [ isOptional, argType, argTypeMatchInt, bytesMatch ]);
}
