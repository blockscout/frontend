// SPDX-License-Identifier: LicenseRef-Blockscout

export interface AddressZilliqaParams {
  is_scilla_contract: boolean;
}

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
