// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ExternalChain } from 'src/shared/external-chains/types';

import multichainConfig from 'src/features/multichain/chains-config';

import config from 'src/config';

export const isClusterChain = (chain: ExternalChain | undefined): boolean => {
  return multichainConfig()?.chains.some(({ id }) => id === chain?.id) ?? false;
};

export const isCurrentChain = (chain: ExternalChain | undefined): boolean => {
  return chain?.id === config.chain.id;
};

export const isLinkableChain = (chain: ExternalChain | undefined): boolean => {
  return chain !== undefined && (isCurrentChain(chain) || isClusterChain(chain) || Boolean(chain.explorer_url));
};
