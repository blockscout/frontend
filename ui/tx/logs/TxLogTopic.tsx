import { Flex, Button, Select, Box } from '@chakra-ui/react';
import React from 'react';

import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  hex: string;
  index: number;
}

type DataType = 'Hex' | 'Dec'
const OPTIONS: Array<DataType> = [ 'Hex', 'Dec' ];

const TxLogTopic = ({ hex, index }: Props) => {
  const [ selectedDataType, setSelectedDataType ] = React.useState<DataType>('Hex');

  const handleSelectChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDataType(event.target.value as DataType);
  }, []);

  return (
    <Flex alignItems="center" px={{ base: 0, lg: 3 }} _notFirst={{ mt: 3 }} overflow="hidden" maxW="100%">
      <Button variant="outline" colorScheme="gray" isActive size="xs" fontWeight={ 400 } mr={ 3 } w={ 6 }>
        { index }
      </Button>
      { /* temporary condition juse to show different states of the component */ }
      { /* delete when ther will be real data */ }
      { index > 0 && (
        <Select
          size="sm"
          borderRadius="base"
          value={ selectedDataType }
          onChange={ handleSelectChange }
          focusBorderColor="none"
          w="75px"
          mr={ 3 }
          flexShrink={ 0 }
        >
          { OPTIONS.map((option) => <option key={ option } value={ option }>{ option }</option>) }
        </Select>
      ) }
      <Box overflow="hidden" whiteSpace="nowrap">
        <HashStringShortenDynamic hash={ hex }/>
      </Box>
    </Flex>
  );
};

export default React.memo(TxLogTopic);
