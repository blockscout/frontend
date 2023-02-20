import { Flex, Skeleton, Button, Grid, GridItem, Text, Alert, Link, chakra, Box } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
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
}

const InfoItem = chakra(({ label, value, className }: { label: string; value: string; className?: string }) => (
  <GridItem display="flex" columnGap={ 6 } wordBreak="break-all" className={ className }>
    <Text w="170px" flexShrink={ 0 } fontWeight={ 500 }>{ label }</Text>
    <Text>{ value }</Text>
  </GridItem>
));

const ContractCode = ({ addressHash }: Props) => {
  const { data, isLoading, isError } = useApiQuery('contract', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
      refetchOnMount: false,
    },
  });

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (isLoading) {
    return (
      <>
        <Flex justifyContent="space-between" mb={ 2 }>
          <Skeleton w="180px" h={ 5 } borderRadius="full"/>
          <Skeleton w={ 5 } h={ 5 }/>
        </Flex>
        <Skeleton w="100%" h="250px" borderRadius="md"/>
        <Flex justifyContent="space-between" mb={ 2 } mt={ 6 }>
          <Skeleton w="180px" h={ 5 } borderRadius="full"/>
          <Skeleton w={ 5 } h={ 5 }/>
        </Flex>
        <Skeleton w="100%" h="400px" borderRadius="md"/>
      </>
    );
  }

  const verificationButton = (
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
    if (!data.decoded_constructor_args) {
      return data.constructor_args;
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

  const externalLibraries = (() => {
    if (!data.external_libraries || data.external_libraries.length === 0) {
      return null;
    }

    return data.external_libraries.map((item) => (
      <Box key={ item.address_hash }>
        <chakra.span fontWeight={ 500 }>{ item.name }: </chakra.span>
        <LinkInternal href={ route({ pathname: '/address/[hash]', query: { hash: item.address_hash, tab: 'contract' } }) }>{ item.address_hash }</LinkInternal>
      </Box>
    ));
  })();

  return (
    <>
      <Flex flexDir="column" rowGap={ 2 } mb={ 6 } _empty={{ display: 'none' }}>
        { data.is_verified && <Alert status="success">Contract Source Code Verified (Exact Match)</Alert> }
        { data.is_verified_via_sourcify && (
          <Alert status="warning" whiteSpace="pre-wrap" flexWrap="wrap">
            <span>This contract has been { data.is_partially_verified ? 'partially ' : '' }verified via Sourcify. </span>
            { data.sourcify_repo_url && <LinkExternal href={ data.sourcify_repo_url } fontSize="md">View contract in Sourcify repository</LinkExternal> }
          </Alert>
        ) }
        { data.is_changed_bytecode && (
          <Alert status="warning">
            Warning! Contract bytecode has been changed and does not match the verified one. Therefore, interaction with this smart contract may be risky.
          </Alert>
        ) }
        { !data.is_verified && data.verified_twin_address_hash && !data.minimal_proxy_address_hash && (
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
        { data.minimal_proxy_address_hash && (
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
      { data.is_verified && (
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} rowGap={ 4 } columnGap={ 6 } mb={ 8 }>
          { data.name && <InfoItem label="Contract name" value={ data.name }/> }
          { data.compiler_version && <InfoItem label="Compiler version" value={ data.compiler_version }/> }
          { data.evm_version && <InfoItem label="EVM version" value={ data.evm_version } textTransform="capitalize"/> }
          { typeof data.optimization_enabled === 'boolean' && <InfoItem label="Optimization enabled" value={ data.optimization_enabled ? 'true' : 'false' }/> }
          { data.optimization_runs && <InfoItem label="Optimization runs" value={ String(data.optimization_runs) }/> }
          { data.verified_at && <InfoItem label="Verified at" value={ dayjs(data.verified_at).format('LLLL') } wordBreak="break-word"/> }
        </Grid>
      ) }
      <Flex flexDir="column" rowGap={ 6 }>
        { constructorArgs && (
          <RawDataSnippet
            data={ constructorArgs }
            title="Constructor Arguments"
            textareaMaxHeight="200px"
          />
        ) }
        { data.source_code && (
          <ContractSourceCode
            data={ data.source_code }
            hasSol2Yml={ Boolean(data.can_be_visualized_via_sol2uml) }
            address={ addressHash }
            isViper={ Boolean(data.is_vyper_contract) }
            filePath={ data.file_path }
            additionalSource={ data.additional_sources }
          />
        ) }
        { Boolean(data.compiler_settings) && (
          <RawDataSnippet
            data={ JSON.stringify(data.compiler_settings) }
            title="Compiler Settings"
            textareaMaxHeight="200px"
          />
        ) }
        { data.abi && (
          <RawDataSnippet
            data={ JSON.stringify(data.abi) }
            title="Contract ABI"
            textareaMaxHeight="200px"
          />
        ) }
        { data.creation_bytecode && (
          <RawDataSnippet
            data={ data.creation_bytecode }
            title="Contract creation code"
            rightSlot={ data.is_verified ? null : verificationButton }
            beforeSlot={ data.is_self_destructed ? (
              <Alert status="info" whiteSpace="pre-wrap" mb={ 3 }>
                Contracts that self destruct in their constructors have no contract code published and cannot be verified.
                Displaying the init data provided of the creating transaction.
              </Alert>
            ) : null }
            textareaMaxHeight="200px"
          />
        ) }
        { data.deployed_bytecode && (
          <RawDataSnippet
            data={ data.deployed_bytecode }
            title="Deployed ByteCode"
            textareaMaxHeight="200px"
          />
        ) }
        { externalLibraries && (
          <RawDataSnippet
            data={ externalLibraries }
            title="External Libraries"
            textareaMaxHeight="200px"
          />
        ) }
      </Flex>
    </>
  );
};

export default ContractCode;
