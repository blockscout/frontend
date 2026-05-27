// SPDX-License-Identifier: LicenseRef-Blockscout

import multichainConfig from 'client/features/multichain/chains-config';

export default function getChainIdFromSlugOrId(slugOrId: string) {
  const config = multichainConfig();
  if (!config) {
    return undefined;
  }

  return config.chains.find((chain) => chain.slug === slugOrId || chain.id === slugOrId)?.id;
}
