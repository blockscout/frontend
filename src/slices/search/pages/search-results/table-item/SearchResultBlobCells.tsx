// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { SearchResultCellsProps } from './types';

import * as BlobEntity from 'src/features/data-availability/components/entity/BlobEntity';

import { TableCell } from 'src/toolkit/chakra/table';

const SearchResultBlobCells = ({ data, isLoading, onLinkClick }: SearchResultCellsProps<'blob'>) => {
  return (
    <TableCell colSpan={ 3 } fontSize="sm">
      <BlobEntity.Container>
        <BlobEntity.Icon/>
        <BlobEntity.Link
          isLoading={ isLoading }
          hash={ data.blob_hash }
          onClick={ onLinkClick }
        >
          <BlobEntity.Content
            asProp="mark"
            hash={ data.blob_hash }
            textStyle="sm"
            fontWeight={ 700 }
          />
        </BlobEntity.Link>
      </BlobEntity.Container>
    </TableCell>
  );
};

export default React.memo(SearchResultBlobCells);
