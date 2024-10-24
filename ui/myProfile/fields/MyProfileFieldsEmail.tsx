import { FormControl, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import FormInputPlaceholder from 'ui/shared/forms/inputs/FormInputPlaceholder';
import { EMAIL_REGEXP } from 'ui/shared/forms/validators/email';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  isReadOnly?: boolean;
  defaultValue: string | undefined;
}

const MyProfileFieldsEmail = ({ isReadOnly, defaultValue }: Props) => {
  const { control } = useFormContext<FormFields>();
  const { field, fieldState, formState } = useController<FormFields, 'email'>({
    control,
    name: 'email',
    rules: { required: true, pattern: EMAIL_REGEXP },
  });

  const isDisabled = formState.isSubmitting;
  const isVerified = defaultValue && field.value === defaultValue;

  return (
    <FormControl variant="floating" isDisabled={ isDisabled } isRequired size="md">
      <InputGroup>
        <Input
          { ...field }
          required
          isInvalid={ Boolean(fieldState.error) }
          isDisabled={ isDisabled }
          isReadOnly={ isReadOnly }
          autoComplete="off"
        />
        <FormInputPlaceholder text="Email" error={ fieldState.error }/>
        { isVerified && (
          <InputRightElement h="100%">
            <IconSvg name="certified" boxSize={ 5 } color="green.500"/>
          </InputRightElement>
        ) }
      </InputGroup>
      <Text variant="secondary" mt={ 1 } fontSize="sm">Email for watch list notifications and private tags</Text>
    </FormControl>
  );
};

export default React.memo(MyProfileFieldsEmail);
