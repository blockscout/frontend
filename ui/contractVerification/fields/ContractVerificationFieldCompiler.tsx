import { chakra, Code, createListCollection } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import { getResourceKey } from 'lib/api/useApiQuery';
import { Checkbox } from 'toolkit/chakra/checkbox';
import FormFieldSelect from 'ui/shared/forms/fields/FormFieldSelect';

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

  const options = React.useMemo(() => {
    const versions = (() => {
      if (isStylus) {
        return config?.stylus_compiler_versions;
      }
      if (isVyper) {
        return config?.vyper_compiler_versions;
      }
      return config?.solidity_compiler_versions;
    })();

    return versions?.map((option) => ({ label: option, value: option })) || [];
  }, [ isStylus, isVyper, config?.solidity_compiler_versions, config?.stylus_compiler_versions, config?.vyper_compiler_versions ]);

  // const loadOptions = React.useCallback(async(inputValue: string) => {
  //   return options
  //     .filter(({ label }) => !inputValue || label.toLowerCase().includes(inputValue.toLowerCase()))
  //     .filter(({ label }) => isNightly ? true : !label.includes('nightly'))
  //     .slice(0, OPTIONS_LIMIT);
  // }, [ isNightly, options ]);

  // TODO @tom2drum implement filtering the options
  const collection = React.useMemo(() => {
    const items = options
      // .filter(({ label }) => !inputValue || label.toLowerCase().includes(inputValue.toLowerCase()))
      .filter(({ label }) => isNightly ? true : !label.includes('nightly'))
      .slice(0, OPTIONS_LIMIT);

    return createListCollection({ items });
  }, [ isNightly, options ]);

  return (
    <ContractVerificationFormRow>
      <>
        { !isVyper && !isStylus && (
          <Checkbox
            mb={ 2 }
            checked={ isNightly }
            onCheckedChange={ handleCheckboxChange }
            disabled={ formState.isSubmitting }
          >
            Include nightly builds
          </Checkbox>
        ) }
        <FormFieldSelect<FormFields, 'compiler'>
          name="compiler"
          placeholder="Compiler (enter version or use the dropdown)"
          collection={ collection }
          required
        />
      </>
      { isVyper || isStylus ? null : (
        <chakra.div mt={{ base: 0, lg: 8 }}>
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
