import type { FormControlProps } from '@chakra-ui/react';
import type React from 'react';
import type { ControllerRenderProps, FieldValues, Path, RegisterOptions } from 'react-hook-form';

export interface FormFieldPropsBase<
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
> {
  name: Name;
  placeholder: string;
  isReadOnly?: boolean;
  isRequired?: boolean;
  rules?: Omit<RegisterOptions<FormFields, Name>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
  onBlur?: () => void;
  onChange?: () => void;
  type?: HTMLInputElement['type'];
  rightElement?: ({ field }: { field: ControllerRenderProps<FormFields, Name> }) => React.ReactNode;
  max?: HTMLInputElement['max'];

  // styles
  size?: FormControlProps['size'];
  bgColor?: FormControlProps['bgColor'];
  maxH?: FormControlProps['maxH'];
  minH?: FormControlProps['minH'];
  className?: string;
}
