import type { FieldPath, ErrorOption } from 'react-hook-form';

import type { ContractLibrary, FormFields } from './types';
import type { SmartContractVerificationMethod, SmartContractVerificationError } from 'types/api/contract';

import type { Params as FetchParams } from 'lib/hooks/useFetch';

export const SUPPORTED_VERIFICATION_METHODS: Array<SmartContractVerificationMethod> = [
  'flattened_code',
  'standard_input',
  'sourcify',
  'multi_part',
  'vyper_code',
  'vyper_multi_part',
];

export const METHOD_TO_ENDPOINT_MAP: Record<SmartContractVerificationMethod, string> = {
  flattened_code: 'flattened-code',
  standard_input: 'standard-input',
  sourcify: 'sourcify',
  multi_part: 'multi-part',
  vyper_code: 'vyper-code',
  vyper_multi_part: 'vyper-multi-part',
};

export function isValidVerificationMethod(method?: string): method is SmartContractVerificationMethod {
  return method && SUPPORTED_VERIFICATION_METHODS.includes(method as SmartContractVerificationMethod) ? true : false;
}

export function sortVerificationMethods(methodA: SmartContractVerificationMethod, methodB: SmartContractVerificationMethod) {
  const indexA = SUPPORTED_VERIFICATION_METHODS.indexOf(methodA);
  const indexB = SUPPORTED_VERIFICATION_METHODS.indexOf(methodB);

  if (indexA > indexB) {
    return 1;
  }

  if (indexA < indexB) {
    return -1;
  }

  return 0;
}

export function prepareRequestBody(data: FormFields): FetchParams['body'] {
  switch (data.method) {
    case 'flattened_code': {
      return {
        compiler_version: data.compiler?.value,
        source_code: data.code,
        is_optimization_enabled: data.is_optimization_enabled,
        optimization_runs: data.optimization_runs,
        contract_name: data.name,
        libraries: reduceLibrariesArray(data.libraries),
        evm_version: data.evm_version?.value,
        autodetect_constructor_args: data.autodetect_constructor_args,
        constructor_args: data.constructor_args,
      };
    }

    case 'standard_input': {
      const body = new FormData();
      body.set('compiler_version', data.compiler?.value);
      body.set('contract_name', data.name);
      body.set('autodetect_constructor_args', String(Boolean(data.autodetect_constructor_args)));
      body.set('constructor_args', data.constructor_args);
      addFilesToFormData(body, data.sources);

      return body;
    }

    case 'sourcify': {
      const body = new FormData();
      addFilesToFormData(body, data.sources);

      return body;
    }

    case 'multi_part': {
      const body = new FormData();
      body.set('compiler_version', data.compiler?.value);
      body.set('evm_version', data.evm_version?.value);
      body.set('is_optimization_enabled', String(Boolean(data.is_optimization_enabled)));
      data.is_optimization_enabled && body.set('optimization_runs', data.optimization_runs);

      const libraries = reduceLibrariesArray(data.libraries);
      libraries && body.set('libraries', JSON.stringify(libraries));
      addFilesToFormData(body, data.sources);

      return body;
    }

    case 'vyper_code': {
      return {
        compiler_version: data.compiler?.value,
        source_code: data.code,
        contract_name: data.name,
        constructor_args: data.constructor_args,
      };
    }

    case 'vyper_multi_part': {
      const body = new FormData();
      body.set('compiler_version', data.compiler?.value);
      body.set('evm_version', data.evm_version?.value);
      addFilesToFormData(body, data.sources);

      return body;
    }

    default: {
      return {};
    }
  }
}

function reduceLibrariesArray(libraries: Array<ContractLibrary> | undefined) {
  if (!libraries || libraries.length === 0) {
    return;
  }

  return libraries.reduce<Record<string, string>>((result, item) => {
    result[item.name] = item.address;
    return result;
  }, {});
}

function addFilesToFormData(body: FormData, files: Array<File> | undefined) {
  if (!files) {
    return;
  }

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    body.set(`files[${ index }]`, file, file.name);
  }
}

const API_ERROR_TO_FORM_FIELD: Record<keyof SmartContractVerificationError, FieldPath<FormFields>> = {
  contract_source_code: 'code',
  files: 'sources',
  compiler_version: 'compiler',
  constructor_arguments: 'constructor_args',
  name: 'name',
};

export function formatSocketErrors(errors: SmartContractVerificationError): Array<[FieldPath<FormFields>, ErrorOption]> {
  return Object.entries(errors).map(([ key, value ]) => {
    return [ API_ERROR_TO_FORM_FIELD[key as keyof SmartContractVerificationError], { message: value.join(',') } ];
  });
}
