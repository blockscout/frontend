import {
  Grid,
  GridItem,
  Select,
  Box,
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
      gridTemplateColumns={{ base: '70px minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }}
      columnGap={ 3 }
      rowGap={ 4 }
      px={ 6 }
      py={ 4 }
      background="blackAlpha.50"
      borderRadius="12px"
      mb={ 4 }
      fontSize={{ base: 'sm', lg: 'md' }}
    >
      { gridData.map((item) => (
        <React.Fragment key={ item.name }>
          <GridItem alignSelf={{ base: 'start', lg: 'center' }} fontWeight={{ base: 500, lg: 600 }} textAlign="end">{ item.name }</GridItem>
          <GridItem display="flex" flexDir="column" rowGap={ 2 } alignItems="flex-start" >
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
            <Box fontWeight={{ base: 400, lg: 500 }} maxW="100%">
              { item.value }
            </Box>
          </GridItem>
        </React.Fragment>
      )) }
    </Grid>
  );
};

export default TxStateStorageItem;
