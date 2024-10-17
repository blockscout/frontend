import { Flex, Skeleton, Button, Alert, Box } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import type { Channel } from 'phoenix';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Address as AddressInfo } from 'types/api/address';
import type { SmartContract } from 'types/api/contract';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import { getResourceKey } from 'lib/api/useApiQuery';
import useSocketMessage from 'lib/socket/useSocketMessage';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import ContractDetailsAlerts from './alerts/ContractDetailsAlerts';
import ContractSourceCode from './ContractSourceCode';
import ContractDetailsInfo from './info/ContractDetailsInfo';

type Props = {
  addressHash?: string;
  contractQuery: UseQueryResult<SmartContract, ResourceError<unknown>>;
  channel: Channel | undefined;
}

const ContractDetails = ({ addressHash, contractQuery, channel }: Props) => {
  const queryClient = useQueryClient();
  const addressInfo = queryClient.getQueryData<AddressInfo>(getResourceKey('address', { pathParams: { hash: addressHash } }));

  const { data, isPlaceholderData, isError } = contractQuery;

  const handleContractWasVerifiedMessage: SocketMessage.SmartContractWasVerified['handler'] = React.useCallback(() => {
    queryClient.refetchQueries({
      queryKey: getResourceKey('address', { pathParams: { hash: addressHash } }),
    });
    queryClient.refetchQueries({
      queryKey: getResourceKey('contract', { pathParams: { hash: addressHash } }),
    });
  }, [ addressHash, queryClient ]);

  useSocketMessage({
    channel,
    event: 'smart_contract_was_verified',
    handler: handleContractWasVerifiedMessage,
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  const canBeVerified = !data?.is_self_destructed && !data?.is_verified;

  const verificationButton = isPlaceholderData ? (
    <Skeleton
      w="130px"
      h={ 8 }
      mr={ data?.is_partially_verified ? 0 : 3 }
      ml={ data?.is_partially_verified ? 0 : 'auto' }
      borderRadius="base"
      flexShrink={ 0 }
    />
  ) : (
    <Button
      size="sm"
      mr={ data?.is_partially_verified ? 0 : 3 }
      ml={ data?.is_partially_verified ? 0 : 'auto' }
      flexShrink={ 0 }
      as="a"
      href={ route({ pathname: '/address/[hash]/contract-verification', query: { hash: addressHash || '' } }) }
    >
        Verify & publish
    </Button>
  );

  const constructorArgs = (() => {
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
  })();

  return (
    <>
      <ContractDetailsAlerts
        data={ data }
        isPlaceholderData={ isPlaceholderData }
        addressHash={ addressHash }
        channel={ channel }
      />
      { data?.is_verified && <ContractDetailsInfo data={ data } isPlaceholderData={ isPlaceholderData } addressHash={ addressHash }/> }
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
            implementations={ addressInfo?.implementations || undefined }
          />
        ) }
        { data?.compiler_settings ? (
          <RawDataSnippet
            data={ JSON.stringify(data.compiler_settings, undefined, 4) }
            title="Compiler Settings"
            textareaMaxHeight="200px"
            isLoading={ isPlaceholderData }
          />
        ) : null }
        { data?.abi && (
          <RawDataSnippet
            data={ JSON.stringify(data.abi, undefined, 4) }
            title="Contract ABI"
            textareaMaxHeight="200px"
            isLoading={ isPlaceholderData }
          />
        ) }
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
    </>
  );
};

export default ContractDetails;
