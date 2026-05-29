// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BridgedTokenChain, TokenBridge } from 'src/features/bridged-tokens/types/client';

import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const title = 'Bridged tokens';

const config: Feature<{ chains: Array<BridgedTokenChain>; bridges: Array<TokenBridge> }> = (() => {
  const chains = parseEnvJson<Array<BridgedTokenChain>>(getEnvValue('NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS'));
  const bridges = parseEnvJson<Array<TokenBridge>>(getEnvValue('NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES'));

  if (chains && chains.length > 0 && bridges && bridges.length > 0) {
    return Object.freeze({
      title,
      isEnabled: true,
      chains,
      bridges,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
