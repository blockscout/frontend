import React from 'react';
import type { Control } from 'react-hook-form';

import type { FormFields } from '../types';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationEvmVersion from '../fields/ContractVerificationEvmVersion';
import ContractVerificationFieldCode from '../fields/ContractVerificationFieldCode';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldIsConstArgs from '../fields/ContractVerificationFieldIsConstArgs';
import ContractVerificationFieldIsYul from '../fields/ContractVerificationFieldIsYul';
import ContractVerificationFieldName from '../fields/ContractVerificationFieldName';
import ContractVerificationFieldOptimization from '../fields/ContractVerificationFieldOptimization';

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
      <ContractVerificationFieldOptimization control={ control }/>
      <ContractVerificationFieldCode control={ control }/>
      <ContractVerificationFieldIsConstArgs control={ control }/>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationFlattenSourceCode);
