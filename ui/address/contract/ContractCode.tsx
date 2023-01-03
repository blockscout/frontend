import { Box, Text, Flex, Skeleton, Textarea, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import link from 'lib/link/link';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

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

  return (
    <>
      { data.creation_bytecode && (
        <Box>
          <Flex alignItems="center" mb={ 3 }>
            <Text fontWeight={ 500 }>Contract creation code</Text>
            <Button
              size="sm"
              ml="auto"
              mr={ 3 }
              as="a"
              href={ link('address_contract_verification', { id: router.query.id?.toString() }) }
            >
                Verify & publish
            </Button>
            <CopyToClipboard text={ data.creation_bytecode }/>
          </Flex>
          <Textarea
            variant="filledInactive"
            p={ 4 }
            minHeight="400px"
            value={ data.creation_bytecode }
            fontSize="sm"
            borderRadius="md"
            readOnly
          />
        </Box>
      ) }
      { data.deployed_bytecode && (
        <Box mt={ 6 }>
          <Flex justifyContent="space-between" mb={ 3 }>
            <Text fontWeight={ 500 }>Deployed ByteCode</Text>
            <CopyToClipboard text={ data.deployed_bytecode }/>
          </Flex>
          <Textarea
            variant="filledInactive"
            p={ 4 }
            minHeight="400px"
            value={ data.deployed_bytecode }
            fontSize="sm"
            borderRadius="md"
            readOnly
          />
        </Box>
      ) }
    </>
  );
};

export default ContractCode;
