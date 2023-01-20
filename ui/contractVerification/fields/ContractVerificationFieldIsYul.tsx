import { GridItem } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { FormFields } from '../types';

import CheckboxInput from 'ui/shared/CheckboxInput';

interface Props {
  control: Control<FormFields>;
}

const ContractVerificationFieldIsYul = ({ control }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'is_yul'>}) => (
    <CheckboxInput<FormFields, 'is_yul'> text="Is Yul contract" field={ field }/>
  ), []);

  return (
    <>
      <GridItem>
        <Controller
          name="is_yul"
          control={ control }
          render={ renderControl }
        />
      </GridItem>
      <GridItem/>
    </>
  );
};

export default React.memo(ContractVerificationFieldIsYul);
