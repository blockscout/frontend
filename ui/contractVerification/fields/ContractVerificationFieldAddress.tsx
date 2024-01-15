import { FormControl, Input, chakra } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import { ADDRESS_REGEXP, ADDRESS_LENGTH } from 'lib/validations/address';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  isReadOnly?: boolean;
}

const ContractVerificationFieldAddress = ({ isReadOnly }: Props) => {
  const { formState, control } = useFormContext<FormFields>();

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'address'>}) => {
    const error = 'address' in formState.errors ? formState.errors.address : undefined;

    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          required
          isInvalid={ Boolean(error) }
          maxLength={ ADDRESS_LENGTH }
          isDisabled={ formState.isSubmitting || isReadOnly }
          autoComplete="off"
        />
        <InputPlaceholder text="Smart contract / Address (0x...)" error={ error }/>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting, isReadOnly ]);

  return (
    <>
      <ContractVerificationFormRow>
        <chakra.span fontWeight={ 500 } fontSize="lg" fontFamily="heading">
          Contract address to verify
        </chakra.span>
      </ContractVerificationFormRow>
      <ContractVerificationFormRow mb={ 3 }>
        <Controller
          name="address"
          control={ control }
          render={ renderControl }
          rules={{ required: true, pattern: ADDRESS_REGEXP }}
        />
      </ContractVerificationFormRow>
    </>
  );
};

export default React.memo(ContractVerificationFieldAddress);
