import { Flex, Button, Text, Select } from '@chakra-ui/react';
import React from 'react';

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
    <Flex alignItems="center" px={ 3 } _notFirst={{ mt: 3 }}>
      <Button variant="outline" isActive size="xs" fontWeight={ 400 } mr={ 3 } w={ 6 }>
        { index }
      </Button>
      { index > 0 && (
        <Select size="sm" borderRadius="base" value={ selectedDataType } onChange={ handleSelectChange } focusBorderColor="none" w="75px" mr={ 3 }>
          { OPTIONS.map((option) => <option key={ option } value={ option }>{ option }</option>) }
        </Select>
      ) }
      <Text>{ hex }</Text>
    </Flex>
  );
};

export default React.memo(TxLogTopic);
