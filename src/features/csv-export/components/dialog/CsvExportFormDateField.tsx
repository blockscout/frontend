// SPDX-License-Identifier: LicenseRef-Blockscout

import type { DateValue } from '@chakra-ui/react';
import { getLocalTimeZone, now, toCalendarDateTime } from '@internationalized/date';
import { capitalize } from 'es-toolkit';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { FormFields } from './types';

import { FormFieldDate } from 'src/toolkit/components/forms/fields/FormFieldDate';

interface Props {
  formApi: UseFormReturn<FormFields>;
  name: 'from_period' | 'to_period';
  isLocalTime: boolean;
}

const CsvExportFormDateField = ({ formApi, name, isLocalTime }: Props) => {
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

  const maxDate = React.useMemo(
    () => toCalendarDateTime(now(isLocalTime ? getLocalTimeZone() : 'UTC')),
    [ isLocalTime ],
  );

  return (
    <FormFieldDate<FormFields, typeof name>
      // remount on zone change: the underlying date-picker only re-syncs its displayed text when the
      // value or locale changes, not when the format (and thus the suffix) does, so a bare toggle would
      // leave the old suffix on screen until the dialog is reopened
      key={ isLocalTime ? 'local' : 'utc' }
      name={ name }
      max={ maxDate }
      placeholder={ capitalize(name.replace('_period', '')) }
      required
      withTime
      timeZoneSuffix={ isLocalTime ? undefined : 'UTC' }
      bgColor="dialog.bg"
      // a bare function would be lost: FormFieldDate spreads rules.validate into an object
      // in order to add its own min/max validator
      rules={{ validate: { period: validate } }}
    />
  );
};

export default React.memo(CsvExportFormDateField);
