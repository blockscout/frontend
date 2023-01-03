import { Flex, Skeleton, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import link from 'lib/link/link';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

const ContractCode = () => {
  const router = useRouter();

  const { data, isLoading, isError } = useApiQuery('contract', {
    pathParams: { id: router.query.id?.toString() },
    queryOptions: {
      enabled: Boolean(router.query.id),
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
      { data.creation_bytecode && (
        <RawDataSnippet
          data={ data.creation_bytecode }
          title="Contract creation code"
          rightSlot={ verificationButton }
        />
      ) }
      { data.deployed_bytecode && (
        <RawDataSnippet
          mt={ 6 }
          data={ data.deployed_bytecode }
          title="Deployed ByteCode"
        />
      ) }
    </>
  );
};

export default ContractCode;
