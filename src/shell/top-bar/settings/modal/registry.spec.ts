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

describe('getVisibleSettingsModalTabs', () => {
  it('hides the Scam tokens tab when neither the scam toggle nor multichain is enabled', async() => {
    expect(await visibleTabIds([])).toEqual([ 'appearance', 'time-format' ]);
  });

  it('lists the Scam tokens tab first when the scam toggle is enabled', async() => {
    expect(await visibleTabIds([ [ 'NEXT_PUBLIC_VIEWS_TOKEN_SCAM_TOGGLE_ENABLED', 'true' ] ]))
      .toEqual([ 'scam-tokens', 'appearance', 'time-format' ]);
  });

  it('keeps the Scam tokens tab for the poor-reputation switch on multichain instances', async() => {
    expect(await visibleTabIds(ENVS_MAP.multichain)).toContain('scam-tokens');
  });
});
