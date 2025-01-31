import type { ChakraProps } from '@chakra-ui/react';
import { chakra, Checkbox } from '@chakra-ui/react';
import React from 'react';
import { useController, useFormContext, type FieldValues, type Path } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

interface Props<
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
> extends Omit<FormFieldPropsBase<FormFields, Name>, 'size' | 'bgColor' | 'placeholder'> {
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
  isReadOnly,
  className,
}: Props<FormFields, Name>) => {
  const { control } = useFormContext<FormFields>();
  const { field, formState } = useController<FormFields, typeof name>({
    control,
    name,
    rules,
  });

  const isDisabled = formState.isSubmitting;

  const handleChange: typeof field.onChange = React.useCallback((...args) => {
    field.onChange(...args);
    onChange?.();
  }, [ field, onChange ]);

  return (
    <Checkbox
      ref={ field.ref }
      isChecked={ field.value }
      className={ className }
      onChange={ handleChange }
      colorScheme="blue"
      size="lg"
      isDisabled={ isDisabled }
      isReadOnly={ isReadOnly }
    >
      { label }
    </Checkbox>
  );
};

const WrappedFormFieldCheckbox = chakra(FormFieldCheckbox);

export type WrappedComponent = <
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
>(props: Props<FormFields, Name> & ChakraProps) => React.JSX.Element;

export default React.memo(WrappedFormFieldCheckbox) as WrappedComponent;
