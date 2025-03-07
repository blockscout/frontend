import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { FormFields } from '../types';

import FormFieldAddress from 'ui/shared/forms/fields/FormFieldAddress';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  isReadOnly?: boolean;
}

const ContractVerificationFieldAddress = ({ isReadOnly }: Props) => {
  return (
    <>
      <ContractVerificationFormRow>
        <chakra.span fontWeight={ 500 } fontSize="lg" fontFamily="heading">
          Contract address to verify
        </chakra.span>
      </ContractVerificationFormRow>
      <ContractVerificationFormRow>
        <FormFieldAddress<FormFields>
          name="address"
          isRequired
          placeholder="Smart contract / Address (0x...)"
          isReadOnly={ isReadOnly }
          size={{ base: 'md', lg: 'lg' }}
        />
      </ContractVerificationFormRow>
    </>
  );
};

export default React.memo(ContractVerificationFieldAddress);
