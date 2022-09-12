import { SearchIcon } from '@chakra-ui/icons';
import { Text, Grid, GridItem, Link, Tooltip, Button, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import AddressIcon from 'ui/shared/AddressIcon';
import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';
import TxLogTopic from 'ui/tx/logs/TxLogTopic';
import DecodedInputData from 'ui/tx/TxDecodedInputData';

interface Props {
  address: string;
  topics: Array<{ hex: string }>;
  data: string;
  index: number;
}

const RowHeader = ({ children }: { children: React.ReactNode }) => <GridItem><Text fontWeight={ 500 }>{ children }</Text></GridItem>;

const TxLogItem = ({ address, index, topics, data }: Props) => {
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const dataBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Grid gridTemplateColumns="200px 1fr" gap={ 8 } py={ 8 } _notFirst={{ borderTopWidth: '1px', borderTopColor: borderColor }}>
      <RowHeader>Address</RowHeader>
      <GridItem display="flex" alignItems="center">
        <AddressIcon address={ address }/>
        <AddressLinkWithTooltip address={ address } columnGap={ 0 } ml={ 2 } fontWeight="400" withCopy={ false }/>
        <Tooltip label="Find matches topic">
          <Link ml={ 2 }>
            <SearchIcon w={ 5 } h={ 5 }/>
          </Link>
        </Tooltip>
        <Tooltip label="Log index">
          <Button variant="outline" isActive ml="auto" size="sm" fontWeight={ 400 }>
            { index }
          </Button>
        </Tooltip>
      </GridItem>
      <RowHeader>Decode input data</RowHeader>
      <GridItem>
        <DecodedInputData/>
      </GridItem>
      <RowHeader>Topics</RowHeader>
      <GridItem>
        { topics.map((item, index) => <TxLogTopic key={ index } { ...item } index={ index }/>) }
      </GridItem>
      <RowHeader>Data</RowHeader>
      <GridItem p={ 4 } fontSize="sm" borderRadius="md" bgColor={ dataBgColor }>
        { data }
      </GridItem>
    </Grid>
  );
};

export default React.memo(TxLogItem);
