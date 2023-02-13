import React from 'react';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCode from '../fields/ContractVerificationFieldCode';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldConstructorArgs from '../fields/ContractVerificationFieldConstructorArgs';
import ContractVerificationFieldName from '../fields/ContractVerificationFieldName';

const ContractVerificationVyperContract = () => {
  return (
    <ContractVerificationMethod title="New Vyper Smart Contract Verification">
      <ContractVerificationFieldName hint="Must match the name specified in the code."/>
      <ContractVerificationFieldCompiler isVyper/>
      <ContractVerificationFieldCode isVyper/>
      <ContractVerificationFieldConstructorArgs/>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationVyperContract);
