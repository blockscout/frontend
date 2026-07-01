// SPDX-License-Identifier: LicenseRef-Blockscout
export interface Blob {
  hash: string;
  blob_data: string | null;
  kzg_commitment: string | null;
  kzg_proof: string | null;
  transaction_hashes: Array<{
    block_consensus: boolean;
    transaction_hash: string;
  }>;
}

export type TxsWithBlobsFilters = {
  type: 'blob_transaction';
};
