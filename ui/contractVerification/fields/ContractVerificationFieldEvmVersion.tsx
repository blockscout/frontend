import { createListCollection } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import { getResourceKey } from 'lib/api/useApiQuery';
import { Link } from 'toolkit/chakra/link';
import FormFieldSelect from 'ui/shared/forms/fields/FormFieldSelect';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  isVyper?: boolean;
}

const ContractVerificationFieldEvmVersion = ({ isVyper }: Props) => {
  const queryClient = useQueryClient();
  const config = queryClient.getQueryData<SmartContractVerificationConfig>(getResourceKey('contract_verification_config'));

  const collection = React.useMemo(() => {
    const items = (isVyper ? config?.vyper_evm_versions : config?.solidity_evm_versions)?.map((option) => ({ label: option, value: option })) || [];

    return createListCollection({ items });
  }, [ config?.solidity_evm_versions, config?.vyper_evm_versions, isVyper ]);

  return (
    <ContractVerificationFormRow>
      <FormFieldSelect<FormFields, 'evm_version'>
        name="evm_version"
        placeholder="EVM Version"
        collection={ collection }
        required
      />
      <>
        <span>The EVM version the contract is written for. If the bytecode does not match the version, we try to verify using the latest EVM version. </span>
        <Link
          href={ isVyper ?
            'https://docs.vyperlang.org/en/stable/compiling-a-contract.html#target-options' :
            'https://docs.soliditylang.org/en/latest/using-the-compiler.html#target-options'
          }
          target="_blank"
        >
          EVM version details
        </Link>
      </>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldEvmVersion);
