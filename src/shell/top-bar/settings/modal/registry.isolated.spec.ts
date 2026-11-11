// SPDX-License-Identifier: LicenseRef-Blockscout

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type * as registryModule from './registry';

async function loadRegistry(envs: Array<[ string, string ]>): Promise<typeof registryModule> {
  return withEnvs(envs, async() => import('./registry'));
}

async function visibleTabIds(envs: Array<[ string, string ]>): Promise<Array<string>> {
  const { getVisibleSettingsModalTabs } = await loadRegistry(envs);
  return getVisibleSettingsModalTabs().map((tab) => tab.id);
}

describe('SETTINGS_MODAL_TABS', () => {
  it('holds exactly the General and Custom RPC tabs', async() => {
    const { SETTINGS_MODAL_TABS } = await loadRegistry([]);
    expect(SETTINGS_MODAL_TABS.map((tab) => [ tab.id, tab.title, tab.icon ])).toEqual([
      [ 'general', 'General', 'gear' ],
      [ 'rpc-node', 'Custom RPC', 'link' ],
    ]);
  });
});

describe('getVisibleSettingsModalTabs', () => {
  it('lists General first and Custom RPC second when an RPC URL is configured', async() => {
    expect(await visibleTabIds([])).toEqual([ 'general', 'rpc-node' ]);
  });

  it('keeps General and hides Custom RPC on multichain instances', async() => {
    expect(await visibleTabIds(ENVS_MAP.multichain)).toEqual([ 'general' ]);
  });

  it('keeps General and hides Custom RPC when no RPC URL is configured', async() => {
    expect(await visibleTabIds([ [ 'NEXT_PUBLIC_NETWORK_RPC_URL', '' ] ])).toEqual([ 'general' ]);
  });
});
