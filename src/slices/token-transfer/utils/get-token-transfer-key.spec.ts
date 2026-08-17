// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { erc1155A, erc1155B, erc1155C, erc1155D, erc20 } from '../mocks';
import { getTokenTransferKey } from './get-token-transfer-key';

describe('getTokenTransferKey', () => {
  it('tells apart the items of a single ERC-1155 batch transfer', () => {
    const batch = [ erc1155A, erc1155B, erc1155C, erc1155D ];

    expect(new Set(batch.map(getTokenTransferKey)).size).toBe(4);
  });

  it('tells apart transfers from the same block that differ only in log index', () => {
    const first = getTokenTransferKey(erc1155A);
    const second = getTokenTransferKey({ ...erc1155A, log_index: erc1155A.log_index + 1 });

    expect(first).not.toBe(second);
  });

  it('tells apart transfers that carry no token id', () => {
    const fungible = getTokenTransferKey(erc20);

    expect(fungible).not.toBe(getTokenTransferKey({ ...erc20, transaction_hash: '0xdeadbeef' }));
    expect(fungible).not.toBe(getTokenTransferKey(erc1155A));
  });
});
