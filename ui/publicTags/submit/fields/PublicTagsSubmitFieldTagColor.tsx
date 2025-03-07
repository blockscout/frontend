import { Circle, FormControl, Input, InputGroup, InputRightElement, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { useFormContext, type FieldError } from 'react-hook-form';

import type { FormFields } from '../types';

import useIsMobile from 'lib/hooks/useIsMobile';
import FormInputPlaceholder from 'ui/shared/forms/inputs/FormInputPlaceholder';
import { validator as colorValidator } from 'ui/shared/forms/validators/color';

type ColorFieldTypes = 'bgColor' | 'textColor';

interface Props<Type extends ColorFieldTypes> {
  fieldType: Type;
  fieldName: `tags.${ number }.${ Type }`;
  error: FieldError | undefined;
  placeholder: string;
}

const PublicTagsSubmitFieldTagColor = <Type extends ColorFieldTypes>({ error, fieldName, placeholder, fieldType }: Props<Type>) => {
  const { register, formState } = useFormContext<FormFields>();

  const isDisabled = formState.isSubmitting;

  const circleBgColorDefault = {
    bgColor: useColorModeValue('gray.100', 'gray.700'),
    textColor: useColorModeValue('blackAlpha.800', 'whiteAlpha.800'),
  };
  const isMobile = useIsMobile();
  const field = register(fieldName, { validate: colorValidator, maxLength: 7 });
  const [ value, setValue ] = React.useState('');

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = (() => {
      const value = event.target.value;
      if (value) {
        if (value.length === 1 && value[0] !== '#') {
          return `#${ value }`;
        }
      }
      return value;
    })();
    setValue(nextValue);
    field.onChange(event);
  }, [ field ]);

  return (
    <FormControl variant="floating" size={{ base: 'md', lg: 'lg' }}>
      <InputGroup size={ isMobile ? 'md' : 'lg' }>
        <Input
          { ...field }
          onChange={ handleChange }
          value={ value }
          isInvalid={ Boolean(error) }
          isDisabled={ isDisabled }
          autoComplete="off"
          maxLength={ 7 }
        />
        <FormInputPlaceholder text={ placeholder } error={ error }/>
        <InputRightElement w="30px" h="auto" right={ 4 } top="50%" transform="translateY(-50%)" zIndex={ 10 }>
          <Circle
            size="30px"
            bgColor={ value && colorValidator(value) === true ? value : circleBgColorDefault[fieldType] }
            borderColor="gray.300"
            borderWidth="1px"
          />
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
};

export default React.memo(PublicTagsSubmitFieldTagColor);
