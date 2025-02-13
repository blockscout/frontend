import type React from 'react';
import type { ControllerRenderProps, FieldValues, Path, RegisterOptions } from 'react-hook-form';

import type { FieldProps } from 'toolkit/chakra/field';
import type { InputProps } from 'toolkit/chakra/input';
import type { TextareaProps } from 'toolkit/chakra/textarea';

export interface FormFieldPropsBase<
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
> extends Omit<FieldProps, 'children'> {
  name: Name;
  placeholder: string;
  rules?: Omit<RegisterOptions<FormFields, Name>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  onBlur?: () => void;
  onChange?: () => void;
  rightElement?: ({ field }: { field: ControllerRenderProps<FormFields, Name> }) => React.ReactNode;
  inputProps?: InputProps | TextareaProps;
}
