// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import type * as viemActions from 'viem/actions';
import type * as wagmi from 'wagmi';

import type { AllowanceType } from '../types';
import type { EssentialDappsChainConfig } from 'src/features/marketplace/types/client';

import { toaster } from 'src/toolkit/chakra/toaster';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, wrapper } from 'vitest/lib';

import useRevoke from './useRevoke';

const USER_ADDRESS = '0x1111111111111111111111111111111111111111';
const TOKEN_ADDRESS = '0x2222222222222222222222222222222222222222';
const SPENDER_ADDRESS = '0x3333333333333333333333333333333333333333';
const TX_HASH = `0x${ 'ab'.repeat(32) }`;
const CHAIN: EssentialDappsChainConfig = { id: '10', name: 'OP Mainnet' };
const ERC20_APPROVAL: AllowanceType = {
  type: 'ERC-20',
  address: TOKEN_ADDRESS,
  spender: SPENDER_ADDRESS,
  transactionId: null,
  tokenReputation: null,
  timestamp: 0,
};

const walletState = vi.hoisted(() => ({
  address: undefined as string | undefined,
  publicClient: undefined as object | undefined,
  switchChainAsync: vi.fn(),
  writeContractAsync: vi.fn(),
  waitForTransactionReceipt: vi.fn(),
}));

vi.mock('wagmi', async(importOriginal) => ({
  ...await importOriginal<typeof wagmi>(),
  useAccount: () => ({ address: walletState.address }),
  useSwitchChain: () => ({ switchChainAsync: walletState.switchChainAsync }),
  useWriteContract: () => ({ writeContractAsync: walletState.writeContractAsync }),
  usePublicClient: () => walletState.publicClient,
}));

vi.mock('viem/actions', async(importOriginal) => ({
  ...await importOriginal<typeof viemActions>(),
  waitForTransactionReceipt: walletState.waitForTransactionReceipt,
}));

function renderRevoke(chain: EssentialDappsChainConfig = CHAIN) {
  return renderHook(() => useRevoke(chain), { wrapper }).result.current;
}

describe('useRevoke', () => {
  beforeEach(() => {
    walletState.address = USER_ADDRESS;
    walletState.publicClient = {};
    walletState.switchChainAsync.mockResolvedValue(undefined);
    walletState.writeContractAsync.mockResolvedValue(TX_HASH);
    walletState.waitForTransactionReceipt.mockResolvedValue({ status: 'success' });
    vi.spyOn(toaster, 'success');
    vi.spyOn(toaster, 'error');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetAllMocks();
  });

  it('should revoke an ERC-20 approval on the approval chain and report success', async() => {
    const revoke = renderRevoke();

    await expect(revoke(ERC20_APPROVAL)).resolves.toBe(true);

    expect(walletState.switchChainAsync).toHaveBeenCalledWith({ chainId: 10 });
    expect(walletState.writeContractAsync).toHaveBeenCalledWith(expect.objectContaining({
      account: USER_ADDRESS,
      address: TOKEN_ADDRESS,
      functionName: 'approve',
      args: [ SPENDER_ADDRESS, 0 ],
      chainId: 10,
    }));
    expect(toaster.success).toHaveBeenCalledWith(expect.objectContaining({ title: 'Success' }));
  });

  it('should do nothing when no wallet is connected', async() => {
    walletState.address = undefined;
    const revoke = renderRevoke();

    await expect(revoke(ERC20_APPROVAL)).resolves.toBeUndefined();

    expect(walletState.writeContractAsync).not.toHaveBeenCalled();
  });

  it.each([
    {
      condition: 'the chain has no id',
      setup: () => {},
      chain: { ...CHAIN, id: '' },
      message: 'Chain not found',
    },
    {
      condition: 'no public client is available',
      setup: () => {
        walletState.publicClient = undefined;
      },
      chain: CHAIN,
      message: 'Public client not found',
    },
    {
      condition: 'the transaction is reverted',
      setup: () => {
        walletState.waitForTransactionReceipt.mockResolvedValue({ status: 'reverted' });
      },
      chain: CHAIN,
      message: 'Failed to revoke approval.',
    },
    {
      condition: 'the wallet rejects with a short message',
      setup: () => {
        walletState.writeContractAsync.mockRejectedValue({ shortMessage: 'User rejected the request.' });
      },
      chain: CHAIN,
      message: 'User rejected the request.',
    },
    {
      condition: 'the error carries no message',
      setup: () => {
        walletState.switchChainAsync.mockRejectedValue({});
      },
      chain: CHAIN,
      message: 'Something went wrong. Try again later.',
    },
  ])('should report failure when $condition', async({ setup, chain, message }) => {
    setup();
    const revoke = renderRevoke(chain);

    await expect(revoke(ERC20_APPROVAL)).resolves.toBe(false);

    expect(toaster.error).toHaveBeenCalledWith(expect.objectContaining({ description: message }));
  });
});
