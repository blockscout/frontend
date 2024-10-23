import type { ChakraProps } from '@chakra-ui/react';
import { FormControl, Input, Textarea, chakra, shouldForwardProp } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import FormInputPlaceholder from '../FormInputPlaceholder';

interface Props<
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
> extends FormFieldPropsBase<FormFields, Name> {
  asComponent?: 'Input' | 'Textarea';
}

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
  asComponent,

  className,
  size = 'md',
  bgColor,
  minH,
  maxH,
}: Props<FormFields, Name>) => {
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

  const Component = asComponent === 'Textarea' ? Textarea : Input;

  return (
    <FormControl
      className={ className }
      variant="floating"
      isDisabled={ isDisabled }
      isRequired={ isRequired }
      size={ size }
      bgColor={ bgColor }
    >
      <Component
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
        minH={ minH }
        maxH={ maxH }
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

    if (isChakraProp && ![ 'bgColor', 'size', 'minH', 'maxH' ].includes(prop)) {
      return false;
    }

    return true;
  },
});

export type WrappedComponent = <
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
>(props: Props<FormFields, Name> & ChakraProps) => JSX.Element;

export default React.memo(WrappedFormFieldText) as WrappedComponent;
