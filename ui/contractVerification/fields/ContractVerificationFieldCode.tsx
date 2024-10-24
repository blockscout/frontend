import React from 'react';

import type { FormFields } from '../types';

import FormFieldText from 'ui/shared/forms/fields/FormFieldText';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  isVyper?: boolean;
}

const ContractVerificationFieldCode = ({ isVyper }: Props) => {
  return (
    <ContractVerificationFormRow>
      <FormFieldText<FormFields>
        name="code"
        isRequired
        placeholder="Contract code"
        size={{ base: 'md', lg: 'lg' }}
        asComponent="Textarea"
      />
      { isVyper ? null : (
        <span>If your code utilizes a library or inherits dependencies, we recommend using other verification methods instead.</span>
      ) }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldCode);
