import {
  Grid,
  GridItem,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import type { TTxStateItemStorage } from 'data/txState';

const TxStateStorageItem = ({ storageItem }: {storageItem: TTxStateItemStorage}) => {
  const gridData = [
    { name: 'Storage Address:', value: storageItem.address },
    { name: 'Before:', value: storageItem.before, select: true },
    { name: 'After:', value: storageItem.after, select: true },
  ];

  const backgroundColor = useColorModeValue('white', 'gray.900');

  const OPTIONS = [ 'Hex', 'Number', 'Text', 'Address' ];
  return (
    <Grid
      gridTemplateColumns="auto 1fr"
      columnGap={ 3 }
      rowGap={ 4 }
      px={ 6 }
      py={ 4 }
      background="blackAlpha.50"
      borderRadius="12px"
      mb={ 4 }
    >
      { gridData.map((item) => (
        <>
          <GridItem alignSelf="center" fontWeight={ 600 } textAlign="end">{ item.name }</GridItem>
          <GridItem>
            { item.select && (
              <Select
                size="sm"
                borderRadius="base"
                focusBorderColor="none"
                display="inline-block"
                w="auto"
                mr={ 3 }
                background={ backgroundColor }
              >
                { OPTIONS.map((option) => <option key={ option } value={ option }>{ option }</option>) }
              </Select>
            ) }
            { item.value }
          </GridItem>
        </>
      )) }
    </Grid>
  );
};

export default TxStateStorageItem;
