// SPDX-License-Identifier: LicenseRef-Blockscout

import ERC20Artifact from '@openzeppelin/contracts/build/contracts/ERC20.json';
import NftArtifact from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, getAbiItem, getAddress, isAddress } from 'viem';
import type { GetLogsParameters, PublicClient } from 'viem';
import { usePublicClient } from 'wagmi';

import type { AllowanceType, ApprovalsQueryData, BaseAllowanceType } from '../types';
import type { schemas } from '@blockscout/api-types';
import type { EssentialDappsChainConfig } from 'src/features/marketplace/types/client';

import useApiFetch from 'src/api/hooks/useApiFetch';

import { PUBLIC_RPC_BLOCK_BATCH_SIZE } from '../constants';
import { filterHiddenBaseAllowances, getApprovalHiddenKey, getPageBaseAllowances, getTotalValueAtRiskUsd } from '../lib/approvalKeys';
import createRevokeBlockscoutClient from '../lib/createRevokeBlockscoutClient';
import type { TokenBalanceInfo } from '../lib/erc20ValueAtRisk';
import { shouldRethrowLocalError, shouldRetryRevokeQuery } from '../lib/errors';
import getLogs from '../lib/getLogs';
import { retryOnHttp429 } from '../lib/retry';
import runParallelBatches from '../lib/runParallelBatches';
import { ALLOWANCES } from '../stubs';
import useGetBlockTimestamp from './useGetBlockTimestamp';
import useSearchErc20Allowances from './useSearchErc20Allowances';
import useSearchNftAllowances from './useSearchNftAllowances';

const PLACEHOLDER_DATA: ApprovalsQueryData = {
  items: ALLOWANCES,
  total: ALLOWANCES.length,
  totalValueAtRiskUsd: 0,
};

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }
}

function formatErc20Allowance(
  allowance: bigint,
  decimals: number = 18,
  totalSupply: bigint | undefined,
): string {
  if (totalSupply && allowance > totalSupply) {
    return 'Unlimited';
  }

  return formatUnits(allowance, decimals);
}

function formatRecordAllowance(record: BaseAllowanceType, decimals?: number, totalSupply?: bigint): string | undefined {
  if (!record.allowance) return undefined;

  if (record.type === 'ERC-20') {
    return formatErc20Allowance(record.allowance, decimals, totalSupply);
  }

  return record.allowance === BigInt(-1) ? 'Unlimited' : record.allowance.toString();
}

function sortBaseAllowances(records: Array<BaseAllowanceType>): Array<BaseAllowanceType> {
  return records.sort((a, b) => {
    const valueAtRiskDiff = (b.valueAtRiskUsd ?? 0) - (a.valueAtRiskUsd ?? 0);
    if (valueAtRiskDiff !== 0) return valueAtRiskDiff;

    const exchangeRateDiff = parseFloat(b.exchangeRate ?? '0') - parseFloat(a.exchangeRate ?? '0');
    if (exchangeRateDiff !== 0) return exchangeRateDiff;

    if (b.blockNumber < a.blockNumber) return -1;
    if (b.blockNumber > a.blockNumber) return 1;
    return 0;
  });
}

function getTokenBalanceInfo(response: Array<schemas['TokenBalance']>): Map<`0x${ string }`, TokenBalanceInfo> {
  const balances = new Map<`0x${ string }`, TokenBalanceInfo>();

  response.forEach((entry) => {
    if (!entry.token?.address_hash) return;

    const tokenAddress = getAddress(entry.token.address_hash as `0x${ string }`);

    balances.set(tokenAddress, {
      balance: entry.value ? BigInt(entry.value) : undefined,
      exchangeRate: entry.token.exchange_rate || undefined,
      decimals: entry.token.decimals === undefined || entry.token.decimals === null ? undefined : Number(entry.token.decimals),
      symbol: entry.token.symbol || undefined,
      name: entry.token.name || undefined,
      tokenIcon: entry.token.icon_url || undefined,
      tokenReputation: entry.token.reputation,
      totalSupply: entry.token.total_supply ? BigInt(entry.token.total_supply) : undefined,
    });
  });

  return balances;
}

async function getTokenBalances(
  apiFetch: ReturnType<typeof useApiFetch>,
  ownerAddress: string,
  chain: EssentialDappsChainConfig | undefined,
  signal?: AbortSignal,
): Promise<Map<`0x${ string }`, TokenBalanceInfo>> {
  const response = await retryOnHttp429(
    () => apiFetch('core:address_token_balances', {
      pathParams: { hash: ownerAddress },
      chain,
      fetchParams: {
        signal,
      },
    }) as Promise<Array<schemas['TokenBalance']>>,
    signal,
  );

  return getTokenBalanceInfo(response);
}

async function getTokenData(
  apiFetch: ReturnType<typeof useApiFetch>,
  tokenAddress: `0x${ string }`,
  chain: EssentialDappsChainConfig | undefined,
  signal?: AbortSignal,
): Promise<schemas['Token'] | undefined> {
  try {
    return await retryOnHttp429(
      () => apiFetch('core:token', {
        pathParams: { hash: tokenAddress },
        chain,
        fetchParams: {
          signal,
        },
      }) as Promise<schemas['Token']>,
      signal,
    );
  } catch (error) {
    if (shouldRethrowLocalError(error)) {
      throw error;
    }

    return undefined;
  }
}

function buildAllowance(record: BaseAllowanceType, tokenData: schemas['Token'] | undefined, timestamp: number): AllowanceType {
  const decimals = tokenData?.decimals ? Number(tokenData.decimals) : record.decimals;
  const totalSupply = tokenData?.total_supply ? BigInt(tokenData.total_supply) : record.totalSupply;

  return {
    type: record.type,
    address: record.address,
    transactionId: record.transactionId,
    tokenId: record.tokenId,
    tokenIcon: tokenData?.icon_url || record.tokenIcon,
    tokenReputation: tokenData?.reputation ?? record.tokenReputation ?? null,
    allowance: formatRecordAllowance(record, decimals, totalSupply),
    price: tokenData?.exchange_rate || record.exchangeRate,
    balance: record.balance?.toString(),
    valueAtRiskUsd: record.valueAtRiskUsd,
    decimals,
    spender: record.spender,
    symbol: tokenData?.symbol || record.symbol,
    name: tokenData?.name || record.name,
    totalSupply,
    timestamp,
  };
}

export default function useApprovalsQuery(chain: EssentialDappsChainConfig | undefined, userAddress: string, page: number) {
  const apiFetch = useApiFetch();
  const getBlockTimestamp = useGetBlockTimestamp();
  const searchErc20Allowances = useSearchErc20Allowances();
  const searchNftAllowances = useSearchNftAllowances();
  const [ hiddenApprovalKeys, setHiddenApprovalKeys ] = useState<Array<string>>([]);
  const chainId = chain?.id ? Number(chain.id) : undefined;
  const publicClient = usePublicClient({ chainId }) as PublicClient | undefined;

  const blockscoutClient = useMemo(
    () => createRevokeBlockscoutClient(chain?.id),
    [ chain?.id ],
  );

  const isQueryEnabled = Boolean(userAddress) && isAddress(userAddress) && Boolean(publicClient && blockscoutClient);
  const hiddenApprovalKeysKey = hiddenApprovalKeys.join(':');

  useEffect(() => {
    setHiddenApprovalKeys([]);
  }, [ chain?.id, userAddress ]);

  const hideApproval = useCallback((approval: AllowanceType) => {
    const key = getApprovalHiddenKey(approval);

    setHiddenApprovalKeys((prev) => prev.includes(key) ? prev : [ ...prev, key ]);
  }, []);

  const searchBaseAllowances = useCallback(async(signal?: AbortSignal): Promise<Array<BaseAllowanceType>> => {
    throwIfAborted(signal);

    if (!publicClient) {
      throw new Error('Public client not found');
    }

    if (!blockscoutClient) {
      throw new Error('Blockscout client not found');
    }

    const latestBlockNumber = await publicClient.getBlockNumber();

    const approvalFilter = {
      event: getAbiItem({ abi: ERC20Artifact.abi, name: 'Approval' }),
      args: { owner: userAddress },
    } as unknown as GetLogsParameters;

    const approvalForAllFilter = {
      event: getAbiItem({ abi: NftArtifact.abi, name: 'ApprovalForAll' }),
      args: { owner: userAddress },
    } as unknown as GetLogsParameters;

    const tokenBalancesPromise = getTokenBalances(apiFetch, userAddress, chain, signal);
    void tokenBalancesPromise.catch(() => undefined);

    const [ approvalEvents, approvalForAllEvents ] = await Promise.all([
      getLogs(blockscoutClient, approvalFilter, BigInt(0), latestBlockNumber, signal),
      getLogs(blockscoutClient, approvalForAllFilter, BigInt(0), latestBlockNumber, signal),
    ]);

    const [ erc20Allowances, nftAllowances ] = await Promise.all([
      searchErc20Allowances(userAddress, approvalEvents, tokenBalancesPromise, publicClient, signal),
      searchNftAllowances(userAddress, approvalEvents, approvalForAllEvents, publicClient, signal),
    ]);

    return sortBaseAllowances([ ...erc20Allowances, ...nftAllowances ]);
  }, [ apiFetch, blockscoutClient, chain, publicClient, searchErc20Allowances, searchNftAllowances, userAddress ]);

  const baseQuery = useQuery({
    queryKey: [ 'revoke:approvals:base', chain?.id, userAddress ],
    queryFn: ({ signal }) => searchBaseAllowances(signal),
    enabled: isQueryEnabled,
    retry: shouldRetryRevokeQuery,
    throwOnError: false,
  });

  const visibleBaseAllowances = useMemo(() => {
    return filterHiddenBaseAllowances(baseQuery.data ?? [], hiddenApprovalKeys);
  }, [ baseQuery.data, hiddenApprovalKeys ]);

  const enrichApprovals = useCallback(async(records: Array<BaseAllowanceType>, signal?: AbortSignal): Promise<ApprovalsQueryData> => {
    throwIfAborted(signal);

    const pageRecords = getPageBaseAllowances(records, page);
    const tokenDataPromise = Promise.all(
      pageRecords.map((record) => getTokenData(apiFetch, record.address, chain, signal)),
    );
    const timestampsPromise = runParallelBatches(
      pageRecords,
      PUBLIC_RPC_BLOCK_BATCH_SIZE,
      (record) => getBlockTimestamp(chain, publicClient, record.blockNumber, signal),
    );
    const [ tokenData, timestamps ] = await Promise.all([ tokenDataPromise, timestampsPromise ]);
    const items = pageRecords.map((record, index) => buildAllowance(record, tokenData[index], timestamps[index] as number));

    return {
      items,
      total: records.length,
      totalValueAtRiskUsd: getTotalValueAtRiskUsd(records),
    };
  }, [ apiFetch, chain, getBlockTimestamp, page, publicClient ]);

  const pageQuery = useQuery({
    queryKey: [ 'revoke:approvals:page', chain?.id, userAddress, page, baseQuery.dataUpdatedAt, hiddenApprovalKeysKey ],
    queryFn: ({ signal }) => enrichApprovals(visibleBaseAllowances, signal),
    enabled: isQueryEnabled && Boolean(baseQuery.data) && !baseQuery.isError,
    staleTime: Infinity,
    retry: shouldRetryRevokeQuery,
    throwOnError: false,
  });

  const data = useMemo<ApprovalsQueryData>(() => {
    if (pageQuery.data) {
      return pageQuery.data;
    }

    if (baseQuery.data) {
      return {
        items: PLACEHOLDER_DATA.items,
        total: visibleBaseAllowances.length,
        totalValueAtRiskUsd: getTotalValueAtRiskUsd(visibleBaseAllowances),
      };
    }

    return PLACEHOLDER_DATA;
  }, [ baseQuery.data, pageQuery.data, visibleBaseAllowances ]);

  return useMemo(() => ({
    ...pageQuery,
    data,
    hideApproval,
    error: baseQuery.error || pageQuery.error,
    isError: baseQuery.isError || pageQuery.isError,
    isFetching: baseQuery.isFetching || pageQuery.isFetching,
    isLoading: baseQuery.isLoading || pageQuery.isLoading,
    isPending: baseQuery.isPending || pageQuery.isPending,
    isPlaceholderData: baseQuery.isLoading || pageQuery.isLoading || !pageQuery.data,
  }), [ baseQuery, data, hideApproval, pageQuery ]);
}
