import { FormControl, Textarea } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps, FormState } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { AddressVerificationFormSecondStepFields, RootFields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

type Fields = RootFields & AddressVerificationFormSecondStepFields;

interface Props {
  formState: FormState<Fields>;
  control: Control<Fields>;
}

const AddressVerificationFieldMessage = ({ formState, control }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<Fields, 'message'>}) => {
    const error = 'message' in formState.errors ? formState.errors.message : undefined;

    return (
      <FormControl variant="floating" id={ field.name } isRequired size="md">
        <Textarea
          { ...field }
          required
          isInvalid={ Boolean(error) }
          isDisabled
          autoComplete="off"
          maxH="105px"
        />
        <InputPlaceholder text="Message to sign" error={ error }/>
      </FormControl>
    );
  }, [ formState.errors ]);

  return (
    <Controller
      defaultValue="some value"
      name="message"
      control={ control }
      render={ renderControl }
      rules={{ required: true }}
    />
  );
};

export default React.memo(AddressVerificationFieldMessage);
