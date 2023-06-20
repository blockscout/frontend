import React from 'react';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldEvmVersion from '../fields/ContractVerificationFieldEvmVersion';
import ContractVerificationFieldLibraries from '../fields/ContractVerificationFieldLibraries';
import ContractVerificationFieldOptimization from '../fields/ContractVerificationFieldOptimization';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

const FILE_TYPES = [ '.sol' as const, '.yul' as const ];

const ContractVerificationMultiPartFile = () => {
  return (
    <ContractVerificationMethod title="Contract verification via Solidity (multi-part files)">
      <ContractVerificationFieldCompiler/>
      <ContractVerificationFieldEvmVersion/>
      <ContractVerificationFieldOptimization/>
      <ContractVerificationFieldSources
        fileTypes={ FILE_TYPES }
        multiple
        required
        title="Sources *.sol or *.yul files"
        hint="Upload all Solidity or Yul contract source files."
      />
      <ContractVerificationFieldLibraries/>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationMultiPartFile);
