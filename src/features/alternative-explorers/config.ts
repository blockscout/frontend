// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AlternativeExplorer } from './types/client';

import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';

const config = Object.freeze({
  items: parseEnvJson<Array<AlternativeExplorer>>(getEnvValue('NEXT_PUBLIC_NETWORK_EXPLORERS')) || [],
});

export default config;
