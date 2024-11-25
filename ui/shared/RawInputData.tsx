import { Select, Skeleton } from '@chakra-ui/react';
import React from 'react';

import hexToUtf8 from 'lib/hexToUtf8';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

export type DataType = 'Hex' | 'UTF-8';
const OPTIONS: Array<DataType> = [ 'Hex', 'UTF-8' ];

interface Props {
  hex: string;
  rightSlot?: React.ReactNode;
  defaultDataType?: DataType;
  isLoading?: boolean;
  minHeight?: string;
}

const RawInputData = ({ hex, rightSlot: rightSlotProp, defaultDataType = 'Hex', isLoading, minHeight }: Props) => {
  const [ selectedDataType, setSelectedDataType ] = React.useState<DataType>(defaultDataType);

  const handleSelectChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDataType(event.target.value as DataType);
  }, []);

  const rightSlot = (
    <>
      <Skeleton isLoaded={ !isLoading } borderRadius="base" w="auto" mr="auto">
        <Select size="xs" borderRadius="base" value={ selectedDataType } onChange={ handleSelectChange }>
          { OPTIONS.map((option) => <option key={ option } value={ option }>{ option }</option>) }
        </Select>
      </Skeleton>
      { rightSlotProp }
    </>
  );

  return (
    <RawDataSnippet
      data={ selectedDataType === 'Hex' ? hex : hexToUtf8(hex) }
      rightSlot={ rightSlot }
      isLoading={ isLoading }
      textareaMaxHeight="220px"
      textareaMinHeight={ minHeight || '160px' }
      w="100%"
    />
  );
};

export default React.memo(RawInputData);
