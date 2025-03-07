import React from 'react';

import type { FormFields } from '../types';

import FormFieldCheckbox from 'ui/shared/forms/fields/FormFieldCheckbox';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldIsYul = () => {
  return (
    <ContractVerificationFormRow>
      <FormFieldCheckbox<FormFields, 'is_yul'>
        name="is_yul"
        label="Is Yul contract"
      />
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldIsYul);
