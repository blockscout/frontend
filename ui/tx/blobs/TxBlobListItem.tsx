import { Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { TxBlob } from 'types/api/blobs';

import BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';

interface Props {
  data: TxBlob;
  isLoading?: boolean;
}

const TxBlobListItem = ({ data, isLoading }: Props) => {
  const size = data.blob_data.replace('0x', '').length / 2;

  return (
    <ListItemMobileGrid.Container>
      <ListItemMobileGrid.Label isLoading={ isLoading }>Blob hash</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <BlobEntity hash={ data.hash } isLoading={ isLoading } noCopy/>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Data</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading }>
            Raw
        </Skeleton>
      </ListItemMobileGrid.Value>

      <ListItemMobileGrid.Label isLoading={ isLoading }>Size</ListItemMobileGrid.Label>
      <ListItemMobileGrid.Value>
        <Skeleton isLoaded={ !isLoading }>
          { size }
        </Skeleton>
      </ListItemMobileGrid.Value>
    </ListItemMobileGrid.Container>
  );
};

export default React.memo(TxBlobListItem);
