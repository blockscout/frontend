import { Grid, GridItem, Tooltip, Button, useColorModeValue, Alert, Link, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { Log } from 'types/api/log';

import { route } from 'nextjs-routes';

// import searchIcon from 'icons/search.svg';
import { space } from 'lib/html-entities';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';
import LogTopic from 'ui/shared/logs/LogTopic';

type Props = Log & {
  type: 'address' | 'transaction';
  isLoading?: boolean;
};

const RowHeader = ({ children, isLoading }: { children: React.ReactNode; isLoading?: boolean }) => (
  <GridItem _notFirst={{ my: { base: 4, lg: 0 } }}>
    <Skeleton fontWeight={ 500 } isLoaded={ !isLoading } display="inline-block">{ children }</Skeleton>
  </GridItem>
);

const LogItem = ({ address, index, topics, data, decoded, type, transaction_hash: txHash, isLoading }: Props) => {

  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const dataBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  const hasTxInfo = type === 'address' && txHash;

  return (
    <Grid
      gridTemplateColumns={{ base: 'minmax(0, 1fr)', lg: '200px minmax(0, 1fr)' }}
      gap={{ base: 2, lg: 8 }}
      py={ 8 }
      _notFirst={{
        borderTopWidth: '1px',
        borderTopColor: borderColor,
      }}
      _first={{
        pt: 0,
      }}
    >
      { !decoded && !address.is_verified && type === 'transaction' && (
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Alert status="warning" display="inline-table" whiteSpace="normal">
            To see accurate decoded input data, the contract must be verified.{ space }
            <Link href={ route({ pathname: '/address/[hash]/contract-verification', query: { hash: address.hash } }) }>Verify the contract here</Link>
          </Alert>
        </GridItem>
      ) }
      { hasTxInfo ? <RowHeader isLoading={ isLoading }>Transaction</RowHeader> : <RowHeader isLoading={ isLoading }>Address</RowHeader> }
      <GridItem display="flex" alignItems="center">
        { type === 'address' && txHash ? (
          <TxEntity
            hash={ txHash }
            isLoading={ isLoading }
            mr={{ base: 9, lg: 4 }}
          />
        ) : (
          <AddressEntity
            address={ address }
            isLoading={ isLoading }
            mr={{ base: 9, lg: 4 }}
          />
        ) }
        { /* api doesn't have find topic feature yet */ }
        { /* <Tooltip label="Find matches topic">
          <Link ml={ 2 } mr={{ base: 9, lg: 0 }} display="inline-flex">
            <Icon as={ searchIcon } boxSize={ 5 }/>
          </Link>
        </Tooltip> */ }
        <Skeleton isLoaded={ !isLoading } ml="auto" borderRadius="base">
          <Tooltip label="Log index">
            <Button variant="outline" colorScheme="gray" data-selected="true" size="sm" fontWeight={ 400 }>
              { index }
            </Button>
          </Tooltip>
        </Skeleton>
      </GridItem>
      { decoded && (
        <>
          <RowHeader isLoading={ isLoading }>Decode input data</RowHeader>
          <GridItem>
            <LogDecodedInputData data={ decoded } isLoading={ isLoading }/>
          </GridItem>
        </>
      ) }
      <RowHeader isLoading={ isLoading }>Topics</RowHeader>
      <GridItem>
        { topics.filter(Boolean).map((item, index) => (
          <LogTopic
            key={ index }
            hex={ item }
            index={ index }
            isLoading={ isLoading }
          />
        )) }
      </GridItem>
      <RowHeader isLoading={ isLoading }>Data</RowHeader>
      <Skeleton isLoaded={ !isLoading } p={ 4 } fontSize="sm" borderRadius="md" bgColor={ isLoading ? undefined : dataBgColor }>
        { data }
      </Skeleton>
    </Grid>
  );
};

export default React.memo(LogItem);
