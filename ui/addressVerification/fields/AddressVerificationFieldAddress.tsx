import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { AddressVerificationFormFields } from '../types';

import { ADDRESS_REGEXP, ADDRESS_LENGTH } from 'lib/validations/address';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  isDisabled?: boolean;
}

const AddressVerificationFieldAddress = ({ isDisabled }: Props) => {
  const { formState, control } = useFormContext<AddressVerificationFormFields>();

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<AddressVerificationFormFields, 'address'>}) => {
    const error = 'address' in formState.errors ? formState.errors.address : undefined;

    return (
      <FormControl variant="floating" id={ field.name } isRequired size="md">
        <Input
          { ...field }
          required
          isInvalid={ Boolean(error) }
          maxLength={ ADDRESS_LENGTH }
          isDisabled={ isDisabled || formState.isSubmitting }
          autoComplete="off"
        />
        <InputPlaceholder text="Smart contract address (0x...)" error={ error }/>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting, isDisabled ]);

  return (
    <Controller
      name="address"
      control={ control }
      render={ renderControl }
      rules={{ required: true, pattern: ADDRESS_REGEXP }}
    />
  );
};

export default React.memo(AddressVerificationFieldAddress);
