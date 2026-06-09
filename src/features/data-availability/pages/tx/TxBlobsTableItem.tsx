// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TxBlob } from 'src/features/data-availability/types/api';

import BlobDataType from 'src/features/data-availability/components/BlobDataType';
import BlobEntity from 'src/features/data-availability/components/entity/BlobEntity';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

interface Props {
  data: TxBlob;
  isLoading?: boolean;
}

const TxBlobsTableItem = ({ data, isLoading }: Props) => {
  const size = data.blob_data ? data.blob_data.replace('0x', '').length / 2 : '-';

  return (
    <TableRow alignItems="top">
      <TableCell>
        <BlobEntity hash={ data.hash } noIcon isLoading={ isLoading }/>
      </TableCell>
      <TableCell verticalAlign="middle">
        { data.blob_data ? <BlobDataType isLoading={ isLoading } data={ data.blob_data }/> : '-' }
      </TableCell>
      <TableCell verticalAlign="middle">
        <Skeleton loading={ isLoading } display="inline-block">
          { size.toLocaleString() }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(TxBlobsTableItem);
