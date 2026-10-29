// SPDX-License-Identifier: LicenseRef-Blockscout

import type React from 'react';

import type { IconName } from 'src/sprite/SpriteIcon';

import { isRpcNodeSettingAvailable } from '../fields/rpc-node/utils';
import SettingsModalGeneralTab from './tabs/SettingsModalGeneralTab';
import SettingsModalRpcNodeTab from './tabs/SettingsModalRpcNodeTab';

export type SettingsModalTabId = 'general' | 'rpc-node';

export interface SettingsModalTab {
  readonly id: SettingsModalTabId;
  readonly title: string;
  readonly icon: IconName;
  readonly Content: React.ComponentType;
  readonly isVisible: () => boolean;
}

export const SETTINGS_MODAL_TABS: ReadonlyArray<SettingsModalTab> = [
  {
    id: 'general',
    title: 'General',
    icon: 'gear',
    Content: SettingsModalGeneralTab,
    isVisible: () => true,
  },
  {
    id: 'rpc-node',
    title: 'Custom RPC',
    icon: 'link',
    Content: SettingsModalRpcNodeTab,
    isVisible: isRpcNodeSettingAvailable,
  },
];

export function getVisibleSettingsModalTabs(): Array<SettingsModalTab> {
  return SETTINGS_MODAL_TABS.filter((tab) => tab.isVisible());
}
