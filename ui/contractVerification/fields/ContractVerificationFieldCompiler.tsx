import { Code } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { useFormContext, Controller } from 'react-hook-form';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/api/contract';

import { getResourceKey } from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import FancySelect from 'ui/shared/FancySelect/FancySelect';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  isVyper?: boolean;
}

const ContractVerificationFieldCompiler = ({ isVyper }: Props) => {
  const { formState, control } = useFormContext<FormFields>();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const config = queryClient.getQueryData<SmartContractVerificationConfig>(getResourceKey('contract_verification_config'));

  const options = React.useMemo(() => (
    (isVyper ? config?.vyper_compiler_versions : config?.solidity_compiler_versions)?.map((option) => ({ label: option, value: option })) || []
  ), [ config?.solidity_compiler_versions, config?.vyper_compiler_versions, isVyper ]);

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'compiler'>}) => {
    const error = 'compiler' in formState.errors ? formState.errors.compiler : undefined;

    return (
      <FancySelect
        { ...field }
        options={ options }
        size={ isMobile ? 'md' : 'lg' }
        placeholder="Compiler"
        isDisabled={ formState.isSubmitting }
        error={ error }
        isRequired
      />
    );
  }, [ formState.errors, formState.isSubmitting, isMobile, options ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name="compiler"
        control={ control }
        render={ renderControl }
        rules={{ required: true }}
      />
      { isVyper ? null : (
        <>
          <span>The compiler version is specified in </span>
          <Code color="text_secondary">pragma solidity X.X.X</Code>
          <span>. Use the compiler version rather than the nightly build. If using the Solidity compiler, run </span>
          <Code color="text_secondary">solc —version</Code>
          <span> to check.</span>
        </>
      ) }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldCompiler);
