import { Flex, Skeleton, Button, Grid, GridItem, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import link from 'lib/link/link';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

const DynamicContractSourceCode = dynamic(
  () => import('./ContractSourceCode'),
  { ssr: false },
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <GridItem display="flex" columnGap={ 6 }>
    <Text w="170px" flexShrink={ 0 } fontWeight={ 500 }>{ label }</Text>
    <Text wordBreak="break-all">{ value }</Text>
  </GridItem>
);

const ContractCode = () => {
  const router = useRouter();

  const { data, isLoading, isError } = useApiQuery('contract', {
    pathParams: { id: router.query.id?.toString() },
    queryOptions: {
      enabled: Boolean(router.query.id),
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
      href={ link('address_contract_verification', { id: router.query.id?.toString() }) }
    >
        Verify & publish
    </Button>
  );

  return (
    <>
      { data.is_verified && (
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} rowGap={ 4 } columnGap={ 6 } mb={ 8 }>
          { data.name && <InfoItem label="Contract name" value={ data.name }/> }
          { data.compiler_version && <InfoItem label="Compiler version" value={ data.compiler_version }/> }
          { data.evm_version && <InfoItem label="EVM version" value={ data.evm_version }/> }
          { typeof data.optimization_enabled === 'boolean' && <InfoItem label="Optimization enabled" value={ data.optimization_enabled ? 'true' : 'false' }/> }
          { data.optimization_runs && <InfoItem label="Optimization runs" value={ String(data.optimization_runs) }/> }
          { data.verified_at && <InfoItem label="Verified at" value={ data.verified_at }/> }
        </Grid>
      ) }
      <Flex flexDir="column" rowGap={ 6 }>
        { data.constructor_args && (
          <RawDataSnippet
            data={ data.constructor_args }
            title="Constructor Arguments"
          />
        ) }
        { data.source_code && (
          <DynamicContractSourceCode
            data={ data.source_code }
            hasSol2Yml={ Boolean(data.can_be_visualized_via_sol2uml) }
            address={ router.query.id?.toString() }
          />
        ) }
        { data.abi && (
          <RawDataSnippet
            data={ JSON.stringify(data.abi) }
            title="Contract ABI"
            textareaMinHeight="200px"
          />
        ) }
        { data.creation_bytecode && (
          <RawDataSnippet
            data={ data.creation_bytecode }
            title="Contract creation code"
            rightSlot={ data.is_verified ? null : verificationButton }
          />
        ) }
        { data.deployed_bytecode && (
          <RawDataSnippet
            data={ data.deployed_bytecode }
            title="Deployed ByteCode"
          />
        ) }
      </Flex>
    </>
  );
};

export default ContractCode;
