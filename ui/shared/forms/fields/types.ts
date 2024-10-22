import type { FormControlProps } from '@chakra-ui/react';
import type { FieldValues, Path, RegisterOptions } from 'react-hook-form';

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

  // styles
  size?: FormControlProps['size'];
  bgColor?: FormControlProps['bgColor'];
  className?: string;
}
