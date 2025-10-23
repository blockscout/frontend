import type { EssentialDappsChainConfig } from 'types/client/marketplace';
import type { ClusterChainConfig } from 'types/multichain';

// minimal set of fields for external chains
export interface ExternalChain {
  id: string;
  name: string;
  logo: string | undefined;
  explorer_url: string;
}

export type ExternalChainExtended = ClusterChainConfig | EssentialDappsChainConfig;
