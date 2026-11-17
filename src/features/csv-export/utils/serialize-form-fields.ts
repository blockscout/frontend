// SPDX-License-Identifier: LicenseRef-Blockscout

import type { DateValue } from '@chakra-ui/react';
import { getLocalTimeZone, toZoned } from '@internationalized/date';

import type { FormFields } from '../components/dialog/types';

// the date picker yields wall-clock values carrying no time zone; the toggle in the dialog decides
// whether those wall-clock digits are read as local time or as UTC before the API receives them as
// absolute timestamps
const toAbsoluteString = (date: DateValue, isLocalTime: boolean): string => {
  if ('timeZone' in date) {
    return date.toAbsoluteString();
  }
  return toZoned(date, isLocalTime ? getLocalTimeZone() : 'UTC').toAbsoluteString();
};

export default function serializeFormFields(data: FormFields | undefined, isLocalTime: boolean): Record<string, string> {
  const result: Record<string, string> = {};

  Object.entries(data ?? {}).forEach(([ key, value ]) => {
    const [ date ] = value ?? [];
    if (date) {
      result[key] = toAbsoluteString(date, isLocalTime);
    }
  });

  return result;
}
