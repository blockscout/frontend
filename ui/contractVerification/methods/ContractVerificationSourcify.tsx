import React from 'react';
import type { Control } from 'react-hook-form';

import type { FormFields } from '../types';

import ContractVerificationMethod from '../ContractVerificationMethod';

interface Props {
  control: Control<FormFields>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContractVerificationSourcify = ({ control }: Props) => {
  return (
    <ContractVerificationMethod title="New Smart Contract Verification">
      ContractVerificationSourcify
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationSourcify);
