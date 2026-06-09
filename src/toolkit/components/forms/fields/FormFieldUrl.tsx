// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import type { UrlValidatorParams } from '../validators/url';
import { urlValidator } from '../validators/url';
import { FormFieldText } from './FormFieldText';

const FormFieldUrlContent = <FormFields extends FieldValues>(
  { urlValidatorParams, ...rest }: FormFieldPropsBase<FormFields> & { urlValidatorParams?: UrlValidatorParams },
) => {
  const rules = React.useMemo(
    () => ({
      ...rest.rules,
      validate: {
        ...rest.rules?.validate,
        url: urlValidator(urlValidatorParams),
      },
    }),
    [ rest.rules, urlValidatorParams ],
  );

  return <FormFieldText { ...rest } rules={ rules }/>;
};

export const FormFieldUrl = React.memo(FormFieldUrlContent) as typeof FormFieldUrlContent;
