// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { SmartContractVerificationConfig } from 'client/slices/contract/pages/contract-verification/utils';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

const FILE_TYPES = [ '.json' as const ];

const ContractVerificationVyperStandardInput = ({ config }: { config: SmartContractVerificationConfig }) => {
  return (
    <ContractVerificationMethod title="Contract verification via Vyper (standard JSON input) ">
      <ContractVerificationFieldCompiler config={ config } isVyper/>
      <ContractVerificationFieldSources
        fileTypes={ FILE_TYPES }
        title="Standard Input JSON"
        hint="Upload the standard input JSON file created during contract compilation."
        required
      />
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationVyperStandardInput);
