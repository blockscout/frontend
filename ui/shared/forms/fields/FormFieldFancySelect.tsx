import React from 'react';
import type { Path, FieldValues } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';
import type { Option } from 'ui/shared/FancySelect/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import FancySelect from 'ui/shared/FancySelect/FancySelect';

type SelectFields<O> = { [K in keyof O]: NonNullable<O[K]> extends Option ? K : never }[keyof O];

interface Props<
  FormFields extends FieldValues,
  Name extends Path<FormFields> & SelectFields<FormFields>,
> extends Omit<FormFieldPropsBase<FormFields, Name>, 'bgColor' | 'size'> {
  size?: 'md' | 'lg';
  options: Array<Option>;
}

const FormFieldFancySelect = <
  FormFields extends FieldValues,
  Name extends Path<FormFields> & SelectFields<FormFields>,
>(props: Props<FormFields, Name>) => {
  const isMobile = useIsMobile();
  const defaultSize = isMobile ? 'md' : 'lg';

  const { control } = useFormContext<FormFields>();
  const { field, fieldState, formState } = useController<FormFields, typeof props.name>({
    control,
    name: props.name,
    rules: { ...props.rules, required: props.isRequired },
  });

  const isDisabled = formState.isSubmitting;

  return (
    <FancySelect
      { ...field }
      options={ props.options }
      size={ props.size || defaultSize }
      placeholder={ props.placeholder }
      isDisabled={ isDisabled }
      isReadOnly={ props.isReadOnly }
      error={ fieldState.error }
    />
  );
};

export default React.memo(FormFieldFancySelect) as typeof FormFieldFancySelect;
