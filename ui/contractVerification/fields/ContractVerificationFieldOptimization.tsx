import { FormControl, GridItem, Input } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { FormFields } from '../types';

import CheckboxInput from 'ui/shared/CheckboxInput';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  control: Control<FormFields>;
}

const ContractVerificationFieldOptimization = ({ control }: Props) => {
  const [ isEnabled, setIsEnabled ] = React.useState(false);

  const handleCheckboxChange = React.useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  const renderCheckboxControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'is_optimization_enabled'>}) => (
    <CheckboxInput<FormFields, 'is_optimization_enabled'> text="Optimization enabled" field={ field } onChange={ handleCheckboxChange }/>
  ), [ handleCheckboxChange ]);

  const renderInputControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'optimization_runs'>}) => {
    return (
      <FormControl variant="floating" id={ field.name } size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          required
          maxLength={ 255 }
        />
        <InputPlaceholder text="Optimization runs"/>
      </FormControl>
    );
  }, []);

  return (
    <>
      <GridItem>
        <Controller
          name="is_optimization_enabled"
          control={ control }
          render={ renderCheckboxControl }
        />
      </GridItem>
      <GridItem/>
      { isEnabled && (
        <>
          <GridItem>
            <Controller
              name="optimization_runs"
              control={ control }
              render={ renderInputControl }
            />
          </GridItem>
          <GridItem/>
        </>
      ) }
    </>
  );
};

export default React.memo(ContractVerificationFieldOptimization);
