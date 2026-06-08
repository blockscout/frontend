// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import type { UrlValidatorParams } from '../validators/url';
import { urlValidator } from '../validators/url';
import { FormFieldText } from './FormFieldText';

const FormFieldUrlContent = <FormFields extends FieldValues>(
  props: FormFieldPropsBase<FormFields> & { urlValidatorParams?: UrlValidatorParams },
) => {
  const rules = React.useMemo(
    () => ({
      ...props.rules,
      validate: {
        ...props.rules?.validate,
        url: urlValidator(props.urlValidatorParams),
      },
    }),
    [ props.rules, props.urlValidatorParams ],
  );

  return <FormFieldText { ...props } rules={ rules }/>;
};

export const FormFieldUrl = React.memo(FormFieldUrlContent) as typeof FormFieldUrlContent;
