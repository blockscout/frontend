import { chakra, Code, createListCollection } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import { getResourceKey } from 'lib/api/useApiQuery';
import { Checkbox } from 'toolkit/chakra/checkbox';
import FormFieldSelectAsync from 'ui/shared/forms/fields/FormFieldSelectAsync';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const OPTIONS_LIMIT = 50;

interface Props {
  isVyper?: boolean;
  isStylus?: boolean;
}

const ContractVerificationFieldCompiler = ({ isVyper, isStylus }: Props) => {
  const [ isNightly, setIsNightly ] = React.useState(false);
  const { formState, getValues, resetField } = useFormContext<FormFields>();
  const queryClient = useQueryClient();
  const config = queryClient.getQueryData<SmartContractVerificationConfig>(getResourceKey('contract_verification_config'));

  const handleCheckboxChange = React.useCallback(() => {
    setIsNightly(prev => {
      if (prev) {
        const field = getValues('compiler');
        field?.[0]?.includes('nightly') && resetField('compiler', { defaultValue: [] });
      }

      return !prev;
    });
  }, [ getValues, resetField ]);

  const versions = React.useMemo(() => {
    if (isStylus) {
      return config?.stylus_compiler_versions;
    }
    if (isVyper) {
      return config?.vyper_compiler_versions;
    }
    return config?.solidity_compiler_versions;
  }, [ isStylus, isVyper, config?.solidity_compiler_versions, config?.stylus_compiler_versions, config?.vyper_compiler_versions ]);

  const loadOptions = React.useCallback(async(inputValue: string, currentValue: Array<string>) => {
    const items = versions
      ?.filter((value) => !inputValue || currentValue.includes(value) || value.toLowerCase().includes(inputValue.toLowerCase()))
      .filter((value) => isNightly ? true : !value.includes('nightly'))
      .sort((a, b) => {
        if (currentValue.includes(a)) {
          return -1;
        }
        if (currentValue.includes(b)) {
          return 1;
        }
        return 0;
      })
      .slice(0, OPTIONS_LIMIT)
      .map((value) => ({ label: value, value })) ?? [];

    return createListCollection({ items });
  }, [ isNightly, versions ]);

  const extraControls = !isVyper && !isStylus ? (
    <Checkbox
      mt={ 2 }
      checked={ isNightly }
      onCheckedChange={ handleCheckboxChange }
      disabled={ formState.isSubmitting }
      size="sm"
    >
      Include nightly builds
    </Checkbox>
  ) : null;

  return (
    <ContractVerificationFormRow>
      <FormFieldSelectAsync<FormFields, 'compiler'>
        name="compiler"
        placeholder="Compiler (enter version or use the dropdown)"
        loadOptions={ loadOptions }
        extraControls={ extraControls }
        required
      />
      { isVyper || isStylus ? null : (
        <chakra.div>
          <span >The compiler version is specified in </span>
          <Code color="text.secondary">pragma solidity X.X.X</Code>
          <span>. Use the compiler version rather than the nightly build. If using the Solidity compiler, run </span>
          <Code color="text.secondary">solc —version</Code>
          <span> to check.</span>
        </chakra.div>
      ) }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldCompiler);
