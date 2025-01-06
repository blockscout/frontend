import { Alert } from '@chakra-ui/react';
import React from 'react';

import type { SmartContract } from 'types/api/contract';

import LinkExternal from 'ui/shared/links/LinkExternal';

interface Props {
  data: SmartContract | undefined;
}

const ContractDetailsAlertVerificationSource = ({ data }: Props) => {
  if (data?.is_verified_via_eth_bytecode_db) {
    return (
      <Alert status="warning" whiteSpace="pre-wrap" flexWrap="wrap">
        <span>This contract has been { data.is_partially_verified ? 'partially ' : '' }verified using </span>
        <LinkExternal
          href="https://docs.blockscout.com/about/features/ethereum-bytecode-database-microservice"
          fontSize="md"
        >
          Blockscout Bytecode Database
        </LinkExternal>
      </Alert>
    );
  }

  if (data?.is_verified_via_sourcify) {
    return (
      <Alert status="warning" whiteSpace="pre-wrap" flexWrap="wrap">
        <span>This contract has been { data.is_partially_verified ? 'partially ' : '' }verified via Sourcify. </span>
        { data.sourcify_repo_url && <LinkExternal href={ data.sourcify_repo_url } fontSize="md">View contract in Sourcify repository</LinkExternal> }
      </Alert>
    );
  }

  return null;
};

export default React.memo(ContractDetailsAlertVerificationSource);
