import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { Address } from 'types/api/address';
import type { SmartContract } from 'types/api/contract';

import { Alert } from 'toolkit/chakra/alert';
import CodeViewSnippet from 'ui/shared/CodeViewSnippet';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import ContractDetailsConstructorArgs from './ContractDetailsConstructorArgs';
import ContractDetailsVerificationButton from './ContractDetailsVerificationButton';
import ContractSourceCode from './ContractSourceCode';
import type { CONTRACT_DETAILS_TAB_IDS } from './utils';

interface Tab {
  id: typeof CONTRACT_DETAILS_TAB_IDS[number];
  title: string;
  component: React.ReactNode;
}

interface Props {
  data: SmartContract | undefined;
  isLoading: boolean;
  addressData: Address;
  sourceAddress: string;
}

export default function useContractDetailsTabs({ data, isLoading, addressData, sourceAddress }: Props): Array<Tab> {

  const canBeVerified = !data?.is_self_destructed && !data?.is_verified && addressData?.proxy_type !== 'eip7702';

  return React.useMemo(() => {
    const verificationButton = (
      <ContractDetailsVerificationButton
        isLoading={ isLoading }
        addressHash={ addressData.hash }
        isPartiallyVerified={ Boolean(data?.is_partially_verified) }
      />
    );

    return [
      (data?.constructor_args || data?.source_code) ? {
        id: 'contract_source_code' as const,
        title: 'Code',
        component: (
          <Flex flexDir="column" rowGap={ 6 }>
            <ContractDetailsConstructorArgs data={ data } isLoading={ isLoading }/>
            { data?.source_code && (
              <ContractSourceCode
                data={ data }
                isLoading={ isLoading }
                sourceAddress={ sourceAddress }
              />
            ) }
          </Flex>
        ),
      } : undefined,

      data?.compiler_settings ? {
        id: 'contract_compiler' as const,
        title: 'Compiler',
        component: (
          <CodeViewSnippet
            data={ JSON.stringify(data.compiler_settings, undefined, 2) }
            language="json"
            title="Compiler Settings"
            copyData={ JSON.stringify(data.compiler_settings) }
            isLoading={ isLoading }
          />
        ),
      } : undefined,

      data?.abi ? {
        id: 'contract_abi' as const,
        title: 'ABI',
        component: (
          <CodeViewSnippet
            data={ JSON.stringify(data.abi, undefined, 2) }
            language="json"
            title="Contract ABI"
            copyData={ JSON.stringify(data.abi) }
            isLoading={ isLoading }
          />
        ),
      } : undefined,

      (data?.creation_bytecode || data?.deployed_bytecode) ? {
        id: 'contract_bytecode' as const,
        title: 'ByteCode',
        component: (
          <Flex flexDir="column" rowGap={ 6 }>
            { data?.creation_bytecode && (
              <RawDataSnippet
                data={ data.creation_bytecode }
                title="Contract creation code"
                rightSlot={ canBeVerified ? verificationButton : null }
                beforeSlot={ data.is_self_destructed ? (
                  <Alert status="info" whiteSpace="pre-wrap" mb={ 3 }>
                    Contracts that self destruct in their constructors have no contract code published and cannot be verified.
                    Displaying the init data provided of the creating transaction.
                  </Alert>
                ) : null }
                textareaMaxHeight="300px"
                isLoading={ isLoading }
              />
            ) }
            { data?.deployed_bytecode && (
              <RawDataSnippet
                data={ data.deployed_bytecode }
                title="Deployed ByteCode"
                rightSlot={ !data?.creation_bytecode && canBeVerified ? verificationButton : null }
                textareaMaxHeight="300px"
                isLoading={ isLoading }
              />
            ) }
          </Flex>
        ),
      } : undefined,
    ].filter(Boolean);
  }, [ isLoading, addressData, data, sourceAddress, canBeVerified ]);
}
