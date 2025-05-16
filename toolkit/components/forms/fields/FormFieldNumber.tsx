import React from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import { FormFieldText } from './FormFieldText';

const FormFieldNumberContent = <FormFields extends FieldValues>(
  { inputProps, ...rest }: FormFieldPropsBase<FormFields>,
) => {
  return <FormFieldText { ...rest } inputProps={{ type: 'number', ...inputProps }}/>;
};

export const FormFieldUrl = React.memo(FormFieldNumberContent) as typeof FormFieldNumberContent;
