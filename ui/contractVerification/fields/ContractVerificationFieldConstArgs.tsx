import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import CheckboxInput from 'ui/shared/CheckboxInput';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldConstArgs = () => {
  const { formState, control } = useFormContext<FormFields>();

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'constructor_args'>}) => (
    <CheckboxInput<FormFields, 'constructor_args'>
      text="Try to fetch constructor arguments automatically"
      field={ field }
      isDisabled={ formState.isSubmitting }
    />
  ), [ formState.isSubmitting ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name="constructor_args"
        control={ control }
        render={ renderControl }
      />
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldConstArgs);
