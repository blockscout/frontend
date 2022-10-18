import { Text, Grid, GridItem, Tooltip, Button, useColorModeValue, Alert, Link } from '@chakra-ui/react';
import React from 'react';

import type { Log } from 'types/api/log';

// import searchIcon from 'icons/search.svg';
import { space } from 'lib/html-entities';
import link from 'lib/link/link';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TxLogTopic from 'ui/tx/logs/TxLogTopic';
import DecodedInputData from 'ui/tx/TxDecodedInputData';

type Props = Log;

const RowHeader = ({ children }: { children: React.ReactNode }) => (
  <GridItem _notFirst={{ my: { base: 4, lg: 0 } }}>
    <Text fontWeight={ 500 }>{ children }</Text>
  </GridItem>
);

const TxLogItem = ({ address, index, topics, data, decoded }: Props) => {

  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const dataBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

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
      { !decoded && (
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Alert status="warning" display="inline-table" whiteSpace="normal">
            To see accurate decoded input data, the contract must be verified.{ space }
            <Link href={ link('address_contract_verification', { id: address.hash }) }>Verify the contract here</Link>
          </Alert>
        </GridItem>
      ) }
      <RowHeader>Address</RowHeader>
      <GridItem display="flex" alignItems="center">
        <Address mr={{ base: 9, lg: 0 }}>
          <AddressIcon hash={ address.hash }/>
          <AddressLink hash={ address.hash } alias={ address.name } ml={ 2 }/>
        </Address>
        { /* api doesn't have find topic feature yet */ }
        { /* <Tooltip label="Find matches topic">
          <Link ml={ 2 } mr={{ base: 9, lg: 0 }} display="inline-flex">
            <Icon as={ searchIcon } boxSize={ 5 }/>
          </Link>
        </Tooltip> */ }
        <Tooltip label="Log index">
          <Button variant="outline" colorScheme="gray" isActive ml="auto" size="sm" fontWeight={ 400 }>
            { index }
          </Button>
        </Tooltip>
      </GridItem>
      { decoded && (
        <>
          <RowHeader>Decode input data</RowHeader>
          <GridItem>
            <DecodedInputData data={ decoded }/>
          </GridItem>
        </>
      ) }
      <RowHeader>Topics</RowHeader>
      <GridItem>
        { topics.filter(Boolean).map((item, index) => (
          <TxLogTopic
            key={ index }
            hex={ item }
            index={ index }
          />
        )) }
      </GridItem>
      <RowHeader>Data</RowHeader>
      <GridItem p={ 4 } fontSize="sm" borderRadius="md" bgColor={ dataBgColor }>
        { data }
      </GridItem>
    </Grid>
  );
};

export default React.memo(TxLogItem);
