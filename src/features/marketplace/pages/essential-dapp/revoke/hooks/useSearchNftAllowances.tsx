// SPDX-License-Identifier: LicenseRef-Blockscout

import NftArtifact from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { useCallback } from 'react';
import { getAddress } from 'viem';
import type { PublicClient, Log } from 'viem';

import type { BaseAllowanceType } from '../types';

import { ZERO_ADDRESS } from 'src/toolkit/utils/consts';

import { PUBLIC_RPC_BATCH_SIZE } from '../constants';
import { shouldRethrowLocalError } from '../lib/errors';
import { getApprovalSpender, getApprovalTokenId, getLatestNftApprovalEvents } from '../lib/nftApprovalEvents';
import runParallelBatches from '../lib/runParallelBatches';

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }
}

async function getLimitedNftRecord(
  approval: Log,
  publicClient: PublicClient,
  signal?: AbortSignal,
): Promise<BaseAllowanceType | undefined> {
  throwIfAborted(signal);

  const tokenAddress = getAddress(approval.address);
  const tokenId = getApprovalTokenId(approval);

  try {
    const spender = await publicClient.readContract({
      address: tokenAddress,
      abi: NftArtifact.abi,
      functionName: 'getApproved',
      args: [ tokenId ],
    }) as `0x${ string }`;

    if (spender === ZERO_ADDRESS) return undefined;

    return {
      type: 'ERC-721',
      allowance: BigInt(-1),
      address: tokenAddress,
      transactionId: approval.transactionHash,
      spender,
      tokenId,
      blockNumber: approval.blockNumber as bigint,
    };
  } catch (error) {
    if (shouldRethrowLocalError(error)) {
      throw error;
    }

    return undefined;
  }
}

async function getUnlimitedNftRecord(
  ownerAddress: string,
  approval: Log,
  publicClient: PublicClient,
  signal?: AbortSignal,
): Promise<BaseAllowanceType | undefined> {
  throwIfAborted(signal);

  const tokenAddress = getAddress(approval.address);
  const spender = getApprovalSpender(approval);

  try {
    const isApprovedForAll = await publicClient.readContract({
      address: tokenAddress,
      abi: NftArtifact.abi,
      functionName: 'isApprovedForAll',
      args: [ ownerAddress, spender ],
    });

    if (!isApprovedForAll) return undefined;

    return {
      type: 'ERC-721',
      allowance: BigInt(-1),
      address: tokenAddress,
      transactionId: approval.transactionHash,
      spender,
      blockNumber: approval.blockNumber as bigint,
    };
  } catch (error) {
    if (shouldRethrowLocalError(error)) {
      throw error;
    }

    return undefined;
  }
}

export default function useSearchNftAllowances() {
  return useCallback(async(
    ownerAddress: string,
    approvalEvents: Array<Log>,
    approvalForAllEvents: Array<Log>,
    publicClient: PublicClient,
    signal?: AbortSignal,
  ): Promise<Array<BaseAllowanceType>> => {
    throwIfAborted(signal);

    const { limitedApprovalEvents, unlimitedApprovalEvents } = getLatestNftApprovalEvents(approvalEvents, approvalForAllEvents);

    const [ limitedRecords, unlimitedRecords ] = await Promise.all([
      runParallelBatches(
        limitedApprovalEvents,
        PUBLIC_RPC_BATCH_SIZE,
        (approval) => getLimitedNftRecord(approval, publicClient, signal),
      ),
      runParallelBatches(
        unlimitedApprovalEvents,
        PUBLIC_RPC_BATCH_SIZE,
        (approval) => getUnlimitedNftRecord(ownerAddress, approval, publicClient, signal),
      ),
    ]);

    return [ ...limitedRecords, ...unlimitedRecords ]
      .filter((record): record is BaseAllowanceType => Boolean(record));
  }, []);
}
