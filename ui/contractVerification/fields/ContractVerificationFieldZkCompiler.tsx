import { Box, Link } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import { getResourceKey } from 'lib/api/useApiQuery';
import FormFieldFancySelect from 'ui/shared/forms/fields/FormFieldFancySelect';
import IconSvg from 'ui/shared/IconSvg';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const OPTIONS_LIMIT = 50;

const ContractVerificationFieldZkCompiler = () => {
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

  return (
    <ContractVerificationFormRow>
      <FormFieldFancySelect<FormFields, 'zk_compiler'>
        name="zk_compiler"
        placeholder="ZK compiler (enter version or use the dropdown)"
        placeholderIcon={ <IconSvg name="search"/> }
        loadOptions={ loadOptions }
        defaultOptions
        isRequired
        isAsync
      />
      <Box>
        <Link isExternal href="https://docs.zksync.io/zk-stack/components/compiler/specification#glossary">zksolc</Link>
        <span> compiler version.</span>
      </Box>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldZkCompiler);
