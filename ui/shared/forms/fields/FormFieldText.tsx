import React from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import { Field } from 'toolkit/chakra/field';
import type { InputProps } from 'toolkit/chakra/input';
import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import type { TextareaProps } from 'toolkit/chakra/textarea';
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
  group,
  inputProps,
  asComponent,
  size: sizeProp,
  disabled,
  floating: floatingProp,
  ...restProps
}: Props<FormFields, Name>) => {
  const defaultSize = asComponent === 'Textarea' ? '2xl' : 'lg';
  const size = sizeProp || defaultSize;
  const floating = floatingProp !== undefined ? floatingProp : size === defaultSize;

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
      flexGrow={ 1 }
      { ...inputProps as TextareaProps }
      onBlur={ handleBlur }
    />
  ) : (
    <Input
      { ...field }
      autoComplete="off"
      // for non-floating field label, we pass placeholder to the input component
      placeholder={ !floating ? placeholder : undefined }
      { ...inputProps as InputProps }
      onBlur={ handleBlur }
    />
  );

  const content = group ? (
    <InputGroup
      { ...group }
      endElement={ typeof group.endElement === 'function' ? group.endElement({ field }) : group.endElement }
    >
      { input }
    </InputGroup>
  ) : input;

  return (
    <Field
      // for floating field label, we pass placeholder value to the label
      label={ floating ? placeholder : undefined }
      errorText={ getFieldErrorText(fieldState.error) }
      invalid={ Boolean(fieldState.error) }
      disabled={ formState.isSubmitting || disabled }
      size={ size }
      floating={ floating }
      { ...restProps }
    >
      { content }
    </Field>
  );
};

export default React.memo(FormFieldText) as typeof FormFieldText;
