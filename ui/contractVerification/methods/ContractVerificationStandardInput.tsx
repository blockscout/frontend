import React from 'react';
import type { Control } from 'react-hook-form';

import type { FormFields } from '../types';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldConstArgs from '../fields/ContractVerificationFieldConstArgs';
import ContractVerificationFieldName from '../fields/ContractVerificationFieldName';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

interface Props {
  control: Control<FormFields>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContractVerificationStandardInput = ({ control }: Props) => {
  return (
    <ContractVerificationMethod title="New Smart Contract Verification">
      <ContractVerificationFieldName control={ control }/>
      <ContractVerificationFieldCompiler control={ control }/>
      <ContractVerificationFieldSources control={ control } accept=".json" title="Standard Input JSON"/>
      <ContractVerificationFieldConstArgs control={ control }/>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationStandardInput);
