import React from 'react';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldEvmVersion from '../fields/ContractVerificationFieldEvmVersion';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

const FILE_TYPES = [ '.vy' as const ];

const ContractVerificationVyperMultiPartFile = () => {
  return (
    <ContractVerificationMethod title="Contract verification via Vyper (multi-part files)">
      <ContractVerificationFieldCompiler isVyper/>
      <ContractVerificationFieldEvmVersion isVyper/>
      <ContractVerificationFieldSources
        fileTypes={ FILE_TYPES }
        multiple
        title="Sources *.vy files"
        hint="Upload all Vyper contract source files."
      />
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationVyperMultiPartFile);
