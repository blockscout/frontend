import type { Abi } from 'abitype';
import _mapValues from 'lodash/mapValues';

import type { MethodArgType, MethodFormFields, MethodFormFieldsFormatted } from './types';
import type { SmartContractMethodArgType, SmartContractMethodInput, SmartContractWriteMethod } from 'types/api/contract';

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

export const getNativeCoinValue = (value: string | Array<unknown>) => {
  const _value = Array.isArray(value) ? value[0] : value;

  if (typeof _value !== 'string') {
    return BigInt(0);
  }

  return BigInt(_value);
};

interface ExtendedError extends Error {
  detectedNetwork?: {
    chain: number;
    name: string;
  };
  reason?: string;
}

export function isExtendedError(error: unknown): error is ExtendedError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

export function prepareAbi(abi: Abi, item: SmartContractWriteMethod): Abi {
  if ('name' in item) {
    const hasMethodsWithSameName = abi.filter((abiItem) => 'name' in abiItem ? abiItem.name === item.name : false).length > 1;

    if (hasMethodsWithSameName) {
      return abi.filter((abiItem) => {
        if (!('name' in abiItem)) {
          return true;
        }

        if (abiItem.name !== item.name) {
          return true;
        }

        if (abiItem.inputs.length !== item.inputs.length) {
          return false;
        }

        return abiItem.inputs.every(({ name, type }) => {
          const itemInput = item.inputs.find((input) => input.name === name);
          return Boolean(itemInput) && itemInput?.type === type;
        });
      });
    }
  }

  return abi;
}

function getFieldType(fieldName: string, inputs: Array<SmartContractMethodInput>) {
  const chunks = fieldName.split(':');

  if (chunks.length === 1) {
    const [ , index ] = chunks[0].split('%');
    return inputs[Number(index)].type;
  } else {
    const group = chunks[0].split('%');
    const input = chunks[1].split('%');

    return inputs[Number(group[1])].components?.[Number(input[1])].type;
  }
}

function parseArrayValue(value: string) {
  try {
    const parsedResult = JSON.parse(value);
    if (Array.isArray(parsedResult)) {
      return parsedResult as Array<string>;
    }
    throw new Error('Not an array');
  } catch (error) {
    return '';
  }
}

function castValue(value: string, type: SmartContractMethodArgType) {
  if (type === 'bool') {
    return formatBooleanValue(value) === 'true';
  }

  const intMatch = type.match(INT_REGEXP);
  if (intMatch) {
    return value.replaceAll(' ', '');
  }

  const isNestedArray = (type.match(/\[/g) || []).length > 1;
  const isNestedTuple = type.includes('tuple');
  if (isNestedArray || isNestedTuple) {
    return parseArrayValue(value) || value;
  }

  return value;
}

export function formatFieldValues(formFields: MethodFormFields, inputs: Array<SmartContractMethodInput>) {
  const formattedFields = _mapValues(formFields, (value, key) => {
    const type = getFieldType(key, inputs);

    if (!type) {
      return value;
    }

    if (Array.isArray(value)) {
      const arrayMatch = type.match(ARRAY_REGEXP);

      if (arrayMatch) {
        return value.map((item) => castValue(item, arrayMatch[1] as SmartContractMethodArgType));
      }

      return value;
    }

    return castValue(value, type);
  });

  return formattedFields;
}

export function transformFieldsToArgs(formFields: MethodFormFieldsFormatted) {
  const unGroupedFields = Object.entries(formFields)
    .reduce((
      result: Record<string, MethodArgType>,
      [ key, value ]: [ string, MethodArgType ],
    ) => {
      const chunks = key.split(':');

      if (chunks.length > 1) {
        const groupKey = chunks[0];
        const [ , fieldIndex ] = chunks[1].split('%');

        if (result[groupKey] === undefined) {
          result[groupKey] = [];
        }

        (result[groupKey] as Array<MethodArgType>)[Number(fieldIndex)] = value;
        return result;
      }

      result[key] = value;
      return result;
    }, {});

  const args = (Object.entries(unGroupedFields)
    .map(([ key, value ]) => {
      const [ , index ] = key.split('%');
      return [ Number(index), value ];
    }) as Array<[ number, string | Array<string> ]>)
    .sort((a, b) => a[0] - b[0])
    .map(([ , value ]) => value);

  return args;
}
