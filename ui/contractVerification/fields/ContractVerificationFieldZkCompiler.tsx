import { Box, createListCollection } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import { getResourceKey } from 'lib/api/useApiQuery';
import { Link } from 'toolkit/chakra/link';
import FormFieldSelect from 'ui/shared/forms/fields/FormFieldSelect';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const OPTIONS_LIMIT = 50;

const ContractVerificationFieldZkCompiler = () => {
  const queryClient = useQueryClient();
  const config = queryClient.getQueryData<SmartContractVerificationConfig>(getResourceKey('contract_verification_config'));

  const options = React.useMemo(() => (
    config?.zk_compiler_versions?.map((option) => ({ label: option, value: option })) || []
  ), [ config?.zk_compiler_versions ]);

  // TODO @tom2drum implement filtering the options

  const collection = React.useMemo(() => {
    const items = options
      // .filter(({ label }) => !inputValue || label.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, OPTIONS_LIMIT);

    return createListCollection({ items });
  }, [ options ]);

  return (
    <ContractVerificationFormRow>
      <FormFieldSelect<FormFields, 'zk_compiler'>
        name="zk_compiler"
        placeholder="ZK compiler (enter version or use the dropdown)"
        collection={ collection }
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
