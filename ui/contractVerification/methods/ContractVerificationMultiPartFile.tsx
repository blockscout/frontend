import React from 'react';
import type { Control } from 'react-hook-form';

import type { FormFields } from '../types';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldEvmVersion from '../fields/ContractVerificationFieldEvmVersion';
import ContractVerificationFieldLibraries from '../fields/ContractVerificationFieldLibraries';
import ContractVerificationFieldOptimization from '../fields/ContractVerificationFieldOptimization';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

interface Props {
  control: Control<FormFields>;
}

const ContractVerificationMultiPartFile = ({ control }: Props) => {
  return (
    <ContractVerificationMethod title="New Solidity/Yul Smart Contract Verification">
      <ContractVerificationFieldCompiler control={ control }/>
      <ContractVerificationFieldEvmVersion control={ control }/>
      <ContractVerificationFieldOptimization control={ control }/>
      <ContractVerificationFieldSources control={ control }/>
      <ContractVerificationFieldLibraries control={ control }/>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationMultiPartFile);
