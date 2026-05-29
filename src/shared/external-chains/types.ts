// SPDX-License-Identifier: LicenseRef-Blockscout

import type { EssentialDappsChainConfig } from 'src/features/marketplace/types/client';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

// minimal set of fields for external chains
export interface ExternalChain {
  id: string;
  name: string;
  logo?: string;
  explorer_url?: string;
  route_templates?: {
    tx?: string;
    address?: string;
    token?: string;
  };
}

export type ExternalChainExtended = ClusterChainConfig | EssentialDappsChainConfig;
