// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

export interface TransactionZilliqa {
  zilliqa?: {
    is_scilla: boolean;
  };
}

export interface ZilliqaQuorumCertificate {
  view: number;
  signature: string;
  signers: Array<number>;
}

export interface ZilliqaNestedQuorumCertificate extends ZilliqaQuorumCertificate {
  proposed_by_validator_index: number;
}

export interface ZilliqaBlockData {
  view: number;
  quorum_certificate: ZilliqaQuorumCertificate;
  aggregate_quorum_certificate: (ZilliqaQuorumCertificate & {
    nested_quorum_certificates: Array<ZilliqaNestedQuorumCertificate>;
  }) | null;
}

export interface BlockZilliqa {
  zilliqa?: ZilliqaBlockData;
}

export interface ValidatorsZilliqaItem {
  index: number;
  bls_public_key: string;
  balance: string;
}

export interface ValidatorsZilliqaResponse {
  items: Array<ValidatorsZilliqaItem>;
  next_page_params: null;
}

export interface ValidatorZilliqa {
  added_at_block_number: number;
  balance: string;
  bls_public_key: string;
  control_address: schemas['Address'];
  index: number;
  peer_id: string;
  reward_address: schemas['Address'];
  signing_address: schemas['Address'];
  stake_updated_at_block_number: number;
}
