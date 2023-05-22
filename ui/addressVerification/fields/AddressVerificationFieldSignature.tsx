import { FormControl, Input, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps, FormState } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { AddressVerificationFormSecondStepFields, RootFields } from '../types';

import { SIGNATURE_REGEXP } from 'lib/validations/signature';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

type Fields = RootFields & AddressVerificationFormSecondStepFields;

interface Props {
  formState: FormState<Fields>;
  control: Control<Fields>;
}

const AddressVerificationFieldSignature = ({ formState, control }: Props) => {
  const backgroundColor = useColorModeValue('white', 'gray.900');

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<Fields, 'signature'>}) => {
    const error = 'signature' in formState.errors ? formState.errors.signature : undefined;

    return (
      <FormControl variant="floating" id={ field.name } isRequired size="md" backgroundColor={ backgroundColor }>
        <Input
          { ...field }
          required
          isInvalid={ Boolean(error) }
          isDisabled={ formState.isSubmitting }
          autoComplete="off"
        />
        <InputPlaceholder text="Signature hash" error={ error }/>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting, backgroundColor ]);

  return (
    <Controller
      name="signature"
      control={ control }
      render={ renderControl }
      rules={{ required: true, pattern: SIGNATURE_REGEXP }}
    />
  );
};

export default React.memo(AddressVerificationFieldSignature);
