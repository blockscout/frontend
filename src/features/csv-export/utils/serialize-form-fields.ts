// SPDX-License-Identifier: LicenseRef-Blockscout

import type { DateValue } from '@chakra-ui/react';
import { getLocalTimeZone, toZoned } from '@internationalized/date';

import type { FormFields } from '../components/dialog/types';

// the date picker yields wall-clock values carrying no time zone, so they are resolved
// in the user's zone before the API receives them as absolute timestamps
const toAbsoluteString = (date: DateValue): string => {
  const zoned = 'timeZone' in date ? date : toZoned(date, getLocalTimeZone());
  return zoned.toAbsoluteString();
};

export default function serializeFormFields(data?: FormFields): Record<string, string> {
  const result: Record<string, string> = {};

  Object.entries(data ?? {}).forEach(([ key, value ]) => {
    const [ date ] = value ?? [];
    if (date) {
      result[key] = toAbsoluteString(date);
    }
  });

  return result;
}
