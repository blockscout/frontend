import { Circle, FormControl, Input, InputGroup, InputRightElement, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useFormContext, type FieldError, type UseFormRegister } from 'react-hook-form';

import type { FormFields } from '../types';

import useIsMobile from 'lib/hooks/useIsMobile';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  fieldName: `tags.${ number }.${ 'bgColor' | 'textColor' }`;
  index: number;
  isDisabled: boolean;
  register: UseFormRegister<FormFields>;
  error: FieldError | undefined;
  placeholder: string;
}

const COLOR_HEX_REGEXP = /^[A-Fa-f\d]{3,6}$/;

const validate = (value: string | undefined) => {
  if (!value || value.length === 0) {
    return true;
  }

  if (value.length !== 3 && value.length !== 6) {
    return 'Invalid length';
  }

  if (!COLOR_HEX_REGEXP.test(value)) {
    return 'Invalid hex code';
  }

  return true;
};

const PublicTagsSubmitFieldTagColor = ({ isDisabled, error, fieldName, placeholder }: Props) => {
  const { getValues, register } = useFormContext<FormFields>();
  const inputBgColor = useColorModeValue('white', 'black');
  const circleBgColorDefault = useColorModeValue('gray.100', 'gray.700');
  const isMobile = useIsMobile();
  const field = register(fieldName, { validate, maxLength: 6 });
  const value = getValues(fieldName);

  return (
    <FormControl variant="floating" size={{ base: 'md', lg: 'lg' }}>
      <InputGroup size={ isMobile ? 'md' : 'lg' }>
        <Input
          { ...field }
          isInvalid={ Boolean(error) }
          isDisabled={ isDisabled }
          autoComplete="off"
          bgColor={ inputBgColor }
          maxLength={ 6 }
        />
        <InputPlaceholder text={ placeholder } error={ error }/>
        <InputRightElement w="30px" right={ 4 } zIndex={ 10 }>
          <Circle
            size="30px"
            bgColor={ !value ? circleBgColorDefault : `#${ value }` }
            borderColor="gray.300"
            borderWidth="1px"
          />
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
};

export default React.memo(PublicTagsSubmitFieldTagColor);
