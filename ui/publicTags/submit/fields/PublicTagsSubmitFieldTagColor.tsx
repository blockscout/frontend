import { FormControl, Input, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { FieldError, FieldErrorsImpl, Merge, UseFormRegister } from 'react-hook-form';

import type { FormFieldTag, FormFields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  fieldName: 'textColor' | 'bgColor';
  index: number;
  isDisabled: boolean;
  register: UseFormRegister<FormFields>;
  errors: Merge<FieldError, FieldErrorsImpl<FormFieldTag>> | undefined;
  placeholder: string;
}

const PublicTagsSubmitFieldTagColor = ({ index, isDisabled, register, errors, fieldName, placeholder }: Props) => {
  const inputBgColor = useColorModeValue('white', 'black');

  return (
    <FormControl variant="floating" size={{ base: 'md', lg: 'lg' }}>
      <Input
        { ...register(`tags.${ index }.${ fieldName }`) }
        isInvalid={ Boolean(errors?.[fieldName]) }
        isDisabled={ isDisabled }
        autoComplete="off"
        bgColor={ inputBgColor }
      />
      <InputPlaceholder text={ placeholder } error={ errors?.[fieldName] }/>
    </FormControl>
  );
};

export default React.memo(PublicTagsSubmitFieldTagColor);
