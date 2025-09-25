import type { PublicClient, GetLogsParameters, GetLogsReturnType } from 'viem';

export const getLogs = async(
  publicClient: PublicClient,
  baseFilter: GetLogsParameters,
  fromBlock: bigint,
  toBlock: bigint,
): Promise<GetLogsReturnType> => {
  const filter = { ...baseFilter, fromBlock, toBlock } as GetLogsParameters;

  try {
    return (await publicClient.getLogs(filter)) as GetLogsReturnType;
  } catch {
    const middle = fromBlock + (toBlock - fromBlock) / BigInt(2);
    const leftPromise = getLogs(publicClient, baseFilter, fromBlock, middle);
    const rightPromise = getLogs(
      publicClient,
      baseFilter,
      middle + BigInt(1),
      toBlock,
    );
    const [ left, right ] = await Promise.all([ leftPromise, rightPromise ]);
    return [ ...left, ...right ];
  }
};

export async function getApprovalEvents(
  filter: GetLogsParameters,
  publicClient: PublicClient,
) {
  const latestBlockNumber = await publicClient.getBlockNumber();

  return getLogs(publicClient, filter, BigInt(0), latestBlockNumber);
}
