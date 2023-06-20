import React from 'react';

import type { SmartContractVerificationConfig } from 'types/api/contract';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldAutodetectArgs from '../fields/ContractVerificationFieldAutodetectArgs';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldName from '../fields/ContractVerificationFieldName';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

const FILE_TYPES = [ '.json' as const ];

const ContractVerificationStandardInput = ({ config }: { config: SmartContractVerificationConfig }) => {
  return (
    <ContractVerificationMethod title="Contract verification via Solidity (standard JSON input) ">
      { !config?.is_rust_verifier_microservice_enabled && <ContractVerificationFieldName/> }
      <ContractVerificationFieldCompiler/>
      <ContractVerificationFieldSources
        fileTypes={ FILE_TYPES }
        title="Standard Input JSON"
        hint="Upload the standard input JSON file created during contract compilation."
        required
      />
      { !config?.is_rust_verifier_microservice_enabled && <ContractVerificationFieldAutodetectArgs/> }
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationStandardInput);
