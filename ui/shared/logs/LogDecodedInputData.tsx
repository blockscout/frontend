import React from 'react';

import type { DecodedInput } from 'types/api/decodedInput';

import useIsMobile from 'lib/hooks/useIsMobile';

import LogDecodedInputDataHeader from './LogDecodedInputDataHeader';
import LogDecodedInputDataTable from './LogDecodedInputDataTable';
interface Props {
  data: DecodedInput;
  isLoading?: boolean;
  rightSlot?: React.ReactNode;
}

const LogDecodedInputData = ({ data, isLoading, rightSlot }: Props) => {
  const isMobile = useIsMobile();
  return (
    <>
      { isMobile ? rightSlot : null }
      <LogDecodedInputDataHeader
        methodId={ data.method_id }
        methodCall={ data.method_call }
        isLoading={ isLoading }
        rightSlot={ isMobile ? null : rightSlot }
      />
      { data.parameters.length > 0 && <LogDecodedInputDataTable data={ data.parameters } isLoading={ isLoading }/> }
    </>
  );
};

export default React.memo(LogDecodedInputData);
