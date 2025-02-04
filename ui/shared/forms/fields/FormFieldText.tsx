import type { ChakraProps } from '@chakra-ui/react';
import { FormControl, Input, InputGroup, InputRightElement, Textarea, chakra, shouldForwardProp } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import FormInputPlaceholder from '../inputs/FormInputPlaceholder';

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
  rightElement,
  asComponent,
  max,

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
  const input = (
    <Component
      { ...field }
      onBlur={ handleBlur }
      isInvalid={ Boolean(fieldState.error) }
      isDisabled={ isDisabled }
      isReadOnly={ isReadOnly }
      autoComplete="off"
      type={ type }
      placeholder=" "
      max={ max }
      size={ size }
      bgColor={ bgColor }
      minH={ minH }
      maxH={ maxH }
    />
  );
  const inputPlaceholder = size !== 'xs' && <FormInputPlaceholder text={ placeholder } error={ fieldState.error }/>;

  return (
    <FormControl
      className={ className }
      variant="floating"
      isDisabled={ isDisabled }
      isRequired={ isRequired }
      size={ size }
      bgColor={ bgColor }
    >
      { rightElement ? (
        <InputGroup>
          { input }
          { inputPlaceholder }
          <InputRightElement h="100%"> { rightElement({ field }) } </InputRightElement>
        </InputGroup>
      ) : (
        <>
          { input }
          { inputPlaceholder }
        </>
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
>(props: Props<FormFields, Name> & ChakraProps) => React.JSX.Element;

export default React.memo(WrappedFormFieldText) as WrappedComponent;
