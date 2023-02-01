import { Link, Select } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { useFormContext, Controller } from 'react-hook-form';

import type { FormFields } from '../types';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const VERSIONS = [
  'default',
  'london',
  'berlin',
];

const ContractVerificationFieldEvmVersion = () => {
  const { formState, control } = useFormContext<FormFields>();

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'evm_version'>}) => {
    const error = 'evm_version' in formState.errors ? formState.errors.evm_version : undefined;

    return (
      <Select
        { ...field }
        size={{ base: 'md', lg: 'lg' }}
        placeholder="EVM Version"
        isInvalid={ Boolean(error) }
        isDisabled={ formState.isSubmitting }
      >
        { VERSIONS.map((option) => <option key={ option } value={ option }>{ option }</option>) }
      </Select>
    );
  }, [ formState.errors, formState.isSubmitting ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name="evm_version"
        control={ control }
        render={ renderControl }
        rules={{ required: true }}
      />
      <>
        <span>The EVM version the contract is written for. If the bytecode does not match the version, we try to verify using the latest EVM version. </span>
        <Link href="https://forum.poa.network/t/smart-contract-verification-evm-version-details/2318" target="_blank">EVM version details</Link>
      </>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldEvmVersion);
