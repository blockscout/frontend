// SPDX-License-Identifier: LicenseRef-Blockscout

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { beforeEach, describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import { getRpcNodeStatus, pingRpcNode, validateRpcUrl } from './utils';

describe('validateRpcUrl', () => {
  it('accepts an https URL and an empty value', () => {
    expect(validateRpcUrl('https://rpc.example.com/eth')).toBe(true);
    expect(validateRpcUrl('')).toBe(true);
  });

  it('rejects other schemes and malformed values', () => {
    expect(validateRpcUrl('http://rpc.example.com')).toBe('Invalid format');
    expect(validateRpcUrl('wss://rpc.example.com')).toBe('Invalid format');
    expect(validateRpcUrl('rpc.example.com')).toBe('Invalid format');
    expect(validateRpcUrl('https://')).toBe('Invalid format');
  });
});

describe('pingRpcNode', () => {
  const url = 'https://rpc.example.com';

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('posts eth_chainId and reports connected when the chain id matches', async() => {
    fetchMock.mockResponseOnce(JSON.stringify({ jsonrpc: '2.0', id: 1, result: '0x1' }));

    expect(await pingRpcNode(url)).toEqual({ outcome: 'connected', chainId: '0x1' });

    const [ requestUrl, init ] = fetchMock.mock.calls[0];
    expect(requestUrl).toBe(url);
    expect(init?.method).toBe('POST');
    expect(JSON.parse(String(init?.body))).toMatchObject({ method: 'eth_chainId' });
  });

  it('reports wrong-chain with the reported id when another chain answers', async() => {
    fetchMock.mockResponseOnce(JSON.stringify({ jsonrpc: '2.0', id: 1, result: '0x89' }));

    expect(await pingRpcNode(url)).toEqual({ outcome: 'wrong-chain', chainId: '0x89' });
  });

  it('reports unknown-chain for a 2xx answer without a hex chain id', async() => {
    fetchMock.mockResponseOnce(JSON.stringify({ jsonrpc: '2.0', id: 1, error: { code: -32601, message: 'nope' } }));
    expect(await pingRpcNode(url)).toEqual({ outcome: 'unknown-chain', chainId: undefined });

    fetchMock.mockResponseOnce(JSON.stringify({ result: 'mainnet' }));
    expect(await pingRpcNode(url)).toEqual({ outcome: 'unknown-chain', chainId: undefined });

    fetchMock.mockResponseOnce('<html/>');
    expect(await pingRpcNode(url)).toEqual({ outcome: 'unreachable', chainId: undefined });
  });

  it('reports unreachable on an HTTP error or a network failure', async() => {
    fetchMock.mockResponseOnce('', { status: 503 });
    expect(await pingRpcNode(url)).toEqual({ outcome: 'unreachable', chainId: undefined });

    fetchMock.mockRejectOnce(new TypeError('Failed to fetch'));
    expect(await pingRpcNode(url)).toEqual({ outcome: 'unreachable', chainId: undefined });
  });
});

describe('getRpcNodeStatus', () => {
  it('reports a healthy custom node as connected with a green plug and no alert', () => {
    const status = getRpcNodeStatus('connected');
    expect(status.tag).toEqual({ label: 'Connected', colorPalette: 'green' });
    expect(status.nodeText).toBe('Using your custom node');
    expect(status.plug).toEqual({ icon: 'integration/full', color: 'green.500' });
    expect(status.alert).toBeUndefined();
  });

  it('keeps the connected tag but warns with an orange plug on a chain mismatch', () => {
    const status = getRpcNodeStatus('wrong-chain');
    expect(status.tag.label).toBe('Connected');
    expect(status.plug).toEqual({ icon: 'integration/full', color: 'orange.500' });
    expect(status.alert?.status).toBe('warning');
    expect(status.alert?.text).toMatch(/different network/);
  });

  it('informs with an orange plug when the chain cannot be identified', () => {
    const status = getRpcNodeStatus('unknown-chain');
    expect(status.tag.label).toBe('Connected');
    expect(status.plug.color).toBe('orange.500');
    expect(status.alert?.status).toBe('info');
    expect(status.alert?.text).toMatch(/couldn't identify the network/);
  });

  it('reports a dead custom node as not responding with the connected plug in red', () => {
    const status = getRpcNodeStatus('unreachable');
    expect(status.tag).toEqual({ label: 'Not responding', colorPalette: 'red' });
    expect(status.nodeText).toBe('Using your custom node');
    expect(status.plug).toEqual({ icon: 'integration/full', color: 'red.500' });
    expect(status.alert?.status).toBe('error');
    expect(status.alert?.text).toMatch(/isn't responding/);
  });

  it('shows a saved but unused node as disconnected on the default node', () => {
    const status = getRpcNodeStatus('disconnected');
    expect(status.tag).toEqual({ label: 'Disconnected', colorPalette: 'gray' });
    expect(status.nodeText).toBe('Using the default node');
    expect(status.plug).toEqual({ icon: 'integration/partial', color: 'icon.secondary' });
    expect(status.alert).toBeUndefined();
  });
});

describe('isRpcNodeSettingAvailable', () => {
  async function isAvailable(envs: Array<[ string, string ]>): Promise<boolean> {
    return withEnvs(envs, async() => {
      const { isRpcNodeSettingAvailable } = await import('./utils');
      return isRpcNodeSettingAvailable();
    });
  }

  it('is available on a single-chain instance with a configured RPC URL', async() => {
    expect(await isAvailable([])).toBe(true);
  });

  it('is hidden on multichain instances', async() => {
    expect(await isAvailable(ENVS_MAP.multichain)).toBe(false);
  });

  it('is hidden when no RPC URL is configured', async() => {
    expect(await isAvailable([ [ 'NEXT_PUBLIC_NETWORK_RPC_URL', '' ] ])).toBe(false);
  });
});
