import { Flex, Select } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import CheckboxInput from 'ui/shared/CheckboxInput';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  config: SmartContractVerificationConfig;
}

const ContractVerificationFieldZkOptimization = ({ config }: Props) => {
  const [ isEnabled, setIsEnabled ] = React.useState(false);
  const { formState, control } = useFormContext<FormFields>();

  const error = 'optimization_mode' in formState.errors ? formState.errors.optimization_mode : undefined;

  const handleCheckboxChange = React.useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  const renderCheckboxControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'is_optimization_enabled'>}) => (
    <Flex flexShrink={ 0 }>
      <CheckboxInput<FormFields, 'is_optimization_enabled'>
        text="Optimization enabled"
        field={ field }
        onChange={ handleCheckboxChange }
        isDisabled={ formState.isSubmitting }
      />
    </Flex>
  ), [ formState.isSubmitting, handleCheckboxChange ]);

  const renderInputControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'optimization_mode'>}) => {
    return (
      <Select
        size="xs"
        { ...field }
        w="auto"
        borderRadius="base"
        isDisabled={ formState.isSubmitting }
        placeholder="Optimization mode"
        isInvalid={ Boolean(error) }
      >
        { config.zk_optimization_modes?.map((value) => (
          <option key={ value } value={ value }>
            { value }
          </option>
        )) }
      </Select>
    );
  }, [ config.zk_optimization_modes, error, formState.isSubmitting ]);

  return (
    <ContractVerificationFormRow>
      <Flex columnGap={ 5 } rowGap={ 2 } h={{ base: 'auto', lg: '32px' }} flexDir={{ base: 'column', lg: 'row' }}>
        <Controller
          name="is_optimization_enabled"
          control={ control }
          render={ renderCheckboxControl }
        />
        { isEnabled && (
          <Controller
            name="optimization_mode"
            control={ control }
            render={ renderInputControl }
          />
        ) }
      </Flex>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldZkOptimization);
