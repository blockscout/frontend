// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ClusterChainConfig } from 'src/features/multichain/types/client';

export type ChainConfig = Array<ClusterChainConfig['app_config']> | ClusterChainConfig['app_config'];

export interface Metadata {
  name?: string;
  description?: string;
  attributes?: Array<MetadataAttributes>;
}

export interface MetadataAttributes {
  value: string;
  trait_type: string;
  value_type?: 'URL';
}

export interface AdditionalTokenType {
  id: string;
  name: string;
}

export interface NftMarketplaceItem {
  name: string;
  collection_url?: string;
  instance_url?: string;
  logo_url: string;
}
