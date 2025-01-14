import React from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';
import type { PartialBy } from 'types/utils';

import { EMAIL_REGEXP } from '../validators/email';
import FormFieldText from './FormFieldText';

const FormFieldEmail = <FormFields extends FieldValues>(
  props: PartialBy<FormFieldPropsBase<FormFields>, 'placeholder'>,
) => {
  const rules = React.useMemo(
    () => ({
      ...props.rules,
      pattern: EMAIL_REGEXP,
    }),
    [ props.rules ],
  );

  return (
    <FormFieldText
      { ...props }
      placeholder={ props.placeholder || 'Email' }
      rules={ rules }
    />
  );
};

export default React.memo(FormFieldEmail) as typeof FormFieldEmail;
