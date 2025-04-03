import React from 'react';

import type { SmartContract } from 'types/api/contract';

import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';

interface Props {
  data: SmartContract | undefined;
}

const ContractDetailsAlertVerificationSource = ({ data }: Props) => {
  if (data?.is_verified && data?.is_verified_via_eth_bytecode_db) {
    return (
      <Alert status="warning" whiteSpace="pre-wrap">
        <span>This contract has been { data.is_partially_verified ? 'partially ' : '' }verified using </span>
        <Link
          href="https://docs.blockscout.com/about/features/ethereum-bytecode-database-microservice"
          textStyle="md"
          external
        >
          Blockscout Bytecode Database
        </Link>
      </Alert>
    );
  }

  if (data?.is_verified && data?.is_verified_via_sourcify) {
    return (
      <Alert status="warning" whiteSpace="pre-wrap">
        <span>This contract has been { data.is_partially_verified ? 'partially ' : '' }verified via Sourcify. </span>
        { data.sourcify_repo_url && <Link href={ data.sourcify_repo_url } textStyle="md" external>View contract in Sourcify repository</Link> }
      </Alert>
    );
  }

  return null;
};

export default React.memo(ContractDetailsAlertVerificationSource);
