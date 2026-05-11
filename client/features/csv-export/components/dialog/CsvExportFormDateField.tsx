import { capitalize } from 'es-toolkit';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { FormFields } from './types';

import dayjs from 'lib/date/dayjs';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';

interface Props {
  formApi: UseFormReturn<FormFields>;
  name: 'from_period' | 'to_period';
}

const CsvExportFormDateField = ({ formApi, name }: Props) => {
  const { formState, getValues, trigger } = formApi;

  const validate = React.useCallback((newValue: string) => {
    if (name === 'from_period') {
      const toValue = getValues('to_period');
      if (toValue && dayjs(newValue) > dayjs(toValue)) {
        return 'Incorrect date';
      }
      if (formState.errors.to_period) {
        trigger('to_period');
      }
    } else {
      const fromValue = getValues('from_period');
      if (fromValue && dayjs(fromValue) > dayjs(newValue)) {
        return 'Incorrect date';
      }
      if (formState.errors.from_period) {
        trigger('from_period');
      }
    }
  }, [ formState.errors.from_period, formState.errors.to_period, getValues, name, trigger ]);

  return (
    <FormFieldText<FormFields, typeof name>
      name={ name }
      inputProps={{ type: 'datetime-local', max: dayjs().format('YYYY-MM-DDTHH:mm') }}
      placeholder={ capitalize(name.replace('_period', '')) }
      required
      rules={{ validate }}
    />
  );
};

export default React.memo(CsvExportFormDateField);
