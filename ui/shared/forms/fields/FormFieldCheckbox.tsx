import React from 'react';
import { useController, useFormContext, type FieldValues, type Path } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import type { CheckboxProps } from 'toolkit/chakra/checkbox';
import { Checkbox } from 'toolkit/chakra/checkbox';

interface Props<
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
> extends Pick<FormFieldPropsBase<FormFields, Name>, 'rules' | 'name' | 'onChange' | 'readOnly'>, Omit<CheckboxProps, 'name' | 'onChange'> {
  label: string;
}

const FormFieldCheckbox = <
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
>({
  name,
  label,
  rules,
  onChange,
  readOnly,
  ...rest
}: Props<FormFields, Name>) => {
  const { control } = useFormContext<FormFields>();
  const { field, formState } = useController<FormFields, typeof name>({
    control,
    name,
    rules,
  });

  const isDisabled = formState.isSubmitting;

  const handleChange: typeof field.onChange = React.useCallback(({ checked }: { checked: boolean }) => {
    field.onChange(checked);
    onChange?.();
  }, [ field, onChange ]);

  return (
    <Checkbox
      ref={ field.ref }
      checked={ field.value }
      onCheckedChange={ handleChange }
      size="md"
      disabled={ isDisabled }
      { ...rest }
    >
      { label }
    </Checkbox>
  );
};

export default React.memo(FormFieldCheckbox) as typeof FormFieldCheckbox;
