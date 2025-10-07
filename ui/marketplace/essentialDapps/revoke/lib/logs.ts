import type { PublicClient, GetLogsParameters, GetLogsReturnType } from 'viem';

export const getLogs = async(
  publicClient: PublicClient,
  baseFilter: GetLogsParameters,
  fromBlock: bigint,
  toBlock: bigint,
  options?: { signal?: AbortSignal },
): Promise<GetLogsReturnType> => {
  const filter = { ...baseFilter, fromBlock, toBlock } as GetLogsParameters;

  if (options?.signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  try {
    return (await publicClient.getLogs(filter)) as GetLogsReturnType;
  } catch {
    const middle = fromBlock + (toBlock - fromBlock) / BigInt(2);
    const leftPromise = getLogs(publicClient, baseFilter, fromBlock, middle, options);
    const rightPromise = getLogs(publicClient, baseFilter, middle + BigInt(1), toBlock, options);
    const [ left, right ] = await Promise.all([ leftPromise, rightPromise ]);
    return [ ...left, ...right ];
  }
};

export async function getApprovalEvents(
  filter: GetLogsParameters,
  publicClient: PublicClient,
  options?: { signal?: AbortSignal },
) {
  if (options?.signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }
  const latestBlockNumber = await publicClient.getBlockNumber();

  return getLogs(publicClient, filter, BigInt(0), latestBlockNumber, options);
}
