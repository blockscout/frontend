// SPDX-License-Identifier: LicenseRef-Blockscout

import type React from 'react';

import config from 'src/config';
import type { IconName } from 'src/sprite/SpriteIcon';

import { isRpcNodeSettingAvailable } from '../fields/rpc-node/utils';
import SettingsModalAppearanceTab from './tabs/SettingsModalAppearanceTab';
import SettingsModalRpcNodeTab from './tabs/SettingsModalRpcNodeTab';
import SettingsModalScamTokensTab from './tabs/SettingsModalScamTokensTab';
import SettingsModalTimeFormatTab from './tabs/SettingsModalTimeFormatTab';

export type SettingsModalTabId = 'scam-tokens' | 'rpc-node' | 'appearance' | 'time-format';

export interface SettingsModalTab {
  readonly id: SettingsModalTabId;
  readonly title: string;
  readonly icon: IconName;
  readonly Content: React.ComponentType;
  readonly isVisible: () => boolean;
}

export const SETTINGS_MODAL_TABS: ReadonlyArray<SettingsModalTab> = [
  {
    id: 'scam-tokens',
    title: 'Scam tokens',
    icon: 'status/warning',
    Content: SettingsModalScamTokensTab,
    isVisible: () => config.slices.token.hideScamTokensEnabled || config.features.multichain.isEnabled,
  },
  {
    id: 'rpc-node',
    title: 'RPC node',
    icon: 'link',
    Content: SettingsModalRpcNodeTab,
    isVisible: isRpcNodeSettingAvailable,
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: 'palette',
    Content: SettingsModalAppearanceTab,
    isVisible: () => true,
  },
  {
    id: 'time-format',
    title: 'Time format',
    icon: 'clock-light',
    Content: SettingsModalTimeFormatTab,
    isVisible: () => true,
  },
];

export function getVisibleSettingsModalTabs(): Array<SettingsModalTab> {
  return SETTINGS_MODAL_TABS.filter((tab) => tab.isVisible());
}
