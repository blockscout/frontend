import type { schemas } from '@blockscout/api-types';

import * as txMock from 'src/slices/tx/mocks/list';

import { it, expect } from 'vitest';

import { findFundingTx } from './find-funding-tx';

const ADDRESS_HASH = '0x1000000000000000000000000000000000000001';
const FUNDER_HASH = '0x2000000000000000000000000000000000000002';

const buildTx = (overrides: Partial<schemas['Transaction']>): schemas['Transaction'] => ({
  ...txMock.base,
  status: 'ok',
  value: '1000',
  from: { ...txMock.base.from, hash: FUNDER_HASH },
  ...overrides,
});

it('picks the oldest successful incoming transaction that carries native coin', () => {
  const zeroValue = buildTx({ hash: '0x01', value: '0' });
  const firstFunding = buildTx({ hash: '0x02', value: '1' });
  const laterFunding = buildTx({ hash: '0x03', value: '5000' });

  expect(findFundingTx([ zeroValue, firstFunding, laterFunding ], ADDRESS_HASH)?.hash).toBe('0x02');
});

it('skips a failed transaction even when it carries value', () => {
  const failed = buildTx({ hash: '0x01', status: 'error' });
  const succeeded = buildTx({ hash: '0x02' });

  expect(findFundingTx([ failed, succeeded ], ADDRESS_HASH)?.hash).toBe('0x02');
});

it('skips a pending transaction', () => {
  const pending = buildTx({ hash: '0x01', status: null });

  expect(findFundingTx([ pending ], ADDRESS_HASH)).toBeUndefined();
});

it('skips a transfer the address sent to itself, regardless of hash casing', () => {
  const selfTransfer = buildTx({ hash: '0x01', from: { ...txMock.base.from, hash: ADDRESS_HASH.toUpperCase().replace('0X', '0x') } });
  const funding = buildTx({ hash: '0x02' });

  expect(findFundingTx([ selfTransfer, funding ], ADDRESS_HASH)?.hash).toBe('0x02');
});

it('returns undefined when no transaction carries native coin', () => {
  expect(findFundingTx([ buildTx({ value: '0' }), buildTx({ value: '0' }) ], ADDRESS_HASH)).toBeUndefined();
});

it('returns undefined for an empty list', () => {
  expect(findFundingTx([], ADDRESS_HASH)).toBeUndefined();
});

it('ignores a transaction with a malformed value', () => {
  expect(findFundingTx([ buildTx({ value: 'not-a-number' }) ], ADDRESS_HASH)).toBeUndefined();
});
