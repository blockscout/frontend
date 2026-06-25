import type { AllowanceType } from '../types';

import { describe, expect, it } from 'vitest';

import formatAllowance, { getAllowancePostfix } from './formatAllowance';

const approvalBase = {
  address: '0x1111111111111111111111111111111111111111',
  spender: '0x2222222222222222222222222222222222222222',
  transactionId: null,
  tokenReputation: null,
  timestamp: 1,
} satisfies Partial<AllowanceType>;

describe('formatAllowance', () => {
  it('shows token-specific ERC-721 approvals as token numbers', () => {
    const approval = {
      ...approvalBase,
      type: 'ERC-721',
      allowance: 'Unlimited',
      tokenId: '42',
    } as AllowanceType;

    expect(formatAllowance(approval)).toBe('Token #42');
    expect(getAllowancePostfix(approval, formatAllowance(approval))).toBeUndefined();
  });

  it('keeps collection-wide NFT approvals as unlimited', () => {
    const approval = {
      ...approvalBase,
      type: 'ERC-721',
      allowance: 'Unlimited',
    } as AllowanceType;

    expect(formatAllowance(approval)).toBe('Unlimited');
    expect(getAllowancePostfix(approval, formatAllowance(approval))).toBeUndefined();
  });

  it('keeps ERC-20 symbol postfixes for finite allowances', () => {
    const approval = {
      ...approvalBase,
      type: 'ERC-20',
      allowance: '12.345',
      symbol: 'UNI',
    } as AllowanceType;
    const formattedAllowance = formatAllowance(approval);

    expect(formattedAllowance).toBe('12.35');
    expect(getAllowancePostfix(approval, formattedAllowance)).toBe('UNI');
  });
});
