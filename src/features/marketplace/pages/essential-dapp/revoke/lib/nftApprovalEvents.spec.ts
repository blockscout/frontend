import type { Log } from 'viem';

import { describe, expect, it } from 'vitest';

import { getLatestNftApprovalEvents } from './nftApprovalEvents';

const tokenAddress = '0x1111111111111111111111111111111111111111';
const otherTokenAddress = '0x2222222222222222222222222222222222222222';
const operatorAddress = '0x3333333333333333333333333333333333333333';
const ownerTopic = '0x000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

function addressTopic(address: string): `0x${ string }` {
  return `0x${ address.slice(2).padStart(64, '0') }`;
}

function tokenIdTopic(tokenId: number): `0x${ string }` {
  return `0x${ tokenId.toString(16).padStart(64, '0') }`;
}

function txHash(id: number): `0x${ string }` {
  return tokenIdTopic(id);
}

function log(params: Pick<Log, 'address' | 'topics' | 'blockNumber' | 'logIndex' | 'transactionHash'>): Log {
  return params as Log;
}

describe('getLatestNftApprovalEvents', () => {
  it('dedupes limited and unlimited NFT approvals by the latest event', () => {
    const erc20Approval = log({
      address: tokenAddress,
      topics: [ tokenIdTopic(100), ownerTopic, addressTopic(operatorAddress) ],
      blockNumber: BigInt(10),
      logIndex: 0,
      transactionHash: txHash(1),
    });
    const olderLimitedApproval = log({
      address: tokenAddress,
      topics: [ tokenIdTopic(100), ownerTopic, addressTopic(operatorAddress), tokenIdTopic(1) ],
      blockNumber: BigInt(11),
      logIndex: 0,
      transactionHash: txHash(2),
    });
    const latestLimitedApproval = log({
      address: tokenAddress,
      topics: [ tokenIdTopic(100), ownerTopic, addressTopic(operatorAddress), tokenIdTopic(1) ],
      blockNumber: BigInt(12),
      logIndex: 0,
      transactionHash: txHash(3),
    });
    const otherLimitedApproval = log({
      address: otherTokenAddress,
      topics: [ tokenIdTopic(100), ownerTopic, addressTopic(operatorAddress), tokenIdTopic(2) ],
      blockNumber: BigInt(9),
      logIndex: 0,
      transactionHash: txHash(4),
    });
    const olderUnlimitedApproval = log({
      address: tokenAddress,
      topics: [ tokenIdTopic(200), ownerTopic, addressTopic(operatorAddress) ],
      blockNumber: BigInt(13),
      logIndex: 0,
      transactionHash: txHash(5),
    });
    const latestUnlimitedApproval = log({
      address: tokenAddress,
      topics: [ tokenIdTopic(200), ownerTopic, addressTopic(operatorAddress) ],
      blockNumber: BigInt(13),
      logIndex: 1,
      transactionHash: txHash(6),
    });

    const result = getLatestNftApprovalEvents(
      [ erc20Approval, olderLimitedApproval, latestLimitedApproval, otherLimitedApproval ],
      [ olderUnlimitedApproval, latestUnlimitedApproval ],
    );

    expect(result.limitedApprovalEvents.map((event) => event.transactionHash)).toEqual([ txHash(3), txHash(4) ]);
    expect(result.unlimitedApprovalEvents.map((event) => event.transactionHash)).toEqual([ txHash(6) ]);
  });
});
