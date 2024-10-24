import _capitalize from 'lodash/capitalize';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { FormFields } from './types';

import dayjs from 'lib/date/dayjs';
import FormFieldText from 'ui/shared/forms/fields/FormFieldText';

interface Props {
  formApi: UseFormReturn<FormFields>;
  name: 'from' | 'to';
}

const CsvExportFormField = ({ formApi, name }: Props) => {
  const { formState, getValues, trigger } = formApi;

  const validate = React.useCallback((newValue: string) => {
    if (name === 'from') {
      const toValue = getValues('to');
      if (toValue && dayjs(newValue) > dayjs(toValue)) {
        return 'Incorrect date';
      }
      if (formState.errors.to) {
        trigger('to');
      }
    } else {
      const fromValue = getValues('from');
      if (fromValue && dayjs(fromValue) > dayjs(newValue)) {
        return 'Incorrect date';
      }
      if (formState.errors.from) {
        trigger('from');
      }
    }
  }, [ formState.errors.from, formState.errors.to, getValues, name, trigger ]);

  return (
    <FormFieldText<FormFields, typeof name>
      name={ name }
      type="date"
      max={ dayjs().format('YYYY-MM-DD') }
      placeholder={ _capitalize(name) }
      isRequired
      rules={{ validate }}
      size={{ base: 'md', lg: 'lg' }}
      maxW={{ base: 'auto', lg: '220px' }}
    />
  );
};

export default React.memo(CsvExportFormField);
