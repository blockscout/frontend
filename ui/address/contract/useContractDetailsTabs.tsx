import { Alert, Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { SmartContract } from 'types/api/contract';

import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

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
  addressHash: string;
  sourceAddress: string;
}

export default function useContractDetailsTabs({ data, isLoading, addressHash, sourceAddress }: Props): Array<Tab> {

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
        isLoading={ isLoading }
        addressHash={ addressHash }
        isPartiallyVerified={ Boolean(data?.is_partially_verified) }
      />
    );

    return [
      (constructorArgs || data?.source_code) ? {
        id: 'contract_source_code' as const,
        title: 'Code',
        component: (
          <Flex flexDir="column" rowGap={ 6 }>
            { constructorArgs && (
              <RawDataSnippet
                data={ constructorArgs }
                title="Constructor Arguments"
                textareaMaxHeight="200px"
                isLoading={ isLoading }
              />
            ) }
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
          <RawDataSnippet
            data={ JSON.stringify(data.compiler_settings, undefined, 4) }
            title="Compiler Settings"
            textareaMaxHeight="600px"
            isLoading={ isLoading }
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
            textareaMaxHeight="600px"
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
  }, [ isLoading, addressHash, data, constructorArgs, sourceAddress, canBeVerified ]);
}
