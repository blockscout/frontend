// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AlternativeExplorer } from './types/client';

import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';

const items = parseEnvJson<Array<AlternativeExplorer>>(getEnvValue('NEXT_PUBLIC_NETWORK_EXPLORERS')) || [];

const config = Object.freeze({
  title: 'Alternative explorers',
  isEnabled: items.length > 0,
  items,
});

export default config;
