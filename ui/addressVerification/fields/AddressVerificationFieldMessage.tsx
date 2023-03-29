import { FormControl, Textarea } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { AddressVerificationFormFields } from '../types';

import dayjs from 'lib/date/dayjs';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  isDisabled?: boolean;
}

const AddressVerificationFieldMessage = ({ isDisabled }: Props) => {
  const { formState, control, getValues } = useFormContext<AddressVerificationFormFields>();

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<AddressVerificationFormFields, 'message'>}) => {
    const error = 'message' in formState.errors ? formState.errors.message : undefined;

    return (
      <FormControl variant="floating" id={ field.name } isRequired size="md">
        <Textarea
          { ...field }
          required
          isInvalid={ Boolean(error) }
          isDisabled={ isDisabled || formState.isSubmitting }
          autoComplete="off"
          maxH="105px"
        />
        <InputPlaceholder text="Message to sign" error={ error }/>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting, isDisabled ]);

  const address = getValues('address');
  // eslint-disable-next-line max-len
  const defaultValue = `[Blockscout.com] [${ dayjs().format('YYYY-MM-DD HH:mm:ss') }] I, hereby verify that I am the owner/creator of the address [${ address }]`;

  return (
    <Controller
      defaultValue={ defaultValue }
      name="message"
      control={ control }
      render={ renderControl }
      rules={{ required: true }}
    />
  );
};

export default React.memo(AddressVerificationFieldMessage);
