// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ResourceName } from './resources';

export type ApiName =
'core' | 'admin' | 'bens' | 'contractInfo' | 'clusters' | 'external' | 'interchainIndexer' |
'metadata' | 'multichainAggregator' | 'multichainStats' | 'rewards' | 'stats' | 'tac' |
'userOps' | 'visualize' | 'zetachain';

export interface ApiPropsBase {
  endpoint: string;
  basePath?: string;
  socketEndpoint?: string;
  instanceId?: string;
  refetchInterval?: Partial<Record<ResourceName, number>>;
}

export interface ApiPropsFull extends ApiPropsBase {
  host: string;
  protocol: string;
  port?: string;
  socketEndpoint: string;
}

export type Apis = {
  core: ApiPropsFull | undefined;
} & Partial<Record<Exclude<ApiName, 'core'>, ApiPropsBase>>;
