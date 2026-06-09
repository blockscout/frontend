// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ExternalChain } from 'src/shared/external-chains/types';

export default function getChainTooltipText(chain: Pick<ExternalChain, 'id' | 'name'> | undefined, prefix: string = '') {
  if (!chain) {
    return 'Unknown chain';
  }
  return `${ prefix }${ chain.name } (Chain ID: ${ chain.id })`;
}
