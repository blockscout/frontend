import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { useFormContext, Controller } from 'react-hook-form';

import type { FormFields } from '../types';

import CheckboxInput from 'ui/shared/CheckboxInput';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldIsYul = () => {
  const { formState, control } = useFormContext<FormFields>();

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'is_yul'>}) => (
    <CheckboxInput<FormFields, 'is_yul'> text="Is Yul contract" field={ field } isDisabled={ formState.isSubmitting }/>
  ), [ formState.isSubmitting ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name="is_yul"
        control={ control }
        render={ renderControl }
      />
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldIsYul);
