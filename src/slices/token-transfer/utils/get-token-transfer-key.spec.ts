// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

import { describe, expect, it } from 'vitest';

import { erc1155A, erc1155B, erc1155C, erc1155D, erc20 } from '../mocks';
import { getTokenTransferKey } from './get-token-transfer-key';

describe('getTokenTransferKey', () => {
  it('tells apart the items of a single ERC-1155 batch transfer', () => {
    const batch = [ erc1155A, erc1155B, erc1155C, erc1155D ];

    expect(new Set(batch.map((item) => getTokenTransferKey(item, undefined))).size).toBe(4);
  });

  it('tells apart transfers from the same block that differ only in log index', () => {
    const first = getTokenTransferKey(erc1155A, undefined);
    const second = getTokenTransferKey({ ...erc1155A, log_index: erc1155A.log_index + 1 }, undefined);

    expect(first).not.toBe(second);
  });

  it('tells apart transfers that carry no token id', () => {
    const fungible = getTokenTransferKey(erc20, undefined);

    expect(fungible).not.toBe(getTokenTransferKey({ ...erc20, transaction_hash: '0xdeadbeef' }, undefined));
    expect(fungible).not.toBe(getTokenTransferKey(erc1155A, undefined));
  });

  it('keys a transfer without a total like one whose total has no token id', () => {
    const withoutTotal = { ...erc20, total: null } as unknown as schemas['TokenTransfer'];

    expect(getTokenTransferKey(withoutTotal, undefined)).toBe(getTokenTransferKey(erc20, undefined));
  });

  it('tells apart the same transfer on different chains', () => {
    expect(getTokenTransferKey(erc20, '1')).not.toBe(getTokenTransferKey(erc20, '10'));
  });
});
