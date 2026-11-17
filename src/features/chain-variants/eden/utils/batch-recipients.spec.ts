// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

import { describe, it, expect } from 'vitest';

import { getBatchRecipients, MAX_VISIBLE_RECIPIENTS } from './batch-recipients';

type TransactionEdenCall = NonNullable<schemas['TransactionResponse']['calls']>[number];

const REPEATED_ADDRESS = '0x0000000000000000000000000000000000000001';

const makeCall = (to: string | null): TransactionEdenCall => ({
  to,
  value: '0',
  input: '0x',
});

const makeCalls = (count: number): Array<TransactionEdenCall> =>
  Array.from({ length: count }, (_, index) => makeCall(`0x${ String(index).padStart(40, '0') }`));

describe('getBatchRecipients', () => {
  describe('count', () => {
    it('equals the number of distinct recipient addresses', () => {
      expect(getBatchRecipients(makeCalls(3)).count).toBe(3);
    });

    it('de-duplicates repeated recipient addresses', () => {
      const calls = [ makeCall(REPEATED_ADDRESS), makeCall(REPEATED_ADDRESS), makeCall(REPEATED_ADDRESS) ];
      expect(getBatchRecipients(calls).count).toBe(1);
    });

    it('counts only the distinct addresses in a mixed batch', () => {
      const calls = [ makeCall(REPEATED_ADDRESS), makeCall('0x00000000000000000000000000000000000000ab'), makeCall(REPEATED_ADDRESS) ];
      expect(getBatchRecipients(calls).count).toBe(2);
    });

    it('is 0 when calls is undefined', () => {
      expect(getBatchRecipients(undefined).count).toBe(0);
    });

    it('excludes contract-creation calls (null recipient) from the count', () => {
      const calls = [ makeCall(REPEATED_ADDRESS), makeCall(null), makeCall(null) ];
      expect(getBatchRecipients(calls).count).toBe(1);
    });
  });

  describe('hasMultipleRecipients', () => {
    it('is false for undefined, empty, and single-call batches', () => {
      expect(getBatchRecipients(undefined).hasMultipleRecipients).toBe(false);
      expect(getBatchRecipients([]).hasMultipleRecipients).toBe(false);
      expect(getBatchRecipients(makeCalls(1)).hasMultipleRecipients).toBe(false);
    });

    it('is true once there is more than one distinct recipient', () => {
      expect(getBatchRecipients(makeCalls(2)).hasMultipleRecipients).toBe(true);
    });

    it('is false for a multi-call batch when every call hits the same address', () => {
      const calls = [ makeCall(REPEATED_ADDRESS), makeCall(REPEATED_ADDRESS) ];
      expect(getBatchRecipients(calls).hasMultipleRecipients).toBe(false);
    });
  });

  describe('visibleRecipients', () => {
    it('drops duplicate recipients, keeping the first occurrence of each', () => {
      const other = '0x00000000000000000000000000000000000000ab';
      const calls = [ makeCall(REPEATED_ADDRESS), makeCall(other), makeCall(REPEATED_ADDRESS) ];
      expect(getBatchRecipients(calls).visibleRecipients.map((call) => call.to)).toEqual([ REPEATED_ADDRESS, other ]);
    });

    it('returns every recipient when the distinct count is at or below the cap', () => {
      const calls = makeCalls(MAX_VISIBLE_RECIPIENTS);
      expect(getBatchRecipients(calls).visibleRecipients).toHaveLength(MAX_VISIBLE_RECIPIENTS);
    });

    it('caps the visible list at MAX_VISIBLE_RECIPIENTS', () => {
      const calls = makeCalls(MAX_VISIBLE_RECIPIENTS + 3);
      expect(getBatchRecipients(calls).visibleRecipients).toHaveLength(MAX_VISIBLE_RECIPIENTS);
    });

    it('omits contract-creation calls (null recipient)', () => {
      const calls = [ makeCall(REPEATED_ADDRESS), makeCall(null) ];
      expect(getBatchRecipients(calls).visibleRecipients.map((call) => call.to)).toEqual([ REPEATED_ADDRESS ]);
    });
  });

  describe('hasOverflow', () => {
    it('is false when the distinct-recipient count fits within the cap', () => {
      expect(getBatchRecipients(makeCalls(MAX_VISIBLE_RECIPIENTS)).hasOverflow).toBe(false);
    });

    it('is true when the distinct-recipient count exceeds the cap', () => {
      expect(getBatchRecipients(makeCalls(MAX_VISIBLE_RECIPIENTS + 1)).hasOverflow).toBe(true);
    });
  });
});
