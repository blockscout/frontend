export type ContractMethodFormFields = Record<string, string | undefined>; // TODO @tom2drum - should not be undefined since all fields are required
import _set from 'lodash/set';

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
