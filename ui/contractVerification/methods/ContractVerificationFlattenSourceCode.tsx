import React from 'react';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCode from '../fields/ContractVerificationFieldCode';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldConstArgs from '../fields/ContractVerificationFieldConstArgs';
import ContractVerificationFieldEvmVersion from '../fields/ContractVerificationFieldEvmVersion';
import ContractVerificationFieldIsYul from '../fields/ContractVerificationFieldIsYul';
import ContractVerificationFieldLibraries from '../fields/ContractVerificationFieldLibraries';
import ContractVerificationFieldName from '../fields/ContractVerificationFieldName';
import ContractVerificationFieldOptimization from '../fields/ContractVerificationFieldOptimization';

const ContractVerificationFlattenSourceCode = () => {
  return (
    <ContractVerificationMethod title="New Solidity/Yul Smart Contract Verification">
      <ContractVerificationFieldIsYul/>
      <ContractVerificationFieldName/>
      <ContractVerificationFieldCompiler/>
      <ContractVerificationFieldEvmVersion/>
      <ContractVerificationFieldOptimization/>
      <ContractVerificationFieldCode/>
      <ContractVerificationFieldConstArgs/>
      <ContractVerificationFieldLibraries/>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationFlattenSourceCode);
