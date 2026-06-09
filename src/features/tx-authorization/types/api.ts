// SPDX-License-Identifier: LicenseRef-Blockscout

export interface TransactionAuthorization {
  authorization_list?: Array<TxAuthorization>;
}

export interface TxAuthorization {
  address_hash: string;
  authority: string;
  chain_id: number;
  nonce: number;
  status: 'ok' | 'invalid_chain_id' | 'invalid_nonce' | 'invalid_signature' | null;
}
