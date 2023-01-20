import React from 'react';
import type { Control } from 'react-hook-form';

import type { FormFields } from '../types';

import ContractVerificationMethod from '../ContractVerificationMethod';

interface Props {
  control: Control<FormFields>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ContractVerificationVyperContract = ({ control }: Props) => {
  return (
    <ContractVerificationMethod title="New Vyper Smart Contract Verification">
      ContractVerificationVyperContract
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationVyperContract);
