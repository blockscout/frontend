import React from 'react';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldEvmVersion from '../fields/ContractVerificationFieldEvmVersion';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

const ContractVerificationVyperMultiPartFile = () => {
  return (
    <ContractVerificationMethod title="New Vyper Smart Contract Verification">
      <ContractVerificationFieldCompiler isVyper/>
      <ContractVerificationFieldEvmVersion isVyper/>
      <ContractVerificationFieldSources
        accept=".vy"
        multiple
        title="Sources *.vy files"
        hint="Upload all Vyper contract source files."
      />
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationVyperMultiPartFile);
