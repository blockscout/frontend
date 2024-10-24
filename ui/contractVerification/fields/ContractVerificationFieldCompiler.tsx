import { chakra, Checkbox, Code } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import { getResourceKey } from 'lib/api/useApiQuery';
import FormFieldFancySelect from 'ui/shared/forms/fields/FormFieldFancySelect';
import IconSvg from 'ui/shared/IconSvg';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const OPTIONS_LIMIT = 50;

interface Props {
  isVyper?: boolean;
}

const ContractVerificationFieldCompiler = ({ isVyper }: Props) => {
  const [ isNightly, setIsNightly ] = React.useState(false);
  const { formState, getValues, resetField } = useFormContext<FormFields>();
  const queryClient = useQueryClient();
  const config = queryClient.getQueryData<SmartContractVerificationConfig>(getResourceKey('contract_verification_config'));

  const handleCheckboxChange = React.useCallback(() => {
    if (isNightly) {
      const field = getValues('compiler');
      field?.value.includes('nightly') && resetField('compiler', { defaultValue: null });
    }
    setIsNightly(prev => !prev);
  }, [ getValues, isNightly, resetField ]);

  const options = React.useMemo(() => (
    (isVyper ? config?.vyper_compiler_versions : config?.solidity_compiler_versions)?.map((option) => ({ label: option, value: option })) || []
  ), [ config?.solidity_compiler_versions, config?.vyper_compiler_versions, isVyper ]);

  const loadOptions = React.useCallback(async(inputValue: string) => {
    return options
      .filter(({ label }) => !inputValue || label.toLowerCase().includes(inputValue.toLowerCase()))
      .filter(({ label }) => isNightly ? true : !label.includes('nightly'))
      .slice(0, OPTIONS_LIMIT);
  }, [ isNightly, options ]);

  return (
    <ContractVerificationFormRow>
      <>
        { !isVyper && (
          <Checkbox
            size="lg"
            mb={ 2 }
            onChange={ handleCheckboxChange }
            isDisabled={ formState.isSubmitting }
          >
            Include nightly builds
          </Checkbox>
        ) }
        <FormFieldFancySelect<FormFields, 'compiler'>
          name="compiler"
          placeholder="Compiler (enter version or use the dropdown)"
          loadOptions={ loadOptions }
          defaultOptions
          placeholderIcon={ <IconSvg name="search"/> }
          isRequired
          isAsync
        />
      </>
      { isVyper ? null : (
        <chakra.div mt={{ base: 0, lg: 8 }}>
          <span >The compiler version is specified in </span>
          <Code color="text_secondary">pragma solidity X.X.X</Code>
          <span>. Use the compiler version rather than the nightly build. If using the Solidity compiler, run </span>
          <Code color="text_secondary">solc —version</Code>
          <span> to check.</span>
        </chakra.div>
      ) }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldCompiler);
