import React from 'react';

import hexToUtf8 from 'lib/hexToUtf8';
import RawDataSnippet from 'ui/shared/RawDataSnippet';
import Select from 'ui/shared/select/Select';

const OPTIONS = [
  { label: 'Hex', value: 'Hex' as const },
  { label: 'UTF-8', value: 'UTF-8' as const },
];

export type DataType = (typeof OPTIONS)[number]['value'];

interface Props {
  hex: string;
  rightSlot?: React.ReactNode;
  defaultDataType?: DataType;
  isLoading?: boolean;
  minHeight?: string;
}

const RawInputData = ({ hex, rightSlot: rightSlotProp, defaultDataType = 'Hex', isLoading, minHeight }: Props) => {
  const [ selectedDataType, setSelectedDataType ] = React.useState<DataType>(defaultDataType);

  const rightSlot = (
    <>
      <Select
        options={ OPTIONS }
        name="data-type"
        defaultValue={ defaultDataType }
        onChange={ setSelectedDataType }
        isLoading={ isLoading }
        w="90px"
        mr="auto"
      />
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
