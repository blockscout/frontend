import {
  Grid,
  GridItem,
  Select,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import type { TTxStateItemStorage } from 'data/txState';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

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
      gridTemplateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }}
      columnGap={ 3 }
      rowGap={{ base: 2.5, lg: 4 }}
      px={{ base: 3, lg: 6 }}
      py={{ base: 3, lg: 4 }}
      backgroundColor={ useColorModeValue('blackAlpha.50', 'whiteAlpha.100') }
      borderRadius="12px"
      mb={ 4 }
      fontSize="sm"
    >
      { gridData.map((item) => (
        <React.Fragment key={ item.name }>
          <GridItem
            alignSelf="center"
            fontWeight={ 600 }
            textAlign={{ base: 'start', lg: 'end' }}
            _notFirst={{ mt: { base: 0.5, lg: 0 } }}
          >
            { item.name }
          </GridItem>
          <GridItem display="flex" flexDir="row" columnGap={ 3 } alignItems="center" >
            { item.select && (
              <Select
                size="xs"
                borderRadius="base"
                focusBorderColor="none"
                display="inline-block"
                w="auto"
                flexShrink={ 0 }
                background={ backgroundColor }
              >
                { OPTIONS.map((option) => <option key={ option } value={ option }>{ option }</option>) }
              </Select>
            ) }
            <Box fontWeight={ 500 } whiteSpace="nowrap" overflow="hidden">
              <HashStringShortenDynamic fontWeight="500" hash={ item.value }/>
            </Box>
          </GridItem>
        </React.Fragment>
      )) }
    </Grid>
  );
};

export default TxStateStorageItem;
