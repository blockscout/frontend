import type { AllowanceType } from '../types';

import { ZERO_ADDRESS } from 'src/toolkit/utils/consts';

import { describe, expect, it } from 'vitest';

import { getRevokeContractCall } from './revokeContractCall';

const approvalBase = {
  address: '0x1111111111111111111111111111111111111111',
  spender: '0x2222222222222222222222222222222222222222',
  transactionId: null,
  tokenReputation: null,
  timestamp: 1,
} satisfies Partial<AllowanceType>;

describe('getRevokeContractCall', () => {
  it('revokes limited NFT approvals via approve(ZERO_ADDRESS, tokenId)', () => {
    const result = getRevokeContractCall({
      ...approvalBase,
      type: 'ERC-721',
      tokenId: '42',
    } as AllowanceType);

    expect(result.functionName).toBe('approve');
    expect(result.args).toEqual([ ZERO_ADDRESS, BigInt(42) ]);
  });

  it('revokes unlimited NFT approvals via setApprovalForAll(spender, false)', () => {
    const result = getRevokeContractCall({
      ...approvalBase,
      type: 'ERC-721',
    } as AllowanceType);

    expect(result.functionName).toBe('setApprovalForAll');
    expect(result.args).toEqual([ approvalBase.spender, false ]);
  });
});
