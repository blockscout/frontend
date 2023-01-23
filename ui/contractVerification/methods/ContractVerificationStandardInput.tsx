import React from 'react';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldConstArgs from '../fields/ContractVerificationFieldConstArgs';
import ContractVerificationFieldName from '../fields/ContractVerificationFieldName';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

const ContractVerificationStandardInput = () => {
  return (
    <ContractVerificationMethod title="New Smart Contract Verification">
      <ContractVerificationFieldName/>
      <ContractVerificationFieldCompiler/>
      <ContractVerificationFieldSources
        accept=".json"
        title="Standard Input JSON"
        hint="Upload the standard input JSON file created during contract compilation."
      />
      <ContractVerificationFieldConstArgs/>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationStandardInput);
