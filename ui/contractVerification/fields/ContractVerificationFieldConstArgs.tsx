import { GridItem } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { FormFields } from '../types';

import CheckboxInput from 'ui/shared/CheckboxInput';

interface Props {
  control: Control<FormFields>;
}

const ContractVerificationFieldConstArgs = ({ control }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'constructor_args'>}) => (
    <CheckboxInput<FormFields, 'constructor_args'> text="Try to fetch constructor arguments automatically" field={ field }/>
  ), []);

  return (
    <>
      <GridItem>
        <Controller
          name="constructor_args"
          control={ control }
          render={ renderControl }
        />
      </GridItem>
      <GridItem/>
    </>
  );
};

export default React.memo(ContractVerificationFieldConstArgs);
