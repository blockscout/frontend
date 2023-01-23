import React from 'react';
import type { Control } from 'react-hook-form';

import type { FormFields } from '../types';

import ContractVerificationMethod from '../ContractVerificationMethod';
import ContractVerificationFieldSources from '../fields/ContractVerificationFieldSources';

interface Props {
  control: Control<FormFields>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContractVerificationSourcify = ({ control }: Props) => {
  return (
    <ContractVerificationMethod title="New Smart Contract Verification">
      <ContractVerificationFieldSources
        control={ control }
        accept=".json"
        multiple
        title="Sources and Metadata JSON" mt={ 0 }
        hint="Upload all Solidity contract source files and JSON metadata file(s) created during contract compilation."
      />
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationSourcify);
