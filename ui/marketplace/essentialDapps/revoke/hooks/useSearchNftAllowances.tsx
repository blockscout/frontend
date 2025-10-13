import NftArtifact from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { useCallback } from 'react';
import { getAbiItem, getAddress, slice, encodeEventTopics } from 'viem';
import type { PublicClient, GetLogsParameters, Log } from 'viem';

import type { TokenInfo } from 'types/api/token';
import type { AllowanceType, ContractAllowanceType } from 'types/client/revoke';
import type { ChainConfig } from 'types/multichain';

import useApiFetch from 'lib/api/useApiFetch';
import { ZERO_ADDRESS } from 'toolkit/utils/consts';

import OpenSeaRegistryAbi from '../lib/abis/OpenSeaRegistry.json';
import getLogs from '../lib/getLogs';
import useGetBlockTimestamp from './useGetBlockTimestamp';

const OPENSEA_REGISTRY_ADDRESS = '0xa5409ec958C83C3f309868babACA7c86DCB077c1';
const MOONBIRDS_ADDRESS = '0x23581767a106ae21c074b2276D25e5C3e136a68b';

async function getLimitedNftAllowancesFromApprovals(
  tokenAddress: `0x${ string }`,
  approvals: Array<Log>,
  publicClient: PublicClient,
) {
  const deduplicatedApprovals = approvals.filter(
    (approval, i) =>
      i ===
      approvals.findIndex((other) => approval.topics[2] === other.topics[2]),
  );

  const allowances: Array<ContractAllowanceType | undefined> = await Promise.all(
    deduplicatedApprovals.map((approval) =>
      getLimitedNftAllowanceFromApproval(tokenAddress, approval, publicClient),
    ),
  );

  return allowances;
}

async function getLimitedNftAllowanceFromApproval(
  tokenAddress: `0x${ string }`,
  approval: Log,
  publicClient: PublicClient,
) {
  try {
    // Some contracts (like CryptoStrikers) may not implement Nft correctly
    // by making tokenId a non-indexed parameter, in which case it needs to be
    // taken from the event data rather than topics
    const tokenId =
      approval.topics.length === 4 ? approval.topics[3] : approval.data;

    const spender = (await publicClient.readContract({
      address: tokenAddress,
      abi: NftArtifact.abi,
      functionName: 'getApproved',
      args: [ tokenId ],
    })) as `0x${ string }`;
    if (spender === ZERO_ADDRESS) return undefined;

    return {
      spender,
      transactionId: approval.transactionHash,
      allowance: BigInt(-1),
      tokenId,
      blockNumber: approval.blockNumber as bigint,
    };
  } catch {
    return undefined;
  }
}

async function getNftUnlimitedAllowancesFromApprovals(
  tokenAddress: `0x${ string }`,
  ownerAddress: string,
  approvals: Array<Log>,
  publicClient: PublicClient,
) {
  const deduplicatedApprovals = approvals.filter(
    (approval, i) =>
      i ===
      approvals.findIndex((other) => approval.topics[2] === other.topics[2]),
  );

  const allowances: Array<ContractAllowanceType | undefined> = await Promise.all(
    deduplicatedApprovals.map((approval) =>
      getNftUnlimitedAllowanceFromApproval(
        tokenAddress,
        ownerAddress,
        approval,
        publicClient,
      ),
    ),
  );

  return allowances;
}

async function getNftUnlimitedAllowanceFromApproval(
  tokenAddress: `0x${ string }`,
  ownerAddress: string,
  approval: Log,
  publicClient: PublicClient,
): Promise<ContractAllowanceType | undefined> {
  const spender = getAddress(slice(approval.topics[2] as `0x${ string }`, 12));

  const isApprovedForAll = await publicClient.readContract({
    address: tokenAddress,
    abi: NftArtifact.abi,
    functionName: 'isApprovedForAll',
    args: [ ownerAddress, spender ],
  });
  if (!isApprovedForAll) return undefined;

  return {
    spender,
    transactionId: approval.transactionHash,
    allowance: isApprovedForAll && BigInt(-1),
    blockNumber: approval.blockNumber as bigint,
  };
}

async function getOpenSeaProxyAddress(
  userAddress: string,
  publicClient: PublicClient,
): Promise<string | undefined> {
  try {
    const proxyAddress = await publicClient.readContract({
      address: OPENSEA_REGISTRY_ADDRESS,
      abi: OpenSeaRegistryAbi,
      functionName: 'proxies',
      args: [ userAddress ],
    });
    if (!proxyAddress || proxyAddress === ZERO_ADDRESS) return undefined;

    return proxyAddress as string;
  } catch {
    return undefined;
  }
}

// This function is a hardcoded patch to show Moonbirds' OpenSea allowances,
// which do not show up normally because of a bug in their contract
function generatePatchedAllowanceEvents(
  userAddress: string,
  openseaProxyAddress?: string,
  allEvents: Array<Log> = [],
): Array<Log> {
  if (!userAddress || !openseaProxyAddress) return [];
  // Only add the Moonbirds approval event if the account has interacted with Moonbirds at all
  if (!allEvents.some((ev) => ev.address === MOONBIRDS_ADDRESS)) return [];

  const prefix = '0x';

  const baseDummyEventLog = {
    blockNumber: 0,
    blockHash: prefix,
    transactionIndex: 0,
    removed: false,
    data: prefix,
    transactionHash: prefix,
    logIndex: 0,
  };

  return [
    {
      ...baseDummyEventLog,
      address: MOONBIRDS_ADDRESS,
      topics: encodeEventTopics({
        abi: NftArtifact.abi,
        eventName: 'ApprovalForAll',
        args: {
          owner: userAddress,
          operator: openseaProxyAddress,
        },
      }),
    } as unknown as Log,
  ];
}

function useGetNftAllowances() {
  const apiFetch = useApiFetch();
  const getBlockTimestamp = useGetBlockTimestamp();

  return useCallback(async(
    tokenAddresses: Array<`0x${ string }`>,
    searchQuery: string,
    approvals: Array<Log>,
    approvalsForAll: Array<Log>,
    publicClient: PublicClient,
    chain: ChainConfig | undefined,
    signal?: AbortSignal,
  ) => {
    const allowances: Array<AllowanceType> = [];

    try {
      await Promise.all(
        tokenAddresses.map(async(tokenAddress) => {
          if (signal?.aborted) {
            throw new DOMException('Aborted', 'AbortError');
          }

          const tokenData = await apiFetch('general:token', {
            pathParams: { hash: tokenAddress },
            chain,
            fetchParams: {
              signal,
            },
          }) as TokenInfo;

          const tokenApprovals = approvals.filter(
            (approval) => getAddress(approval.address) === tokenAddress,
          );
          const tokenApprovalsForAll = approvalsForAll.filter(
            (approval) => getAddress(approval.address) === tokenAddress,
          );

          if (tokenApprovals.length > 0 || tokenApprovalsForAll.length > 0) {
            const unlimitedAllowances =
              await getNftUnlimitedAllowancesFromApprovals(
                tokenAddress,
                searchQuery,
                tokenApprovalsForAll,
                publicClient,
              );
            const limitedAllowances = await getLimitedNftAllowancesFromApprovals(
              tokenAddress,
              tokenApprovals,
              publicClient,
            );
            const allAllowances = [
              ...limitedAllowances,
              ...unlimitedAllowances,
            ].filter(
              (allowance): allowance is ContractAllowanceType =>
                allowance !== undefined,
            );

            return Promise.all(
              allAllowances.map(async(allowance) => {
                const timestampMs = await getBlockTimestamp(chain, allowance.blockNumber as bigint, signal);

                if (allowance?.allowance && allowance?.allowance !== BigInt(0)) {
                  allowances.push({
                    type: 'ERC-721',
                    allowance: allowance?.allowance === BigInt(-1) ? 'Unlimited' : allowance?.allowance.toString(),
                    address: tokenAddress,
                    name: tokenData.name || undefined,
                    symbol: tokenData.symbol || undefined,
                    tokenIcon: tokenData.icon_url || undefined,
                    transactionId: allowance?.transactionId,
                    timestamp: timestampMs,
                    spender: allowance?.spender,
                    tokenId: allowance?.tokenId,
                  });
                }
              }),
            );
          }

          return undefined;
        }),
      );
    } catch {
      return [];
    }

    return allowances;
  }, [ apiFetch, getBlockTimestamp ]);
}

export default function useSearchNftAllowances() {
  const getNftAllowances = useGetNftAllowances();

  return useCallback(async(
    chain: ChainConfig | undefined,
    searchQuery: string,
    approvalEvents: Array<Log>,
    publicClient: PublicClient,
    latestBlockNumber: bigint,
    signal?: AbortSignal,
  ) => {
    try {
      const transferEventsPromise = getLogs(
        publicClient,
        {
          event: getAbiItem({ abi: NftArtifact.abi, name: 'Transfer' }),
          args: { to: searchQuery },
        } as unknown as GetLogsParameters,
        BigInt(0),
        latestBlockNumber,
        signal,
      );

      const approvalForAllEventsPromise = getLogs(
        publicClient,
        {
          event: getAbiItem({ abi: NftArtifact.abi, name: 'ApprovalForAll' }),
          args: { owner: searchQuery },
        } as unknown as GetLogsParameters,
        BigInt(0),
        latestBlockNumber,
        signal,
      );

      const [ transferEvents, approvalForAllEvents ] = await Promise.all([
        transferEventsPromise,
        approvalForAllEventsPromise,
      ]);

      const nftApprovalEvents = approvalEvents.filter(
        (ev) => ev.topics.length === 4,
      );
      const nftTransferEvents = transferEvents.filter(
        (ev) => ev.topics.length === 4,
      );

      const openSeaProxy = await getOpenSeaProxyAddress(
        searchQuery,
        publicClient,
      );

      const patchedApprovalForAllEvents = [
        ...approvalForAllEvents,
        ...generatePatchedAllowanceEvents(searchQuery, openSeaProxy, [
          ...approvalEvents,
          ...approvalForAllEvents,
          ...transferEvents,
        ]),
      ];

      const nftEvents = [
        ...nftApprovalEvents,
        ...patchedApprovalForAllEvents,
        ...nftTransferEvents,
      ];

      const nftAddresses = nftEvents
        .filter(
          (event, i) =>
            i ===
            approvalEvents.findIndex((other) => event.address === other.address),
        )
        .map((event) => getAddress(event.address));

      return getNftAllowances(
        nftAddresses,
        searchQuery,
        nftApprovalEvents,
        patchedApprovalForAllEvents,
        publicClient,
        chain,
        signal,
      );
    } catch {
      return [];
    }
  }, [ getNftAllowances ]);
}
