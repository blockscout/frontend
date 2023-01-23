import React from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { FormFields } from '../types';

import CheckboxInput from 'ui/shared/CheckboxInput';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  control: Control<FormFields>;
}

const ContractVerificationFieldIsYul = ({ control }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'is_yul'>}) => (
    <CheckboxInput<FormFields, 'is_yul'> text="Is Yul contract" field={ field }/>
  ), []);

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
