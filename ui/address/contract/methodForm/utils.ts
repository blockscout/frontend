import _set from 'lodash/set';

import type { SmartContractMethodInput } from 'types/api/contract';

export type ContractMethodFormFields = Record<string, string | boolean | number | undefined>;

export const INT_REGEXP = /^(u)?int(\d+)?$/i;

export const BYTES_REGEXP = /^bytes(\d+)?$/i;

export const ARRAY_REGEXP = /^(.*)\[(\d*)\]$/;

export const getIntBoundaries = (power: number, isUnsigned: boolean) => {
  const maxUnsigned = 2 ** power;
  const max = isUnsigned ? maxUnsigned - 1 : maxUnsigned / 2 - 1;
  const min = isUnsigned ? 0 : -maxUnsigned / 2;
  return [ min, max ];
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
  // The undefined value may occur in two cases:
  //    1. When an optional form field is left blank by the user.
  //        The only optional field is the native coin value, which is safely handled in the form submit handler.
  //    2. When the user adds and removes items from a field array.
  //        In this scenario, empty items need to be filtered out to maintain the correct sequence of arguments.
  return array
    .map((item) => Array.isArray(item) ? filterOurEmptyItems(item) : item)
    .filter((item) => item !== undefined);
}

export function getFieldLabel(input: SmartContractMethodInput, isRequired?: boolean) {
  const name = input.name || input.internalType || '<unnamed argument>';
  return `${ name } (${ input.type })${ isRequired ? '*' : '' }`;
}
