import { Select } from '@chakra-ui/react';
import React from 'react';

import hexToUtf8 from 'lib/hexToUtf8';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

type DataType = 'Hex' | 'UTF-8'
const OPTIONS: Array<DataType> = [ 'Hex', 'UTF-8' ];

interface Props {
  hex: string;
}

const RawInputData = ({ hex }: Props) => {
  const [ selectedDataType, setSelectedDataType ] = React.useState<DataType>('Hex');

  const handleSelectChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDataType(event.target.value as DataType);
  }, []);

  const select = (
    <Select size="xs" borderRadius="base" value={ selectedDataType } onChange={ handleSelectChange } w="auto" mr="auto">
      { OPTIONS.map((option) => <option key={ option } value={ option }>{ option }</option>) }
    </Select>
  );

  return (
    <RawDataSnippet
      data={ selectedDataType === 'Hex' ? hex : hexToUtf8(hex) }
      rightSlot={ select }
      textareaMaxHeight="220px"
      textareaMinHeight="160px"
      w="100%"
    />
  );
};

export default React.memo(RawInputData);
