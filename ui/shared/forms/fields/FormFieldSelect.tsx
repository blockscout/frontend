import React from 'react';
import type { Path, FieldValues } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import type { SelectProps } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';

import getFieldErrorText from '../utils/getFieldErrorText';

type Props<
  FormFields extends FieldValues,
  Name extends Path<FormFields>,
> = FormFieldPropsBase<FormFields, Name> & SelectProps;

const FormFieldSelect = <
  FormFields extends FieldValues,
  Name extends Path<FormFields>,
>(props: Props<FormFields, Name>) => {
  const { name, rules, size = 'lg', ...rest } = props;

  const { control } = useFormContext<FormFields>();
  const { field, fieldState, formState } = useController<FormFields, typeof name>({
    control,
    name,
    rules,
  });

  const isDisabled = formState.isSubmitting;

  const handleChange = React.useCallback(({ value }: { value: Array<string> }) => {
    field.onChange(value);
  }, [ field ]);

  const handleBlur = React.useCallback(() => {
    field.onBlur();
  }, [ field ]);

  return (
    <Select
      ref={ field.ref }
      name={ field.name }
      value={ field.value }
      onBlur={ field.onBlur }
      onValueChange={ handleChange }
      onInteractOutside={ handleBlur }
      disabled={ isDisabled }
      invalid={ Boolean(fieldState.error) }
      errorText={ getFieldErrorText(fieldState.error) }
      size={ size }
      { ...rest }
    />
  );
};

export default React.memo(FormFieldSelect) as typeof FormFieldSelect;
