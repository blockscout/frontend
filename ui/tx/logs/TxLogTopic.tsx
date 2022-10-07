import { Flex, Button, Select, Box } from '@chakra-ui/react';
import React from 'react';

import AddressLink from 'ui/shared/address/AddressLink';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

interface Props {
  hex: string;
  decoded?: string;
  type?: string;
  index: number;
}

type DataType = 'Hex' | 'Dec';
const OPTIONS: Array<DataType> = [ 'Hex', 'Dec' ];

const TxLogTopic = ({ hex, index, decoded, type }: Props) => {
  const [ selectedDataType, setSelectedDataType ] = React.useState<DataType>('Hex');

  const handleSelectChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDataType(event.target.value as DataType);
  }, []);

  const content = (() => {
    if (selectedDataType === 'Dec' && type === 'address' && decoded) {
      return (
        <AddressLink hash={ decoded }/>
      );
    }

    const value = selectedDataType === 'Dec' && decoded ? decoded : hex;
    return (
      <Box overflow="hidden" whiteSpace="nowrap">
        <HashStringShortenDynamic hash={ value }/>
      </Box>
    );
  })();

  return (
    <Flex alignItems="center" px={{ base: 0, lg: 3 }} _notFirst={{ mt: 3 }} overflow="hidden" maxW="100%">
      <Button variant="outline" colorScheme="gray" isActive size="xs" fontWeight={ 400 } mr={ 3 } w={ 6 }>
        { index }
      </Button>
      { decoded && (
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
      { content }
    </Flex>
  );
};

export default React.memo(TxLogTopic);
