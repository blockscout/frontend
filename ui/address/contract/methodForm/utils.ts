export type ContractMethodFormFields = Record<string, string | undefined>; // TODO @tom2drum - should not be undefined since all fields are required
import _set from 'lodash/set';

export const INT_REGEXP = /^(u)?int(\d+)?$/i;

export const BYTES_REGEXP = /^bytes(\d+)?$/i;

export const ARRAY_REGEXP = /^(.*)\[(\d*)\]$/;

export const getIntBoundaries = (power: number, isUnsigned: boolean) => {
  const maxUnsigned = 2 ** power;
  const max = isUnsigned ? maxUnsigned - 1 : maxUnsigned / 2 - 1;
  const min = isUnsigned ? 0 : -maxUnsigned / 2;
  return [ min, max ];
};

export const formatBooleanValue = (value: string) => {
  const formattedValue = value.toLowerCase();

  switch (formattedValue) {
    case 'true':
    case '1': {
      return 'true';
    }

    case 'false':
    case '0': {
      return 'false';
    }

    default:
      return;
  }
};

export function transformFormDataToMethodArgs(formData: ContractMethodFormFields) {
  const result: Array<unknown> = [];

  for (const field in formData) {
    const value = formData[field];
    if (value !== undefined) {
      _set(result, field.replaceAll(':', '.'), value);
    }
  }

  return filterOurEmptyItems(result);
}

function filterOurEmptyItems(array: Array<unknown>): Array<unknown> {
  return array
    .map((item) => Array.isArray(item) ? filterOurEmptyItems(item) : item)
    .filter((item) => item !== undefined);
}
