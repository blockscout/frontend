import { Link } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import { getResourceKey } from 'lib/api/useApiQuery';
import FormFieldFancySelect from 'ui/shared/forms/fields/FormFieldFancySelect';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  isVyper?: boolean;
}

const ContractVerificationFieldEvmVersion = ({ isVyper }: Props) => {
  const queryClient = useQueryClient();
  const config = queryClient.getQueryData<SmartContractVerificationConfig>(getResourceKey('contract_verification_config'));

  const options = React.useMemo(() => (
    (isVyper ? config?.vyper_evm_versions : config?.solidity_evm_versions)?.map((option) => ({ label: option, value: option })) || []
  ), [ config?.solidity_evm_versions, config?.vyper_evm_versions, isVyper ]);

  return (
    <ContractVerificationFormRow>
      <FormFieldFancySelect<FormFields, 'evm_version'>
        name="evm_version"
        placeholder="EVM Version"
        options={ options }
        isRequired
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
