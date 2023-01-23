import React from 'react';
import type { Control } from 'react-hook-form';

import type { FormFields } from '../types';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldAbiEncodedArgs from '../fields/ContractVerificationFieldAbiEncodedArgs';
import ContractVerificationFieldCode from '../fields/ContractVerificationFieldCode';
import ContractVerificationFieldCompiler from '../fields/ContractVerificationFieldCompiler';
import ContractVerificationFieldName from '../fields/ContractVerificationFieldName';

interface Props {
  control: Control<FormFields>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContractVerificationVyperContract = ({ control }: Props) => {
  return (
    <ContractVerificationMethod title="New Vyper Smart Contract Verification">
      <ContractVerificationFieldName control={ control } hint="Must match the name specified in the code."/>
      <ContractVerificationFieldCompiler control={ control } isVyper/>
      <ContractVerificationFieldCode control={ control } isVyper/>
      <ContractVerificationFieldAbiEncodedArgs control={ control }/>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationVyperContract);
