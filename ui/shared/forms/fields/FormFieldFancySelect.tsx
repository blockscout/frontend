import type { Props as SelectProps, GroupBase } from 'chakra-react-select';
import React from 'react';
import type { Path, FieldValues } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';
import type { Option } from 'ui/shared/FancySelect/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import FancySelect from 'ui/shared/FancySelect/FancySelect';

// FIXME: Try to get this to work to add more constraints to the props type
// this type only works for plain objects, not for nested objects or arrays (e.g. ui/publicTags/submit/types.ts:FormFields)
// type SelectField<O> = { [K in keyof O]: NonNullable<O[K]> extends Option ? K : never }[keyof O];

type Components = SelectProps<Option, boolean, GroupBase<Option>>['components'];

interface Props<
  FormFields extends FieldValues,
  Name extends Path<FormFields>,
> extends Omit<FormFieldPropsBase<FormFields, Name>, 'bgColor' | 'size'> {
  size?: 'md' | 'lg';
  options: Array<Option>;
  isAsync?: boolean;
  isSearchable?: boolean;
  components?: Components;
}

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
      options={ props.options }
      size={ props.size || defaultSize }
      placeholder={ props.placeholder }
      error={ fieldState.error }
      isDisabled={ isDisabled }
      isReadOnly={ props.isReadOnly }
      isAsync={ props.isAsync }
      isSearchable={ props.isSearchable }
      components={ props.components }
    />
  );
};

export default React.memo(FormFieldFancySelect) as typeof FormFieldFancySelect;
