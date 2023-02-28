import { Text, Grid, GridItem, Tooltip, Button, useColorModeValue, Alert, Link } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { Log } from 'types/api/log';

// import searchIcon from 'icons/search.svg';
import { space } from 'lib/html-entities';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';
import LogTopic from 'ui/shared/logs/LogTopic';

type Props = Log & {
  type: 'address' | 'transaction';
};

const RowHeader = ({ children }: { children: React.ReactNode }) => (
  <GridItem _notFirst={{ my: { base: 4, lg: 0 } }}>
    <Text fontWeight={ 500 }>{ children }</Text>
  </GridItem>
);

const LogItem = ({ address, index, topics, data, decoded, type, tx_hash: txHash }: Props) => {

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
      { !decoded && type === 'transaction' && (
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Alert status="warning" display="inline-table" whiteSpace="normal">
            To see accurate decoded input data, the contract must be verified.{ space }
            <Link href={ route({ pathname: '/address/[hash]/contract_verification', query: { hash: address.hash } }) }>Verify the contract here</Link>
          </Alert>
        </GridItem>
      ) }
      { hasTxInfo ? <RowHeader>Transaction</RowHeader> : <RowHeader>Address</RowHeader> }
      <GridItem display="flex" alignItems="center">
        <Address mr={{ base: 9, lg: 0 }}>
          { !hasTxInfo && <AddressIcon address={ address } mr={ 2 }/> }
          <AddressLink
            hash={ hasTxInfo ? txHash : address.hash }
            alias={ hasTxInfo ? undefined : address.name }
            type={ type === 'address' ? 'transaction' : 'address' }
          />
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
            <LogDecodedInputData data={ decoded }/>
          </GridItem>
        </>
      ) }
      <RowHeader>Topics</RowHeader>
      <GridItem>
        { topics.filter(Boolean).map((item, index) => (
          <LogTopic
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

export default React.memo(LogItem);
