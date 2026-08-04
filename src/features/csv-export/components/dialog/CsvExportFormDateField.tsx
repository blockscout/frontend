// SPDX-License-Identifier: LicenseRef-Blockscout

import type { DateValue } from '@chakra-ui/react';
import { getLocalTimeZone, parseAbsolute } from '@internationalized/date';
import { capitalize } from 'es-toolkit';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { FormFields } from './types';

import { FormFieldDate } from 'src/toolkit/components/forms/fields/FormFieldDate';

interface Props {
  formApi: UseFormReturn<FormFields>;
  name: 'from_period' | 'to_period';
}

const CsvExportFormDateField = ({ formApi, name }: Props) => {
  const { formState, getValues, trigger } = formApi;

  const validate = React.useCallback((newValue: Array<DateValue>) => {
    const [ date ] = newValue ?? [];
    if (!date) {
      return;
    }

    if (name === 'from_period') {
      const [ toDate ] = getValues('to_period') ?? [];
      if (toDate && date.compare(toDate) > 0) {
        return 'Incorrect date';
      }
      if (formState.errors.to_period) {
        trigger('to_period');
      }
    } else {
      const [ fromDate ] = getValues('from_period') ?? [];
      if (fromDate && fromDate.compare(date) > 0) {
        return 'Incorrect date';
      }
      if (formState.errors.from_period) {
        trigger('from_period');
      }
    }
  }, [ formState.errors.from_period, formState.errors.to_period, getValues, name, trigger ]);

  const maxDate = React.useMemo(() => parseAbsolute(new Date().toISOString(), getLocalTimeZone()), []);

  return (
    <FormFieldDate<FormFields, typeof name>
      name={ name }
      max={ maxDate }
      placeholder={ capitalize(name.replace('_period', '')) }
      required
      withTime
      bgColor="dialog.bg"
      // a bare function would be lost: FormFieldDate spreads rules.validate into an object
      // in order to add its own min/max validator
      rules={{ validate: { period: validate } }}
    />
  );
};

export default React.memo(CsvExportFormDateField);
