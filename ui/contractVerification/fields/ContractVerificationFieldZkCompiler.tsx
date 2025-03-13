import { Box, createListCollection } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import { getResourceKey } from 'lib/api/useApiQuery';
import { Link } from 'toolkit/chakra/link';
import FormFieldSelectAsync from 'ui/shared/forms/fields/FormFieldSelectAsync';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const OPTIONS_LIMIT = 50;

const ContractVerificationFieldZkCompiler = () => {
  const queryClient = useQueryClient();
  const config = queryClient.getQueryData<SmartContractVerificationConfig>(getResourceKey('contract_verification_config'));

  const versions = React.useMemo(() => (
    config?.zk_compiler_versions || []
  ), [ config?.zk_compiler_versions ]);

  const loadOptions = React.useCallback(async(inputValue: string, currentValue: Array<string>) => {
    const items = versions
      ?.filter((value) => !inputValue || currentValue.includes(value) || value.toLowerCase().includes(inputValue.toLowerCase()))
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
  }, [ versions ]);

  return (
    <ContractVerificationFormRow>
      <FormFieldSelectAsync<FormFields, 'zk_compiler'>
        name="zk_compiler"
        placeholder="ZK compiler (enter version or use the dropdown)"
        loadOptions={ loadOptions }
        required
      />
      <Box>
        <Link external href="https://docs.zksync.io/zk-stack/components/compiler/specification#glossary">zksolc</Link>
        <span> compiler version.</span>
      </Box>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldZkCompiler);
