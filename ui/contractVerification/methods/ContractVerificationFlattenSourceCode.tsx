import React from 'react';
import type { Control } from 'react-hook-form';

import type { FormFields } from '../types';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCode from '../fields/ContractVerificationFieldCode';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldConstArgs from '../fields/ContractVerificationFieldConstArgs';
import ContractVerificationFieldEvmVersion from '../fields/ContractVerificationFieldEvmVersion';
import ContractVerificationFieldIsYul from '../fields/ContractVerificationFieldIsYul';
import ContractVerificationFieldLibraries from '../fields/ContractVerificationFieldLibraries';
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
      <ContractVerificationFieldEvmVersion control={ control }/>
      <ContractVerificationFieldOptimization control={ control }/>
      <ContractVerificationFieldCode control={ control }/>
      <ContractVerificationFieldConstArgs control={ control }/>
      <ContractVerificationFieldLibraries control={ control }/>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationFlattenSourceCode);
