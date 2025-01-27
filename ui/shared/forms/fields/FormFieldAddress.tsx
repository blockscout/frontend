import type { ChakraProps } from '@chakra-ui/react';
import React from 'react';
import type { FieldValues, Path } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';
import type { PartialBy } from 'types/utils';

import { addressValidator } from '../validators/address';
import FormFieldText from './FormFieldText';

const FormFieldAddress = <FormFields extends FieldValues>(
  props: PartialBy<FormFieldPropsBase<FormFields>, 'placeholder'>,
) => {
  const rules = React.useMemo(
    () => ({
      ...props.rules,
      validate: {
        ...props.rules?.validate,
        address: addressValidator,
      },
    }),
    [ props.rules ],
  );

  return (
    <FormFieldText
      { ...props }
      placeholder={ props.placeholder || 'Address (0x...)' }
      rules={ rules }
    />
  );
};

export type WrappedComponent = <
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
>(props: PartialBy<FormFieldPropsBase<FormFields, Name>, 'placeholder'> & ChakraProps) => React.JSX.Element;

export default React.memo(FormFieldAddress) as WrappedComponent;
