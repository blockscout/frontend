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
