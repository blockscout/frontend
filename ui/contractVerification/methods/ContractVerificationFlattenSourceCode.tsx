import React from 'react';
import type { Control } from 'react-hook-form';

import type { FormFields } from '../types';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationEvmVersion from '../fields/ContractVerificationEvmVersion';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldIsYul from '../fields/ContractVerificationFieldIsYul';
import ContractVerificationFieldName from '../fields/ContractVerificationFieldName';

interface Props {
  control: Control<FormFields>;
}

const ContractVerificationFlattenSourceCode = ({ control }: Props) => {
  return (
    <ContractVerificationMethod title="New Solidity/Yul Smart Contract Verification">
      <ContractVerificationFieldIsYul control={ control }/>
      <ContractVerificationFieldName control={ control }/>
      <ContractVerificationFieldCompiler control={ control }/>
      <ContractVerificationEvmVersion control={ control }/>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationFlattenSourceCode);
