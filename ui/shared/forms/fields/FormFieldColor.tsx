import type { BoxProps } from '@chakra-ui/react';
import { Circle } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import { Field } from 'toolkit/chakra/field';
import type { InputProps } from 'toolkit/chakra/input';
import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import { validator as colorValidator } from 'ui/shared/forms/validators/color';

import getFieldErrorText from '../utils/getFieldErrorText';

interface Props<
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
> extends FormFieldPropsBase<FormFields, Name> {
  sampleDefaultBgColor?: BoxProps['bgColor'];
}

const FormFieldColor = <
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
>({
  name,
  placeholder,
  rules,
  onBlur,
  group,
  inputProps,
  size = 'lg',
  disabled,
  sampleDefaultBgColor,
  ...restProps
}: Props<FormFields, Name>) => {
  const { control } = useFormContext<FormFields>();
  const { field, fieldState, formState } = useController<FormFields, typeof name>({
    control,
    name,
    rules: {
      ...rules,
      required: restProps.required,
      validate: colorValidator,
      maxLength: 7,
    },
  });

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
    field.onChange(nextValue);
  }, [ field ]);

  const handleBlur = React.useCallback(() => {
    field.onBlur();
    onBlur?.();
  }, [ field, onBlur ]);

  const endElement = (
    <Circle
      size="30px"
      bgColor={ field.value && colorValidator(field.value) === true ? field.value : sampleDefaultBgColor }
      borderColor="gray.300"
      borderWidth="1px"
      mx="15px"
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
      <InputGroup
        { ...group }
        endElement={ endElement }
      >
        <Input
          { ...field }
          autoComplete="off"
          onBlur={ handleBlur }
          onChange={ handleChange }
          value={ value }
          { ...inputProps as InputProps }
        />
      </InputGroup>
    </Field>
  );
};

export default React.memo(FormFieldColor) as typeof FormFieldColor;
