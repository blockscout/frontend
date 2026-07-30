// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import type { Path, FieldValues } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import type { DatePickerValueChangeDetails, DatePickerProps } from '../../../chakra/date-picker';
import { DatePicker } from '../../../chakra/date-picker';
import { getFormFieldErrorText } from '../utils/getFormFieldErrorText';
import { dateValidatorFactory } from '../validators/date';

export type FormFieldDateProps<
  FormFields extends FieldValues,
  Name extends Path<FormFields>,
> = FormFieldPropsBase<FormFields, Name> & DatePickerProps;

const FormFieldDateContent = <
  FormFields extends FieldValues,
  Name extends Path<FormFields>,
>(props: FormFieldDateProps<FormFields, Name>) => {
  const { name, rules: rulesProp, controllerProps, value, onValueChange, ...rest } = props;

  const { control } = useFormContext<FormFields>();

  const dateValidator = React.useMemo(
    () => dateValidatorFactory(rest.min, rest.max),
    [ rest.min, rest.max ],
  );

  const rules = React.useMemo(
    () => ({
      ...rulesProp,
      validate: {
        ...rulesProp?.validate,
        date: dateValidator,
      },
    }),
    [ rulesProp, dateValidator ],
  );

  const { field, fieldState, formState } = useController<FormFields, typeof name>({
    control,
    name,
    rules: { ...rules, required: rest.required },
    ...controllerProps,
  });

  const isDisabled = formState.isSubmitting;

  const handleChange = React.useCallback((details: DatePickerValueChangeDetails) => {
    field.onChange(details.value);
  }, [ field ]);

  return (
    <DatePicker
      ref={ field.ref }
      name={ field.name }
      value={ field.value }
      onBlur={ field.onBlur }
      onValueChange={ handleChange }
      disabled={ isDisabled }
      invalid={ Boolean(fieldState.error) }
      errorText={ getFormFieldErrorText(fieldState.error) }
      { ...rest }
    />
  );
};

export const FormFieldDate = React.memo(FormFieldDateContent) as typeof FormFieldDateContent;
