// SPDX-License-Identifier: LicenseRef-Blockscout

// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { renderHook } from 'vitest/lib';

import useValidateField from './useValidateField';
import { matchInt } from './utils';

const CHECKSUM_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

function getValidator(argType: string, isOptional = false) {
  const { result } = renderHook(() => useValidateField({ argType, argTypeMatchInt: matchInt(argType), isOptional }));
  return result.current;
}

describe('useValidateField', () => {
  describe('empty value', () => {
    it.each([ undefined, '' ])('rejects %j in a required field', (value) => {
      expect(getValidator('address')(value)).toBe('Field is required');
    });

    it.each([ undefined, '' ])('accepts %j in an optional field', (value) => {
      expect(getValidator('address', true)(value)).toBe(true);
    });

    it('treats false as a provided value', () => {
      expect(getValidator('bool')(false)).toBe(true);
    });
  });

  describe('address', () => {
    it('accepts a checksummed address', () => {
      expect(getValidator('address')(CHECKSUM_ADDRESS)).toBe(true);
    });

    it('accepts an all-lowercase address', () => {
      expect(getValidator('address')(CHECKSUM_ADDRESS.toLowerCase())).toBe(true);
    });

    it('rejects a mixed-case address with a wrong checksum', () => {
      expect(getValidator('address')(CHECKSUM_ADDRESS.replace('0xd8dA', '0xD8dA'))).toBe('Invalid address format');
    });

    it('rejects a string that is not an address', () => {
      expect(getValidator('address')('0x1234')).toBe('Invalid address format');
    });

    it('rejects a boolean', () => {
      expect(getValidator('address')(true)).toBe('Invalid address format');
    });
  });

  describe('integer', () => {
    it.each([
      [ 'uint8', '0' ],
      [ 'uint8', '255' ],
      [ 'int8', '-128' ],
      [ 'int8', '127' ],
      [ 'uint256', '0x10' ],
    ])('accepts %s value %s', (argType, value) => {
      expect(getValidator(argType)(value)).toBe(true);
    });

    it.each([ '256', '-1' ])('rejects out-of-range unsigned value %s', (value) => {
      expect(getValidator('uint8')(value)).toBe('Value should be in range from "0" to "2 ^ 8 - 1" inclusively');
    });

    it.each([ '128', '-129' ])('rejects out-of-range signed value %s', (value) => {
      expect(getValidator('int8')(value)).toBe('Value should be in range from "-1 * 2 ^ 7" to "2 ^ 7 - 1" inclusively');
    });

    it('uses 256 bits when the type has no size', () => {
      expect(getValidator('uint')('-1')).toBe('Value should be in range from "0" to "2 ^ 256 - 1" inclusively');
    });

    it.each([ 'abc', '1.5' ])('rejects non-integer string %s', (value) => {
      expect(getValidator('uint8')(value)).toBe('Invalid integer format');
    });

    it('rejects a boolean', () => {
      expect(getValidator('uint8')(true)).toBe('Invalid integer format');
    });
  });

  describe('bool', () => {
    it.each([ true, false ])('accepts %s', (value) => {
      expect(getValidator('bool')(value)).toBe(true);
    });

    it('rejects a string', () => {
      expect(getValidator('bool')('true')).toBe('Invalid boolean format. Allowed values: true, false');
    });
  });

  describe('bytes', () => {
    it('accepts a hex value of any length for dynamic bytes', () => {
      expect(getValidator('bytes')('0x1234ab')).toBe(true);
    });

    it('accepts a hex value of the exact fixed length', () => {
      expect(getValidator('bytes2')('0x12ab')).toBe(true);
    });

    it.each([ '0x12', '0x12ab34' ])('rejects fixed-length value %s of a wrong length', (value) => {
      expect(getValidator('bytes2')(value)).toBe('Value should be 2 bytes in length');
    });

    it('rejects a non-hex string', () => {
      expect(getValidator('bytes')('12ab')).toBe('Invalid bytes format');
    });

    it('rejects a boolean', () => {
      expect(getValidator('bytes2')(true)).toBe('Invalid bytes format');
    });
  });

  describe('other types', () => {
    it.each([ 'string', 'tuple' ])('accepts any non-empty value for %s', (argType) => {
      expect(getValidator(argType)('hello')).toBe(true);
    });
  });
});
