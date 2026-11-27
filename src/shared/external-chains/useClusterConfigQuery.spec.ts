// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import { chainA, chainB } from 'src/features/multichain/mocks/chains';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, renderHook, waitFor, wrapper } from 'vitest/lib';

import { CLUSTER_CONFIG_SCRIPT_URL } from './cluster-config';
import { useClusterConfigQuery } from './useClusterConfigQuery';

const CLUSTER_CONFIG = { chains: [ chainA, chainB ] };

function findConfigScript(): HTMLScriptElement | null {
  return document.head.querySelector(`script[src="${ CLUSTER_CONFIG_SCRIPT_URL }"]`);
}

describe('useClusterConfigQuery', () => {
  afterEach(() => {
    cleanup();
    findConfigScript()?.remove();
  });

  it('returns the config the document already loaded without loading the script', () => {
    vi.stubGlobal('__multichainConfig', CLUSTER_CONFIG);

    const { result } = renderHook(() => useClusterConfigQuery(), { wrapper });

    expect(result.current.data).toBe(CLUSTER_CONFIG);
    expect(findConfigScript()).toBeNull();
  });

  it('stays pending until the config script has loaded, then returns the config', async() => {
    const { result } = renderHook(() => useClusterConfigQuery(), { wrapper });

    await waitFor(() => expect(findConfigScript()).not.toBeNull());
    expect(result.current.isPending).toBe(true);

    vi.stubGlobal('__multichainConfig', CLUSTER_CONFIG);
    findConfigScript()?.dispatchEvent(new Event('load'));

    await waitFor(() => expect(result.current.data).toBe(CLUSTER_CONFIG));
  });

  it('fails when the config script cannot be loaded', async() => {
    const { result } = renderHook(() => useClusterConfigQuery(), { wrapper });

    await waitFor(() => expect(findConfigScript()).not.toBeNull());
    findConfigScript()?.dispatchEvent(new Event('error'));

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(findConfigScript()).toBeNull();
  });

  it('fails when the loaded script defines no config', async() => {
    const { result } = renderHook(() => useClusterConfigQuery(), { wrapper });

    await waitFor(() => expect(findConfigScript()).not.toBeNull());
    findConfigScript()?.dispatchEvent(new Event('load'));

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
