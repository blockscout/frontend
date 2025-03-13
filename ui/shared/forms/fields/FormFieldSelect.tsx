import React from 'react';
import type { Path, FieldValues } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import type { SelectRootProps } from 'toolkit/chakra/select';
import { SelectContent, SelectControl, SelectItem, SelectRoot, SelectValueText } from 'toolkit/chakra/select';

type Props<
  FormFields extends FieldValues,
  Name extends Path<FormFields>,
> = FormFieldPropsBase<FormFields, Name> & SelectRootProps;

const FormFieldSelect = <
  FormFields extends FieldValues,
  Name extends Path<FormFields>,
>(props: Props<FormFields, Name>) => {
  const { name, rules, collection, placeholder, ...rest } = props;

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
    <SelectRoot
      ref={ field.ref }
      name={ field.name }
      value={ field.value }
      onValueChange={ handleChange }
      onInteractOutside={ handleBlur }
      collection={ collection }
      disabled={ isDisabled }
      invalid={ Boolean(fieldState.error) }
      { ...rest }
    >
      <SelectControl>
        <SelectValueText placeholder={ placeholder }/>
      </SelectControl>
      <SelectContent>
        { collection.items.map((item) => (
          <SelectItem item={ item } key={ item.value }>
            { item.label }
          </SelectItem>
        )) }
      </SelectContent>
    </SelectRoot>
  );
};

export default React.memo(FormFieldSelect) as typeof FormFieldSelect;
