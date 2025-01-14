import type { HTMLChakraProps } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import { Field } from 'toolkit/chakra/field';
import { Input } from 'toolkit/chakra/input';
import { Textarea } from 'toolkit/chakra/textarea';

import getFieldErrorText from '../utils/getFieldErrorText';

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
  rules,
  onBlur,
  rightElement,
  inputProps,
  asComponent,
  size = 'xl',
  disabled,
  ...restProps
}: Props<FormFields, Name>) => {
  const { control } = useFormContext<FormFields>();
  const { field, fieldState, formState } = useController<FormFields, typeof name>({
    control,
    name,
    rules: { ...rules, required: restProps.required },
  });

  const handleBlur = React.useCallback(() => {
    field.onBlur();
    onBlur?.();
  }, [ field, onBlur ]);

  const input = asComponent === 'Textarea' ? (
    <Textarea
      { ...field }
      autoComplete="off"
      { ...inputProps as HTMLChakraProps<'textarea'> }
      onBlur={ handleBlur }
    />
  ) : (
    <Input
      { ...field }
      autoComplete="off"
      { ...inputProps as HTMLChakraProps<'input'> }
      onBlur={ handleBlur }
    />
  );

  return (
    <Field
      label={ placeholder }
      errorText={ getFieldErrorText(fieldState.error) }
      invalid={ Boolean(fieldState.error) }
      disabled={ formState.isSubmitting || disabled }
      size={ size }
      floating
      { ...restProps }
    >
      { input }
    </Field>
  );

  // TODO @tom2drum add input group

  // return (
  //   <FormControl
  //     className={ className }
  //     variant="floating"
  //     isDisabled={ isDisabled }
  //     isRequired={ isRequired }
  //     size={ size }
  //     bgColor={ bgColor }
  //   >
  //     { rightElement ? (
  //       <InputGroup>
  //         { input }
  //         { inputPlaceholder }
  //         <InputRightElement h="100%"> { rightElement({ field }) } </InputRightElement>
  //       </InputGroup>
  //     ) : (
  //       <>
  //         { input }
  //         { inputPlaceholder }
  //       </>
  //     ) }
  //   </FormControl>
  // );
};

export default React.memo(FormFieldText) as typeof FormFieldText;
