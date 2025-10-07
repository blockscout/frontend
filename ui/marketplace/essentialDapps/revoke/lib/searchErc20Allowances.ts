import ERC20Artifact from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { uniq } from 'es-toolkit';
import { getAddress, formatUnits, slice } from 'viem';
import type { PublicClient, Log } from 'viem';

import type { AllowanceType, ContractAllowanceType } from './types';
import type { AddressTokenBalance } from 'types/api/address';
import type { TokenInfo } from 'types/api/token';

import essentialDappsChains from 'configs/essentialDappsChains';

import getBlockTimestamp from './getBlockTimestamp';

export default async function searchERC20Allowances(
  chainId: number,
  searchQuery: string,
  approvalEvents: Array<Log>,
  publicClient: PublicClient,
  signal?: AbortSignal,
) {
  const erc20Events = approvalEvents.filter((ev) => ev.topics.length === 3);

  const erc20Addresses = uniq(
    erc20Events.map((event) => getAddress(event.address)),
  );

  return getERC20Allowances(
    chainId,
    erc20Addresses,
    searchQuery,
    erc20Events,
    publicClient,
    signal,
  );
}

async function getERC20TokenData(
  tokenAddress: `0x${ string }`,
  chainId: number,
  signal?: AbortSignal,
) {
  try {
    const response = await fetch(
      `${ essentialDappsChains[chainId] }/api/v2/tokens/${ tokenAddress }`,
      { signal },
    );
    if (!response.ok) {
      return {};
    }

    const data = (await response.json()) as TokenInfo;

    return {
      symbol: data.symbol || undefined,
      decimals: data.decimals ? Number(data.decimals) : undefined,
      totalSupply: data.total_supply ? BigInt(data.total_supply) : undefined,
      name: data.name || undefined,
      tokenIcon: data.icon_url || undefined,
      price: data.exchange_rate || undefined,
      balance: undefined,
    };
  } catch {
    return undefined;
  }
}

async function getERC20Allowances(
  chainId: number,
  tokenAddresses: Array<`0x${ string }`>,
  searchQuery: string,
  approvals: Array<Log>,
  publicClient: PublicClient,
  signal?: AbortSignal,
) {
  const allowances: Array<AllowanceType> = [];
  let balances: Record<string, bigint> = {};

  const response = await fetch(
    `${ essentialDappsChains[chainId] }/api/v2/addresses/${ searchQuery }/token-balances`,
    { signal },
  );

  if (response.ok) {
    const data = (await response.json()) as Array<AddressTokenBalance>;

    balances = Object.fromEntries(
      data.map((entry) => [ entry.token.address_hash, BigInt(entry.value) ]),
    );
  }

  await Promise.all(
    tokenAddresses.map(async(tokenAddress) => {
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }
      const tokenData = await getERC20TokenData(tokenAddress, chainId, signal);

      if (tokenData) {
        const tokenApprovals = approvals.filter(
          (approval) => getAddress(approval.address) === tokenAddress,
        );

        if (tokenApprovals.length > 0) {
          const tokenAllowances = await getERC20AllowancesFromApprovals(
            tokenAddress,
            searchQuery,
            tokenApprovals,
            publicClient,
          );

          await Promise.all(
            tokenAllowances.map(async(allowance) => {
              if (signal?.aborted) {
                throw new DOMException('Aborted', 'AbortError');
              }
              const timestampMs = await getBlockTimestamp(chainId, allowance.blockNumber, signal);

              let valueAtRiskUsd;

              if (
                allowance.allowance &&
                balances[tokenAddress] &&
                tokenData.price &&
                tokenData.decimals
              ) {
                const valueAtRisk = allowance.allowance > balances[tokenAddress] ?
                  balances[tokenAddress] :
                  allowance.allowance;

                valueAtRiskUsd = Number(
                  (
                    parseFloat(formatUnits(valueAtRisk, tokenData.decimals)) *
                    parseFloat(tokenData.price)
                  ).toFixed(2),
                );
              }

              return (
                allowance.allowance &&
                allowance.allowance !== BigInt(0) &&
                allowances.push({
                  ...tokenData,
                  type: 'ERC-20',
                  address: tokenAddress,
                  transactionId: allowance.transactionId,
                  spender: allowance.spender,
                  timestamp: timestampMs,
                  allowance: allowance.allowance ?
                    formatAllowance(
                      allowance.allowance,
                      tokenData.decimals,
                      tokenData.totalSupply,
                    ) : undefined,
                  valueAtRiskUsd,
                })
              );
            }),
          );
        }
      }
    }),
  );

  return allowances;
}

function formatAllowance(
  allowance: bigint,
  decimals: number = 18,
  totalSupply: bigint | undefined,
): string {
  if (totalSupply && allowance > totalSupply) {
    return 'Unlimited';
  }

  return formatUnits(allowance, decimals);
}

async function getERC20AllowanceFromApproval(
  tokenAddress: `0x${ string }`,
  ownerAddress: string,
  approval: Log,
  publicClient: PublicClient,
): Promise<ContractAllowanceType> {
  const spender = getAddress(slice(approval.topics[2] as `0x${ string }`, 12));
  const allowance = await publicClient
    .readContract({
      address: tokenAddress,
      abi: ERC20Artifact.abi,
      functionName: 'allowance',
      args: [ ownerAddress, spender ],
    })
    .catch(() => undefined);

  return {
    transactionId: approval.transactionHash,
    spender,
    allowance: allowance as bigint | undefined,
    blockNumber: approval.blockNumber as bigint,
  };
}

async function getERC20AllowancesFromApprovals(
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

  const allowances: Array<ContractAllowanceType> = await Promise.all(
    deduplicatedApprovals.map((approval) =>
      getERC20AllowanceFromApproval(
        tokenAddress,
        ownerAddress,
        approval,
        publicClient,
      ),
    ),
  );

  return allowances;
}
