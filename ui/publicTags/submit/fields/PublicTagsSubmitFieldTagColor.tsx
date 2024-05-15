import { Circle, FormControl, Input, InputGroup, InputRightElement, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useFormContext, type FieldError, type UseFormRegister } from 'react-hook-form';

import type { FormFields } from '../types';

import useIsMobile from 'lib/hooks/useIsMobile';
import { validator as colorValidator } from 'lib/validations/color';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

type ColorFieldTypes = 'bgColor' | 'textColor';

interface Props<Type extends ColorFieldTypes> {
  fieldType: Type;
  fieldName: `tags.${ number }.${ Type }`;
  index: number;
  isDisabled: boolean;
  register: UseFormRegister<FormFields>;
  error: FieldError | undefined;
  placeholder: string;
}

const PublicTagsSubmitFieldTagColor = <Type extends ColorFieldTypes>({ isDisabled, error, fieldName, placeholder, fieldType }: Props<Type>) => {
  const { getValues, register } = useFormContext<FormFields>();

  const circleBgColorDefault = {
    bgColor: useColorModeValue('gray.100', 'gray.700'),
    textColor: useColorModeValue('blackAlpha.800', 'whiteAlpha.800'),
  };
  const isMobile = useIsMobile();
  const field = register(fieldName, { validate: colorValidator, maxLength: 6 });
  const value = getValues(fieldName);

  return (
    <FormControl variant="floating" size={{ base: 'md', lg: 'lg' }}>
      <InputGroup size={ isMobile ? 'md' : 'lg' }>
        <Input
          { ...field }
          isInvalid={ Boolean(error) }
          isDisabled={ isDisabled }
          autoComplete="off"
          maxLength={ 6 }
        />
        <InputPlaceholder text={ placeholder } error={ error }/>
        <InputRightElement w="30px" right={ 4 } zIndex={ 10 }>
          <Circle
            size="30px"
            bgColor={ value && colorValidator(value) === true ? `#${ value }` : circleBgColorDefault[fieldType] }
            borderColor="gray.300"
            borderWidth="1px"
          />
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
};

export default React.memo(PublicTagsSubmitFieldTagColor);
