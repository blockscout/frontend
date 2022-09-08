import { Grid, Text, Icon } from '@chakra-ui/react';
import React from 'react';

import { tx } from 'data/tx';
import clockIcon from 'icons/clock.svg';
import dayjs from 'lib/date/dayjs';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import type { Props as TxStatusProps } from 'ui/tx/TxStatus';
import TxStatus from 'ui/tx/TxStatus';

const TxDetails = () => {
  const leftSeparatorStyles = {
    ml: 3,
    pl: 3,
    borderLeftWidth: '1px',
    borderLeftColor: 'gray.700',
  };

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
      <DetailsInfoItem
        title="Block"
        hint="Block number containing the transaction."
      >
        <Text>{ tx.block_num }</Text>
        <Text { ...leftSeparatorStyles } borderLeftColor="gray.500" variant="secondary">
          { tx.confirmation_num } Block confirmations
        </Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Timestamp"
        hint="Date & time of transaction inclusion, including length of time for confirmation."
      >
        <Icon as={ clockIcon } boxSize={ 5 }/>
        <Text ml={ 1 }>{ dayjs(tx.timestamp).fromNow() }</Text>
        <Text { ...leftSeparatorStyles }>{ dayjs(tx.timestamp).format('LLLL') }</Text>
        <Text { ...leftSeparatorStyles } borderLeftColor="gray.500" variant="secondary">
          Confirmed within { tx.confirmation_duration } secs
        </Text>
      </DetailsInfoItem>
    </Grid>
  );
};

export default TxDetails;
