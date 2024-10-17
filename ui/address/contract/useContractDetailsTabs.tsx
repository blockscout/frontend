import { Alert, Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SmartContract } from 'types/api/contract';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import ContractDetailsVerificationButton from './ContractDetailsVerificationButton';
import ContractSourceCode from './ContractSourceCode';

export const CONTRACT_DETAILS_TAB_IDS = [
  'contract_source_code',
  'contract_compiler',
  'contract_abi',
  'contract_bytecode',
] as const;

interface Tab {
  id: typeof CONTRACT_DETAILS_TAB_IDS[number];
  title: string;
  component: React.ReactNode;
}

interface Props {
  data: SmartContract | undefined;
  isPlaceholderData: boolean;
  addressHash: string | undefined;
}

export default function useContractDetailsTabs({ data, isPlaceholderData, addressHash }: Props): Array<Tab> {

  const constructorArgs = React.useMemo(() => {
    if (!data?.decoded_constructor_args) {
      return data?.constructor_args;
    }

    const decoded = data.decoded_constructor_args
      .map(([ value, { name, type } ], index) => {
        const valueEl = type === 'address' ? (
          <AddressEntity
            address={{ hash: value }}
            noIcon
            display="inline-flex"
            maxW="100%"
          />
        ) : <span>{ value }</span>;
        return (
          <Box key={ index }>
            <span>Arg [{ index }] { name || '' } ({ type }): </span>
            { valueEl }
          </Box>
        );
      });

    return (
      <>
        <span>{ data.constructor_args }</span>
        <br/><br/>
        { decoded }
      </>
    );
  }, [ data?.decoded_constructor_args, data?.constructor_args ]);

  const canBeVerified = !data?.is_self_destructed && !data?.is_verified;

  return React.useMemo(() => {
    const verificationButton = (
      <ContractDetailsVerificationButton
        isPlaceholderData={ isPlaceholderData }
        addressHash={ addressHash }
        isPartiallyVerified={ Boolean(data?.is_partially_verified) }
      />
    );

    return [
      constructorArgs || (data?.source_code && addressHash) ? {
        id: 'contract_source_code' as const,
        title: 'Code',
        component: (
          <Flex flexDir="column" rowGap={ 6 }>
            { constructorArgs && (
              <RawDataSnippet
                data={ constructorArgs }
                title="Constructor Arguments"
                textareaMaxHeight="200px"
                isLoading={ isPlaceholderData }
              />
            ) }
            { data?.source_code && addressHash && (
              <ContractSourceCode
                address={ addressHash }
                implementations={ undefined }
              />
            ) }
          </Flex>
        ),
      } : undefined,

      data?.compiler_settings ? {
        id: 'contract_compiler' as const,
        title: 'Compiler',
        component: (
          <RawDataSnippet
            data={ JSON.stringify(data.compiler_settings, undefined, 4) }
            title="Compiler Settings"
            textareaMaxHeight="200px"
            isLoading={ isPlaceholderData }
          />
        ),
      } : undefined,

      data?.abi ? {
        id: 'contract_abi' as const,
        title: 'ABI',
        component: (
          <RawDataSnippet
            data={ JSON.stringify(data.abi, undefined, 4) }
            title="Contract ABI"
            textareaMaxHeight="200px"
            isLoading={ isPlaceholderData }
          />
        ),
      } : undefined,

      data?.creation_bytecode || data?.deployed_bytecode ? {
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
                textareaMaxHeight="200px"
                isLoading={ isPlaceholderData }
              />
            ) }
            { data?.deployed_bytecode && (
              <RawDataSnippet
                data={ data.deployed_bytecode }
                title="Deployed ByteCode"
                rightSlot={ !data?.creation_bytecode && canBeVerified ? verificationButton : null }
                textareaMaxHeight="200px"
                isLoading={ isPlaceholderData }
              />
            ) }
          </Flex>
        ),
      } : undefined,
    ].filter(Boolean);
  }, [
    addressHash,
    constructorArgs,
    data?.abi,
    data?.compiler_settings,
    data?.creation_bytecode,
    data?.deployed_bytecode,
    data?.is_self_destructed,
    data?.source_code,
    data?.is_partially_verified,
    isPlaceholderData,
    canBeVerified,
  ]);
}
