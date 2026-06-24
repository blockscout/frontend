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

function log(params: Pick<Log, 'address' | 'topics' | 'blockNumber' | 'logIndex' | 'transactionHash'>): Log {
  return params as Log;
}

describe('getLatestNftApprovalEvents', () => {
  it('dedupes limited and unlimited NFT approvals by the latest event', () => {
    const erc20Approval = log({
      address: tokenAddress,
      topics: [ '0xapproval', ownerTopic, addressTopic(operatorAddress) ],
      blockNumber: BigInt(10),
      logIndex: 0,
      transactionHash: '0xerc20',
    });
    const olderLimitedApproval = log({
      address: tokenAddress,
      topics: [ '0xapproval', ownerTopic, addressTopic(operatorAddress), tokenIdTopic(1) ],
      blockNumber: BigInt(11),
      logIndex: 0,
      transactionHash: '0xolderlimited',
    });
    const latestLimitedApproval = log({
      address: tokenAddress,
      topics: [ '0xapproval', ownerTopic, addressTopic(operatorAddress), tokenIdTopic(1) ],
      blockNumber: BigInt(12),
      logIndex: 0,
      transactionHash: '0xlatestlimited',
    });
    const otherLimitedApproval = log({
      address: otherTokenAddress,
      topics: [ '0xapproval', ownerTopic, addressTopic(operatorAddress), tokenIdTopic(2) ],
      blockNumber: BigInt(9),
      logIndex: 0,
      transactionHash: '0xotherlimited',
    });
    const olderUnlimitedApproval = log({
      address: tokenAddress,
      topics: [ '0xapprovalforall', ownerTopic, addressTopic(operatorAddress) ],
      blockNumber: BigInt(13),
      logIndex: 0,
      transactionHash: '0xolderunlimited',
    });
    const latestUnlimitedApproval = log({
      address: tokenAddress,
      topics: [ '0xapprovalforall', ownerTopic, addressTopic(operatorAddress) ],
      blockNumber: BigInt(13),
      logIndex: 1,
      transactionHash: '0xlatestunlimited',
    });

    const result = getLatestNftApprovalEvents(
      [ erc20Approval, olderLimitedApproval, latestLimitedApproval, otherLimitedApproval ],
      [ olderUnlimitedApproval, latestUnlimitedApproval ],
    );

    expect(result.limitedApprovalEvents.map((event) => event.transactionHash)).toEqual([ '0xlatestlimited', '0xotherlimited' ]);
    expect(result.unlimitedApprovalEvents.map((event) => event.transactionHash)).toEqual([ '0xlatestunlimited' ]);
  });
});
