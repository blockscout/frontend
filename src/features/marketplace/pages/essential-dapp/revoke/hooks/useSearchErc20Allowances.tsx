// SPDX-License-Identifier: LicenseRef-Blockscout

import ERC20Artifact from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { useCallback } from 'react';
import { getAddress, slice } from 'viem';
import type { Log, PublicClient } from 'viem';

import type { BaseAllowanceType } from '../types';

import { shouldKeepErc20Allowance } from '../lib/allowance';
import type { TokenBalanceInfo } from '../lib/erc20ValueAtRisk';
import { getValueAtRiskUsd } from '../lib/erc20ValueAtRisk';
import { shouldRethrowLocalError } from '../lib/errors';

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }
}

function getApprovalSpender(approval: Log): `0x${ string }` {
  return getAddress(slice(approval.topics[2] as `0x${ string }`, 12));
}

function getApprovalIdentity(approval: Log): string {
  return `${ getAddress(approval.address) }:${ getApprovalSpender(approval) }`;
}

function isNewerLog(candidate: Log, current: Log): boolean {
  const candidateBlock = candidate.blockNumber ?? BigInt(0);
  const currentBlock = current.blockNumber ?? BigInt(0);

  if (candidateBlock !== currentBlock) {
    return candidateBlock > currentBlock;
  }

  return (candidate.logIndex ?? 0) > (current.logIndex ?? 0);
}

export function getLatestErc20ApprovalEvents(approvalEvents: Array<Log>) {
  const latestApprovals = new Map<string, Log>();

  approvalEvents.forEach((approval) => {
    const identity = getApprovalIdentity(approval);
    const current = latestApprovals.get(identity);

    if (!current || isNewerLog(approval, current)) {
      latestApprovals.set(identity, approval);
    }
  });

  return Array.from(latestApprovals.values());
}

export default function useSearchErc20Allowances() {
  return useCallback(async(
    ownerAddress: string,
    approvalEvents: Array<Log>,
    tokenBalancesPromise: Promise<Map<`0x${ string }`, TokenBalanceInfo>>,
    publicClient: PublicClient,
    signal?: AbortSignal,
  ): Promise<Array<BaseAllowanceType>> => {
    throwIfAborted(signal);

    const erc20Events = approvalEvents.filter((ev) => ev.topics.length === 3);
    const latestApprovalEvents = getLatestErc20ApprovalEvents(erc20Events);

    const recordsPromise: Promise<Array<BaseAllowanceType | undefined>> = Promise.all(latestApprovalEvents.map(async(approval) => {
      throwIfAborted(signal);

      const tokenAddress = getAddress(approval.address);
      const spender = getApprovalSpender(approval);

      try {
        const allowance = await publicClient.readContract({
          address: tokenAddress,
          abi: ERC20Artifact.abi,
          functionName: 'allowance',
          args: [ ownerAddress, spender ],
        }) as bigint | undefined;

        if (!shouldKeepErc20Allowance(allowance)) {
          return undefined;
        }

        const record: BaseAllowanceType = {
          type: 'ERC-20',
          address: tokenAddress,
          transactionId: approval.transactionHash,
          spender,
          allowance,
          blockNumber: approval.blockNumber as bigint,
        };

        return record;
      } catch (error) {
        if (shouldRethrowLocalError(error)) {
          throw error;
        }

        return undefined;
      }
    }));

    const [ records, tokenBalances ] = await Promise.all([ recordsPromise, tokenBalancesPromise ]);

    return records
      .filter((record): record is BaseAllowanceType => Boolean(record))
      .map((record) => {
        const tokenInfo = tokenBalances.get(record.address);

        return {
          ...record,
          ...tokenInfo,
          valueAtRiskUsd: getValueAtRiskUsd(record.allowance as bigint, tokenInfo),
        };
      });
  }, []);
}
