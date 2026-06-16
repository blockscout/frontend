// SPDX-License-Identifier: LicenseRef-Blockscout

import { Grid, GridItem } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

// import searchIcon from 'src/sprite/icons/search.svg';
import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import TxEntity from 'src/slices/tx/components/entity/TxEntity';

import type { DataType } from 'src/shared/data/RawInputData';
import RawInputData from 'src/shared/data/RawInputData';
import DetailedInfoTimestamp from 'src/shared/detailed-info/DetailedInfoTimestamp';

import { Alert } from 'src/toolkit/chakra/alert';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { space } from 'src/toolkit/utils/htmlEntities';

import LogDecodedInputData from './LogDecodedInputData';
import LogIndex from './LogIndex';
import LogTopic from './LogTopic';

interface Props {
  data: schemas['Log'];
  isLoading?: boolean;
  defaultDataType?: DataType;
  chainData?: ClusterChainConfig;
  type: 'address' | 'transaction';
}

const RowHeader = ({ children, isLoading }: { children: React.ReactNode; isLoading?: boolean }) => (
  <GridItem _notFirst={{ my: { base: 4, lg: 0 } }}>
    <Skeleton fontWeight={ 500 } loading={ isLoading } display="inline-block">{ children }</Skeleton>
  </GridItem>
);

const LogItem = ({
  data,
  type,
  isLoading,
  defaultDataType,
  chainData,
}: Props) => {

  const hasTxInfo = type === 'address' && data.transaction_hash;

  return (
    <Grid
      gridTemplateColumns={{ base: 'minmax(0, 1fr)', lg: '200px minmax(0, 1fr)' }}
      gap={{ base: 2, lg: 8 }}
      py={ 8 }
      _notFirst={{
        borderTopWidth: '1px',
        borderTopColor: { _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' },
      }}
      _first={{
        pt: 0,
      }}
    >
      { !data.decoded && !data.address.is_verified && type === 'transaction' && (
        <GridItem colSpan={{ base: 1, lg: 2 }}>
          <Alert status="warning" display="inline-table" whiteSpace="normal">
            To see accurate decoded input data, the contract must be verified.{ space }
            <Link href={ route({ pathname: '/address/[hash]/contract-verification', query: { hash: data.address.hash } }) }>Verify the contract here</Link>
          </Alert>
        </GridItem>
      ) }
      { hasTxInfo ? <RowHeader isLoading={ isLoading }>Transaction</RowHeader> : <RowHeader isLoading={ isLoading }>Address</RowHeader> }
      <GridItem display="flex" alignItems="center">
        { type === 'address' && data.transaction_hash ? (
          <TxEntity
            hash={ data.transaction_hash }
            isLoading={ isLoading }
            mr={{ base: 9, lg: 4 }}
            w="100%"
            chain={ chainData }
            noCopy
          />
        ) : (
          <AddressEntity
            address={ data.address }
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
        <LogIndex
          isLoading={ isLoading }
          textStyle="sm"
          ml="auto"
          minW={ 8 }
          height={ 8 }
        >
          { data.index }
        </LogIndex>
      </GridItem>
      { hasTxInfo && data.block_timestamp ? (
        <>
          <RowHeader isLoading={ isLoading }>Timestamp</RowHeader>
          <GridItem>
            <DetailedInfoTimestamp timestamp={ data.block_timestamp } isLoading={ isLoading }/>
          </GridItem>
        </>
      ) : null }
      { data.decoded && (
        <>
          <RowHeader isLoading={ isLoading }>Decode input data</RowHeader>
          <GridItem>
            <LogDecodedInputData data={ data.decoded } isLoading={ isLoading }/>
          </GridItem>
        </>
      ) }
      <RowHeader isLoading={ isLoading }>Topics</RowHeader>
      <GridItem>
        { data.topics.filter(Boolean).map((item, index) => (
          <LogTopic
            key={ index }
            hex={ item }
            index={ index }
            isLoading={ isLoading }
          />
        )) }
      </GridItem>
      <RowHeader isLoading={ isLoading }>Data</RowHeader>
      { defaultDataType ? (
        <RawInputData hex={ data.data } isLoading={ isLoading } defaultDataType={ defaultDataType } minHeight="53px"/>
      ) : (
        <Skeleton
          loading={ isLoading }
          p={ 4 }
          fontSize="sm"
          borderRadius="md"
          bgColor={ isLoading ? undefined : { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } }
        >
          { data.data }
        </Skeleton>
      ) }
    </Grid>
  );
};

export default React.memo(LogItem);
