import { Tr, Td, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { TxBlob } from 'types/api/blobs';

import BlobDataType from 'ui/shared/blob/BlobDataType';
import BlobEntity from 'ui/shared/entities/blob/BlobEntity';

interface Props {
  data: TxBlob;
  isLoading?: boolean;
}

const TxBlobsTableItem = ({ data, isLoading }: Props) => {
  const size = data.blob_data ? data.blob_data.replace('0x', '').length / 2 : '-';

  return (
    <Tr alignItems="top">
      <Td>
        <BlobEntity hash={ data.hash } noIcon isLoading={ isLoading }/>
      </Td>
      <Td verticalAlign="middle">
        { data.blob_data ? <BlobDataType isLoading={ isLoading } data={ data.blob_data }/> : '-' }
      </Td>
      <Td verticalAlign="middle">
        <Skeleton isLoaded={ !isLoading } display="inline-block">
          { size.toLocaleString() }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(TxBlobsTableItem);
