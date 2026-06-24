// SPDX-License-Identifier: LicenseRef-Blockscout

import { getAddress, slice } from 'viem';
import type { Log } from 'viem';

export function getApprovalSpender(approval: Log): `0x${ string }` {
  return getAddress(slice(approval.topics[2] as `0x${ string }`, 12));
}

export function getApprovalTokenId(approval: Log): string {
  return approval.topics.length === 4 ? approval.topics[3] as string : approval.data;
}

function isNewerLog(candidate: Log, current: Log): boolean {
  const candidateBlock = candidate.blockNumber ?? BigInt(0);
  const currentBlock = current.blockNumber ?? BigInt(0);

  if (candidateBlock !== currentBlock) {
    return candidateBlock > currentBlock;
  }

  return (candidate.logIndex ?? 0) > (current.logIndex ?? 0);
}

function getLatestLogsByIdentity(events: Array<Log>, getIdentity: (event: Log) => string): Array<Log> {
  const latestEvents = new Map<string, Log>();

  events.forEach((event) => {
    const identity = getIdentity(event);
    const current = latestEvents.get(identity);

    if (!current || isNewerLog(event, current)) {
      latestEvents.set(identity, event);
    }
  });

  return Array.from(latestEvents.values());
}

export function getLatestNftApprovalEvents(approvalEvents: Array<Log>, approvalForAllEvents: Array<Log>) {
  const nftApprovalEvents = approvalEvents.filter((ev) => ev.topics.length === 4);

  return {
    limitedApprovalEvents: getLatestLogsByIdentity(
      nftApprovalEvents,
      (event) => `${ getAddress(event.address) }:${ getApprovalTokenId(event) }`,
    ),
    unlimitedApprovalEvents: getLatestLogsByIdentity(
      approvalForAllEvents,
      (event) => `${ getAddress(event.address) }:${ getApprovalSpender(event) }`,
    ),
  };
}
