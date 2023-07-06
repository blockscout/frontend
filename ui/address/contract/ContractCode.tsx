import { Flex, Skeleton, Button, Grid, GridItem, Alert, Link, chakra, Box } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { route } from 'nextjs-routes';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Address as AddressInfo } from 'types/api/address';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import * as stubs from 'stubs/contract';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import ContractSourceCode from './ContractSourceCode';

type Props = {
  addressHash?: string;
  // prop for pw tests only
  noSocket?: boolean;
}

const InfoItem = chakra(({ label, value, className, isLoading }: { label: string; value: string; className?: string; isLoading: boolean }) => (
  <GridItem display="flex" columnGap={ 6 } wordBreak="break-all" className={ className } alignItems="baseline">
    <Skeleton isLoaded={ !isLoading } w="170px" flexShrink={ 0 } fontWeight={ 500 }>{ label }</Skeleton>
    <Skeleton isLoaded={ !isLoading }>{ value }</Skeleton>
  </GridItem>
));

const ContractCode = ({ addressHash, noSocket }: Props) => {
  const [ isSocketOpen, setIsSocketOpen ] = React.useState(false);
  const [ isChangedBytecodeSocket, setIsChangedBytecodeSocket ] = React.useState<boolean>();

  const queryClient = useQueryClient();
  const addressInfo = queryClient.getQueryData<AddressInfo>(getResourceKey('address', { pathParams: { hash: addressHash } }));

  const { data, isPlaceholderData, isError } = useApiQuery('contract', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash) && (noSocket || isSocketOpen),
      refetchOnMount: false,
      placeholderData: addressInfo?.is_verified ? stubs.CONTRACT_CODE_VERIFIED : stubs.CONTRACT_CODE_UNVERIFIED,
    },
  });

  const handleChangedBytecodeMessage: SocketMessage.AddressChangedBytecode['handler'] = React.useCallback(() => {
    setIsChangedBytecodeSocket(true);
  }, [ ]);

  const channel = useSocketChannel({
    topic: `addresses:${ addressHash?.toLowerCase() }`,
    isDisabled: !addressHash,
    onJoin: () => setIsSocketOpen(true),
  });
  useSocketMessage({
    channel,
    event: 'changed_bytecode',
    handler: handleChangedBytecodeMessage,
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  const verificationButton = isPlaceholderData ? <Skeleton w="130px" h={ 8 } mr={ 3 } ml="auto" borderRadius="base"/> : (
    <Button
      size="sm"
      ml="auto"
      mr={ 3 }
      as="a"
      href={ route({ pathname: '/address/[hash]/contract_verification', query: { hash: addressHash || '' } }) }
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
        const valueEl = type === 'address' ?
          <LinkInternal href={ route({ pathname: '/address/[hash]', query: { hash: value } }) }>{ value }</LinkInternal> :
          <span>{ value }</span>;
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

  const verificationAlert = (() => {
    if (data?.is_verified_via_eth_bytecode_db) {
      return (
        <Alert status="warning" whiteSpace="pre-wrap" flexWrap="wrap">
          <span>This contract has been { data.is_partially_verified ? 'partially ' : '' }verified using </span>
          <LinkExternal
            href="https://docs.blockscout.com/about/features/ethereum-bytecode-database-microservice"
            fontSize="md"
          >
            Blockscout Bytecode Database
          </LinkExternal>
        </Alert>
      );
    }

    if (data?.is_verified_via_sourcify) {
      return (
        <Alert status="warning" whiteSpace="pre-wrap" flexWrap="wrap">
          <span>This contract has been { data.is_partially_verified ? 'partially ' : '' }verified via Sourcify. </span>
          { data.sourcify_repo_url && <LinkExternal href={ data.sourcify_repo_url } fontSize="md">View contract in Sourcify repository</LinkExternal> }
        </Alert>
      );
    }

    return null;
  })();

  return (
    <>
      <Flex flexDir="column" rowGap={ 2 } mb={ 6 } _empty={{ display: 'none' }}>
        { data?.is_verified && (
          <Skeleton isLoaded={ !isPlaceholderData }>
            <Alert status="success">Contract Source Code Verified ({ data.is_partially_verified ? 'Partial' : 'Exact' } Match)</Alert>
          </Skeleton>
        ) }
        { verificationAlert }
        { (data?.is_changed_bytecode || isChangedBytecodeSocket) && (
          <Alert status="warning">
            Warning! Contract bytecode has been changed and does not match the verified one. Therefore, interaction with this smart contract may be risky.
          </Alert>
        ) }
        { !data?.is_verified && data?.verified_twin_address_hash && !data?.minimal_proxy_address_hash && (
          <Alert status="warning" whiteSpace="pre-wrap" flexWrap="wrap">
            <span>Contract is not verified. However, we found a verified contract with the same bytecode in Blockscout DB </span>
            <Address>
              <AddressIcon address={{ hash: data.verified_twin_address_hash, is_contract: true, implementation_name: null }}/>
              <AddressLink type="address" hash={ data.verified_twin_address_hash } truncation="constant" ml={ 2 }/>
            </Address>
            <chakra.span mt={ 1 }>All functions displayed below are from ABI of that contract. In order to verify current contract, proceed with </chakra.span>
            <LinkInternal href={ route({ pathname: '/address/[hash]/contract_verification', query: { hash: addressHash || '' } }) }>
              Verify & Publish
            </LinkInternal>
            <span> page</span>
          </Alert>
        ) }
        { data?.minimal_proxy_address_hash && (
          <Alert status="warning" flexWrap="wrap" whiteSpace="pre-wrap">
            <span>Minimal Proxy Contract for </span>
            <Address>
              <AddressIcon address={{ hash: data.minimal_proxy_address_hash, is_contract: true, implementation_name: null }}/>
              <AddressLink type="address" hash={ data.minimal_proxy_address_hash } truncation="constant" ml={ 2 }/>
            </Address>
            <span>. </span>
            <Box>
              <Link href="https://eips.ethereum.org/EIPS/eip-1167">EIP-1167</Link>
              <span> - minimal bytecode implementation that delegates all calls to a known address</span>
            </Box>
          </Alert>
        ) }
      </Flex>
      { data?.is_verified && (
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} rowGap={ 4 } columnGap={ 6 } mb={ 8 }>
          { data.name && <InfoItem label="Contract name" value={ data.name } isLoading={ isPlaceholderData }/> }
          { data.compiler_version && <InfoItem label="Compiler version" value={ data.compiler_version } isLoading={ isPlaceholderData }/> }
          { data.evm_version && <InfoItem label="EVM version" value={ data.evm_version } textTransform="capitalize" isLoading={ isPlaceholderData }/> }
          { typeof data.optimization_enabled === 'boolean' &&
            <InfoItem label="Optimization enabled" value={ data.optimization_enabled ? 'true' : 'false' } isLoading={ isPlaceholderData }/> }
          { data.optimization_runs && <InfoItem label="Optimization runs" value={ String(data.optimization_runs) } isLoading={ isPlaceholderData }/> }
          { data.verified_at &&
            <InfoItem label="Verified at" value={ dayjs(data.verified_at).format('LLLL') } wordBreak="break-word" isLoading={ isPlaceholderData }/> }
          { data.file_path && <InfoItem label="Contract file path" value={ data.file_path } wordBreak="break-word" isLoading={ isPlaceholderData }/> }
        </Grid>
      ) }
      <Flex flexDir="column" rowGap={ 6 }>
        { constructorArgs && (
          <RawDataSnippet
            data={ constructorArgs }
            title="Constructor Arguments"
            textareaMaxHeight="200px"
            isLoading={ isPlaceholderData }
          />
        ) }
        { data?.source_code && (
          <ContractSourceCode
            address={ addressHash }
            implementationAddress={ addressInfo?.implementation_address ?? undefined }
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
            rightSlot={ data.is_verified || data.is_self_destructed ? null : verificationButton }
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
            textareaMaxHeight="200px"
            isLoading={ isPlaceholderData }
          />
        ) }
      </Flex>
    </>
  );
};

export default ContractCode;
