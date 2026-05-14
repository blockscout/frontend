// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import { Switch } from '../../../chakra/switch';
import type { SwitchProps } from '../../../chakra/switch';

export type FormFieldSwitchProps<
  FormFields extends FieldValues,
  Name extends Path<FormFields>,
> = Pick<
  FormFieldPropsBase<FormFields, Name>,
  'name' | 'rules' | 'controllerProps'
> &
  SwitchProps;

const FormFieldSwitchContent = <
  FormFields extends FieldValues,
  Name extends Path<FormFields>,
>({
  name,
  onCheckedChange,
  rules,
  controllerProps,
  disabled,
  children,
  ...rest
}: FormFieldSwitchProps<FormFields, Name>) => {
  const { control } = useFormContext<FormFields>();
  const { field, formState } = useController<FormFields, Name>({
    control,
    name,
    rules,
    ...controllerProps,
  });

  const handleCheckedChange = React.useCallback(({ checked }: { checked: boolean }) => {
    field.onChange(checked);
    onCheckedChange?.({ checked });
  }, [ field, onCheckedChange ],
  );

  return (
    <Switch
      name={ field.name }
      checked={ field.value }
      onCheckedChange={ handleCheckedChange }
      disabled={ formState.isSubmitting || disabled }
      inputProps={{ onBlur: field.onBlur }}
      { ...rest }
    >
      { children }
    </Switch>
  );
};

export const FormFieldSwitch = React.memo(FormFieldSwitchContent) as typeof FormFieldSwitchContent;
