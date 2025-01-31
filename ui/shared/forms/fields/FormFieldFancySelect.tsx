import React from 'react';
import type { Path, FieldValues } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

// import type { Option } from 'ui/shared/forms/inputs/select/types';
import useIsMobile from 'lib/hooks/useIsMobile';
import type { Props as FancySelectProps } from 'ui/shared/forms/inputs/select/FancySelect';
import FancySelect from 'ui/shared/forms/inputs/select/FancySelect';

// FIXME: Try to get this to work to add more constraints to the props type
// this type only works for plain objects, not for nested objects or arrays (e.g. ui/publicTags/submit/types.ts:FormFields)
// type SelectField<O> = { [K in keyof O]: NonNullable<O[K]> extends Option ? K : never }[keyof O];

type Props<
  FormFields extends FieldValues,
  Name extends Path<FormFields>,
> = Omit<FormFieldPropsBase<FormFields, Name>, 'bgColor' | 'size'> & Partial<FancySelectProps> & {
  size?: 'md' | 'lg';
};

const FormFieldFancySelect = <
  FormFields extends FieldValues,
  Name extends Path<FormFields>,
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
      { ...props }
      size={ props.size || defaultSize }
      error={ fieldState.error }
      isDisabled={ isDisabled }
    />
  );
};

export default React.memo(FormFieldFancySelect) as typeof FormFieldFancySelect;
