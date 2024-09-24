import { FormControl, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import { EMAIL_REGEXP } from 'lib/validations/email';
import IconSvg from 'ui/shared/IconSvg';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  isReadOnly?: boolean;
}

const MyProfileFieldsEmail = ({ isReadOnly }: Props) => {
  const { control } = useFormContext<FormFields>();
  const { field, fieldState, formState } = useController<FormFields, 'email'>({
    control,
    name: 'email',
    rules: { required: true, pattern: EMAIL_REGEXP },
  });

  const isDisabled = formState.isSubmitting;

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
          bgColor="dialog_bg"
        />
        <InputPlaceholder text="Email" error={ fieldState.error }/>
        { !formState.isDirty && (
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
