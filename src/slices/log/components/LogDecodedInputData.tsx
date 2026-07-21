// SPDX-License-Identifier: LicenseRef-Blockscout

import type { JsxStyleProps } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import LogDecodedInputDataHeader from './LogDecodedInputDataHeader';
import LogDecodedInputDataTable from './LogDecodedInputDataTable';
interface Props {
  data: schemas['DecodedLogInput'] | schemas['DecodedInput'];
  isLoading?: boolean;
  rightSlot?: React.ReactNode;
  inputsTableProps?: JsxStyleProps;
}

const LogDecodedInputData = ({ data, isLoading, rightSlot, inputsTableProps }: Props) => {
  return (
    <>
      <LogDecodedInputDataHeader
        methodId={ data.method_id }
        methodCall={ data.method_call }
        isLoading={ isLoading }
        rightSlot={ rightSlot }
      />
      { data.parameters.length > 0 && <LogDecodedInputDataTable data={ data.parameters } isLoading={ isLoading } { ...inputsTableProps }/> }
    </>
  );
};

export default React.memo(LogDecodedInputData);
