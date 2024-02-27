export interface TxBlob {
  hash: string;
  blob_data: string;
  kzg_commitment: string;
  kzg_proof: string;
}

export type TxBlobs = {
  items: Array<TxBlob>;
  next_page_params: null;
};
