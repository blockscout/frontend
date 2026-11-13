import type { schemas } from '@blockscout/api-types';

import * as addressMock from 'src/slices/address/mocks/address-param';

import { describe, it, expect } from 'vitest';

import { getFallbackSummary } from './get-fallback-summary';

const SENDER: schemas['Address'] = { ...addressMock.withoutName, hash: '0x047A81aFB05D9B1f8844bf60fcA05DCCFbC584B9' };
const CONTRACT = addressMock.contract;
const RECIPIENT = addressMock.withoutName;

const tx = (fields: Partial<schemas['TransactionResponse']>) => ({
  from: SENDER,
  to: RECIPIENT,
  created_contract: null,
  method: null,
  value: '0',
  ...fields,
});

describe('getFallbackSummary', () => {
  it('shows a call to a contract with the method name', () => {
    expect(getFallbackSummary(tx({ to: CONTRACT, method: 'approve' }), 18)).toEqual({
      type: 'call',
      method: 'approve',
      from: SENDER,
      to: CONTRACT,
    });
  });

  it('shows a call to a contract with the method selector as the API returns it', () => {
    expect(getFallbackSummary(tx({ to: CONTRACT, method: '0x6af5c17f' }), 18)).toMatchObject({ type: 'call', method: '0x6af5c17f' });
  });

  it('describes a call to a contract that has no method', () => {
    expect(getFallbackSummary(tx({ to: CONTRACT, method: null }), 18)).toMatchObject({ type: 'call', method: 'Executed a contract call' });
  });

  it('shows a call to a contract even when it carries a value', () => {
    expect(getFallbackSummary(tx({ to: CONTRACT, method: '0x6af5c17f', value: '8249689656745026' }), 18)).toMatchObject({ type: 'call' });
  });

  it('shows a transfer of the native coin to a non-contract, in coin units', () => {
    expect(getFallbackSummary(tx({ value: '1500000000000000000' }), 18)).toEqual({
      type: 'transfer',
      amount: '1.5',
      from: SENDER,
      to: RECIPIENT,
    });
  });

  it('shows a transfer of zero when a non-contract call carries no value', () => {
    expect(getFallbackSummary(tx({ value: '0' }), 18)).toMatchObject({ type: 'transfer', amount: '0' });
  });

  it('converts the value with the native coin decimals of the chain', () => {
    expect(getFallbackSummary(tx({ value: '1500000' }), 6)).toMatchObject({ type: 'transfer', amount: '1.5' });
  });

  it('keeps the full precision of the value', () => {
    expect(getFallbackSummary(tx({ value: '1' }), 18)).toMatchObject({ amount: '0.000000000000000001' });
  });

  it('sends the transfer of a contract creation to the created contract', () => {
    expect(getFallbackSummary(tx({ to: null, created_contract: CONTRACT }), 18)).toMatchObject({ type: 'transfer', to: CONTRACT });
  });

  it('shows a transfer without a recipient when a contract creation has no contract yet', () => {
    expect(getFallbackSummary(tx({ to: null, created_contract: null }), 18)).toMatchObject({ type: 'transfer', to: null });
  });
});
