import { Flex, Skeleton, Button, Grid, GridItem, Alert, Link, chakra, Box } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Address as AddressInfo } from 'types/api/address';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import * as stubs from 'stubs/contract';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import LinkExternal from 'ui/shared/LinkExternal';
import LinkInternal from 'ui/shared/LinkInternal';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import ContractSecurityAudits from './ContractSecurityAudits';
import ContractSourceCode from './ContractSourceCode';

type Props = {
  addressHash?: string;
  // prop for pw tests only
  noSocket?: boolean;
}

type InfoItemProps = {
  label: string;
  content: string | React.ReactNode;
  className?: string;
  isLoading: boolean;
}

const InfoItem = chakra(({ label, content, className, isLoading }: InfoItemProps) => (
  <GridItem display="flex" columnGap={ 6 } wordBreak="break-all" className={ className } alignItems="baseline">
    <Skeleton isLoaded={ !isLoading } w="170px" flexShrink={ 0 } fontWeight={ 500 }>{ label }</Skeleton>
    <Skeleton isLoaded={ !isLoading }>{ content }</Skeleton>
  </GridItem>
));

const ContractCode = ({ addressHash, noSocket }: Props) => {
  const [ isQueryEnabled, setIsQueryEnabled ] = React.useState(false);
  const [ isChangedBytecodeSocket, setIsChangedBytecodeSocket ] = React.useState<boolean>();

  const queryClient = useQueryClient();
  const addressInfo = queryClient.getQueryData<AddressInfo>(getResourceKey('address', { pathParams: { hash: addressHash } }));

  const { data, isPlaceholderData, isError } = useApiQuery('contract', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash) && (noSocket || isQueryEnabled),
      refetchOnMount: false,
      placeholderData: addressInfo?.is_verified ? stubs.CONTRACT_CODE_VERIFIED : stubs.CONTRACT_CODE_UNVERIFIED,
    },
  });

  const handleChangedBytecodeMessage: SocketMessage.AddressChangedBytecode['handler'] = React.useCallback(() => {
    setIsChangedBytecodeSocket(true);
  }, [ ]);

  const handleContractWasVerifiedMessage: SocketMessage.SmartContractWasVerified['handler'] = React.useCallback(() => {
    queryClient.refetchQueries({
      queryKey: getResourceKey('address', { pathParams: { hash: addressHash } }),
    });
    queryClient.refetchQueries({
      queryKey: getResourceKey('contract', { pathParams: { hash: addressHash } }),
    });
  }, [ addressHash, queryClient ]);

  const enableQuery = React.useCallback(() => setIsQueryEnabled(true), []);

  const channel = useSocketChannel({
    topic: `addresses:${ addressHash?.toLowerCase() }`,
    isDisabled: !addressHash,
    onJoin: enableQuery,
    onSocketError: enableQuery,
  });
  useSocketMessage({
    channel,
    event: 'changed_bytecode',
    handler: handleChangedBytecodeMessage,
  });
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
            <Alert status="success" flexWrap="wrap" rowGap={ 3 } columnGap={ 5 }>
              <span>Contract Source Code Verified ({ data.is_partially_verified ? 'Partial' : 'Exact' } Match)</span>
              { data.is_partially_verified ? verificationButton : null }
            </Alert>
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
            <AddressEntity
              address={{ hash: data.verified_twin_address_hash, is_contract: true, implementation_name: null }}
              truncation="constant"
              fontSize="sm"
              fontWeight="500"
            />
            <chakra.span mt={ 1 }>All functions displayed below are from ABI of that contract. In order to verify current contract, proceed with </chakra.span>
            <LinkInternal href={ route({ pathname: '/address/[hash]/contract-verification', query: { hash: addressHash || '' } }) }>
              Verify & Publish
            </LinkInternal>
            <span> page</span>
          </Alert>
        ) }
        { data?.minimal_proxy_address_hash && (
          <Alert status="warning" flexWrap="wrap" whiteSpace="pre-wrap">
            <span>Minimal Proxy Contract for </span>
            <AddressEntity
              address={{ hash: data.minimal_proxy_address_hash, is_contract: true, implementation_name: null }}
              truncation="constant"
              fontSize="sm"
              fontWeight="500"
              noCopy
            />
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
          { data.name && <InfoItem label="Contract name" content={ data.name } isLoading={ isPlaceholderData }/> }
          { data.compiler_version && <InfoItem label="Compiler version" content={ data.compiler_version } isLoading={ isPlaceholderData }/> }
          { data.evm_version && <InfoItem label="EVM version" content={ data.evm_version } textTransform="capitalize" isLoading={ isPlaceholderData }/> }
          { typeof data.optimization_enabled === 'boolean' &&
            <InfoItem label="Optimization enabled" content={ data.optimization_enabled ? 'true' : 'false' } isLoading={ isPlaceholderData }/> }
          { data.optimization_runs && <InfoItem label="Optimization runs" content={ String(data.optimization_runs) } isLoading={ isPlaceholderData }/> }
          { data.verified_at &&
            <InfoItem label="Verified at" content={ dayjs(data.verified_at).format('llll') } wordBreak="break-word" isLoading={ isPlaceholderData }/> }
          { data.file_path && <InfoItem label="Contract file path" content={ data.file_path } wordBreak="break-word" isLoading={ isPlaceholderData }/> }
          { config.UI.hasContractAuditReports && (
            <InfoItem
              label="Security audit"
              content={ <ContractSecurityAudits addressHash={ addressHash }/> }
              isLoading={ isPlaceholderData }
            />
          ) }
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

export default ContractCode;
