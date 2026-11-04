// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ParentChain } from 'src/features/rollup/common/types/config';

import config from 'src/config';
import type { EntityChain } from 'src/shared/entities/resolve-entity-link';

export const parentChainAsEntityChain = (parentChain: ParentChain): EntityChain => ({
  id: parentChain.id === undefined ? '' : String(parentChain.id),
  name: parentChain.name ?? '',
  explorer_url: parentChain.baseUrl,
  linkOnly: true,
});

const rollupFeature = config.features.rollup;

export const parentChain: EntityChain | undefined = rollupFeature.isEnabled ? parentChainAsEntityChain(rollupFeature.parentChain) : undefined;
