import React from 'react';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldAutodetectArgs from '../fields/ContractVerificationFieldAutodetectArgs';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldName from '../fields/ContractVerificationFieldName';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

const FILE_TYPES = [ '.json' as const ];

const ContractVerificationStandardInput = () => {
  return (
    <ContractVerificationMethod title="Contract verification via Solidity (standard JSON input) ">
      <ContractVerificationFieldName/>
      <ContractVerificationFieldCompiler/>
      <ContractVerificationFieldSources
        fileTypes={ FILE_TYPES }
        title="Standard Input JSON"
        hint="Upload the standard input JSON file created during contract compilation."
      />
      <ContractVerificationFieldAutodetectArgs/>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationStandardInput);
