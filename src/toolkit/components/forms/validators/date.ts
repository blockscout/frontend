// SPDX-License-Identifier: LicenseRef-Blockscout

import type { DateValue } from '@chakra-ui/react';

export const dateValidatorFactory = (min?: DateValue, max?: DateValue) => (value: Array<DateValue> | undefined) => {
  if (!value || (min === undefined && max === undefined)) {
    return true;
  }

  // a cleared field holds an empty array, which has nothing to compare against
  const date = value[0];
  if (!date) {
    return true;
  }

  if (min && date.compare(min) < 0) {
    return 'Date is before the minimum date';
  }

  if (max && date.compare(max) > 0) {
    return 'Date is after the maximum date';
  }

  return true;
};
