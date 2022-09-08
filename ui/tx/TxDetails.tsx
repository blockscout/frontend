import { Grid } from '@chakra-ui/react';
import React from 'react';

import { tx } from 'data/tx';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import type { Props as TxStatusProps } from 'ui/tx/TxStatus';
import TxStatus from 'ui/tx/TxStatus';

const TxDetails = () => {
  return (
    <Grid columnGap={ 8 } rowGap={ 3 } templateColumns="auto 1fr">
      <DetailsInfoItem
        title="Transaction hash"
        hint="Unique character string (TxID) assigned to every verified transaction."
      >
        { tx.hash }
        <CopyToClipboard text={ tx.hash }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Status"
        hint="Current transaction state: Success, Failed (Error), or Pending (In Process)"
      >
        <TxStatus status={ tx.status as TxStatusProps['status'] }/>
      </DetailsInfoItem>
    </Grid>
  );
};

export default TxDetails;
