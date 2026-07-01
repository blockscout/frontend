import type { GetLogsParameters, Log, PublicClient } from 'viem';

import { describe, expect, it, vi } from 'vitest';

import getLogs from './getLogs';

const filter = {} as GetLogsParameters;

function getClient(getLogsMock: ReturnType<typeof vi.fn>): PublicClient {
  return {
    getLogs: getLogsMock,
  } as unknown as PublicClient;
}

describe('getLogs', () => {
  it('does not split HTTP 429 errors', async() => {
    const error = { status: 429 };
    const getLogsMock = vi.fn().mockRejectedValueOnce(error);

    await expect(getLogs(getClient(getLogsMock), filter, BigInt(0), BigInt(10))).rejects.toBe(error);
    expect(getLogsMock).toHaveBeenCalledTimes(1);
  });

  it('splits range errors', async() => {
    const error = new Error('block range is too large');
    const leftLog = { blockNumber: BigInt(1) } as Log;
    const rightLog = { blockNumber: BigInt(3) } as Log;
    const getLogsMock = vi.fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce([ leftLog ])
      .mockResolvedValueOnce([ rightLog ]);

    await expect(getLogs(getClient(getLogsMock), filter, BigInt(0), BigInt(3))).resolves.toEqual([ leftLog, rightLog ]);
    expect(getLogsMock).toHaveBeenCalledTimes(3);
    expect(getLogsMock.mock.calls[1]?.[0]).toMatchObject({ fromBlock: BigInt(0), toBlock: BigInt(1) });
    expect(getLogsMock.mock.calls[2]?.[0]).toMatchObject({ fromBlock: BigInt(2), toBlock: BigInt(3) });
  });

  it('does not recurse forever when one block fails', async() => {
    const error = new Error('block range is too large');
    const getLogsMock = vi.fn().mockRejectedValueOnce(error);

    await expect(getLogs(getClient(getLogsMock), filter, BigInt(1), BigInt(1))).rejects.toBe(error);
    expect(getLogsMock).toHaveBeenCalledTimes(1);
  });
});
