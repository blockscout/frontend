import type { ChakraProps } from '@chakra-ui/react';
import { FormControl, Input, chakra, shouldForwardProp } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import FormInputPlaceholder from '../FormInputPlaceholder';

const FormFieldText = <
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
>({
  name,
  placeholder,
  isReadOnly,
  isRequired,
  rules,
  onBlur,
  type = 'text',
  className,
  size = 'md',
  bgColor,
}: FormFieldPropsBase<FormFields, Name>) => {
  const { control } = useFormContext<FormFields>();
  const { field, fieldState, formState } = useController<FormFields, typeof name>({
    control,
    name,
    rules: { ...rules, required: isRequired },
  });

  const isDisabled = formState.isSubmitting;

  const handleBlur = React.useCallback(() => {
    field.onBlur();
    onBlur?.();
  }, [ field, onBlur ]);

  return (
    <FormControl
      className={ className }
      variant="floating"
      isDisabled={ isDisabled }
      isRequired={ isRequired }
      size={ size }
      bgColor={ bgColor }
    >
      <Input
        { ...field }
        onBlur={ handleBlur }
        isInvalid={ Boolean(fieldState.error) }
        isDisabled={ isDisabled }
        isReadOnly={ isReadOnly }
        autoComplete="off"
        type={ type }
        placeholder=" "
        size={ size }
        bgColor={ bgColor }
      />
      { size !== 'xs' && (
        <FormInputPlaceholder text={ placeholder } error={ fieldState.error }/>
      ) }
    </FormControl>
  );
};

const WrappedFormFieldText = chakra(FormFieldText, {
  shouldForwardProp: (prop) => {
    const isChakraProp = !shouldForwardProp(prop);

    if (isChakraProp && ![ 'bgColor', 'size' ].includes(prop)) {
      return false;
    }

    return true;
  },
});

export type WrappedComponent = <
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
>(props: FormFieldPropsBase<FormFields, Name> & ChakraProps) => JSX.Element;

export default React.memo(WrappedFormFieldText) as WrappedComponent;
