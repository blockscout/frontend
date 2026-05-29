// SPDX-License-Identifier: LicenseRef-Blockscout

export interface SearchResultCluster {
  type: 'cluster';
  name: string | null;
  address_hash: string;
  is_smart_contract_verified: boolean;
  is_smart_contract_address: boolean;
  certified?: true;
  filecoin_robust_address?: string | null;
  url?: string;
  cluster_info: {
    cluster_id: string;
    name: string;
    owner: string;
    created_at?: string;
    expires_at?: string | null;
    total_wei_amount?: string;
    is_testnet?: boolean;
  };
}
export interface ClustersByAddressObject {
  name: string;
  owner: string;
  totalWeiAmount: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  isTestnet: boolean;
  clusterId: string;
  expiresAt: string | null;
}

export interface ClustersByAddressResponse {
  result: {
    data: Array<ClustersByAddressObject>;
  };
}

export interface ClusterByNameResponse {
  result: {
    data: {
      name: string;
      owner: string;
      clusterId: string;
      backingWei: string;
      expiresAt: string | null;
      createdAt: string;
      updatedAt: string;
      updatedBy: string;
      isTestnet: boolean;
    };
  };
}

export interface ClusterByIdQueryParams {
  id: string;
}

export interface ClusterByIdResponse {
  result: {
    data: {
      id: string;
      createdBy: string;
      createdAt: string;
      wallets: Array<{
        address: string;
        name: string;
        chainIds: Array<string>;
      }>;
      isTestnet: boolean;
    };
  };
}

export interface ClustersLeaderboardObject {
  name: string;
  clusterId: string;
  isTestnet: boolean;
  totalWeiAmount: string;
  totalReferralAmount: string;
  chainIds: Array<string>;
  nameCount: string;
  rank: number;
}

export interface ClustersLeaderboardResponse {
  result: {
    data: Array<ClustersLeaderboardObject>;
  };
}

export interface ClustersDirectoryObject {
  name: string;
  isTestnet: boolean;
  createdAt: string;
  owner: string;
  totalWeiAmount: string;
  updatedAt: string;
  updatedBy: string;
  chainIds: Array<string>;
}

export interface ClustersDirectoryResponse {
  result: {
    data: {
      total: number;
      items: Array<ClustersDirectoryObject>;
    };
  };
}

export interface ClustersByAddressQueryParams {
  address: string;
}

export interface ClusterByNameQueryParams {
  name: string;
}

export enum ClustersOrderBy {
  RANK_ASC = 'rank-asc',
  CREATED_AT_DESC = 'createdAt-desc',
  NAME_ASC = 'name-asc',
}

export interface ClustersLeaderboardQueryParams {
  offset?: number;
  limit?: number;
  orderBy?: ClustersOrderBy | string;
  query?: string | null;
  isExact?: boolean;
}

export interface ClustersDirectoryQueryParams {
  offset?: number;
  limit?: number;
  orderBy?: ClustersOrderBy | string;
  query?: string | null;
}
