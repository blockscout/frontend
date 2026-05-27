// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue, parseEnvJson } from 'client/config/utils/envs';

import type { AlternativeExplorer } from './types/client';

export const config = Object.freeze({
  items: parseEnvJson<Array<AlternativeExplorer>>(getEnvValue('NEXT_PUBLIC_NETWORK_EXPLORERS')) || [],
});

export default config;
