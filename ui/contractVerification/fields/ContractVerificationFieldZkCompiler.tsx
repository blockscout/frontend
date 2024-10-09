import { Box, Link } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { useFormContext, Controller } from 'react-hook-form';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import { getResourceKey } from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import FancySelect from 'ui/shared/FancySelect/FancySelect';
import IconSvg from 'ui/shared/IconSvg';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const OPTIONS_LIMIT = 50;

const ContractVerificationFieldZkCompiler = () => {
  const { formState, control } = useFormContext<FormFields>();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const config = queryClient.getQueryData<SmartContractVerificationConfig>(getResourceKey('contract_verification_config'));

  const options = React.useMemo(() => (
    config?.zk_compiler_versions?.map((option) => ({ label: option, value: option })) || []
  ), [ config?.zk_compiler_versions ]);

  const loadOptions = React.useCallback(async(inputValue: string) => {
    return options
      .filter(({ label }) => !inputValue || label.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, OPTIONS_LIMIT);
  }, [ options ]);

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'zk_compiler'>}) => {
    const error = 'zk_compiler' in formState.errors ? formState.errors.zk_compiler : undefined;

    return (
      <FancySelect
        { ...field }
        loadOptions={ loadOptions }
        defaultOptions
        size={ isMobile ? 'md' : 'lg' }
        placeholder="ZK compiler (enter version or use the dropdown)"
        placeholderIcon={ <IconSvg name="search"/> }
        isDisabled={ formState.isSubmitting }
        error={ error }
        isRequired
        isAsync
      />
    );
  }, [ formState.errors, formState.isSubmitting, isMobile, loadOptions ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name="zk_compiler"
        control={ control }
        render={ renderControl }
        rules={{ required: true }}
      />
      <Box>
        <Link isExternal href="https://docs.zksync.io/zk-stack/components/compiler/specification#glossary">zksolc</Link>
        <span> compiler version.</span>
      </Box>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldZkCompiler);
