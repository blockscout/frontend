import { Grid, Text, Icon } from '@chakra-ui/react';
import React from 'react';

import { tx } from 'data/tx';
import clockIcon from 'icons/clock.svg';
import flameIcon from 'icons/flame.svg';
import dayjs from 'lib/date/dayjs';
import AddressIcon from 'ui/shared/AddressIcon';
import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';
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
        <Icon as={ clockIcon } boxSize={ 5 } color="gray.500"/>
        <Text ml={ 1 }>{ dayjs(tx.timestamp).fromNow() }</Text>
        <Text { ...leftSeparatorStyles }>{ dayjs(tx.timestamp).format('LLLL') }</Text>
        <Text { ...leftSeparatorStyles } borderLeftColor="gray.500" variant="secondary">
          Confirmed within { tx.confirmation_duration } secs
        </Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="From"
        hint="Address (external or contract) sending the transaction."
        mt={ 8 }
      >
        <AddressIcon address={ tx.address_from }/>
        <AddressLinkWithTooltip address={ tx.address_from } columnGap={ 0 } ml={ 2 } fontWeight="400"/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="To"
        hint="Address (external or contract) sending the transaction."
      >
        <AddressIcon address={ tx.address_to }/>
        <AddressLinkWithTooltip address={ tx.address_to } columnGap={ 0 } ml={ 2 } fontWeight="400"/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Value"
        hint="Value sent in the native token (and USD) if applicable."
        mt={ 8 }
      >
        <Text>{ tx.amount.value } Ether</Text>
        <Text variant="secondary" ml={ 1 }>(${ tx.amount.value_usd.toFixed(2) })</Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Transaction fee"
        hint="Total transaction fee."
      >
        <Text>{ tx.fee.value } Ether</Text>
        <Text variant="secondary" ml={ 1 }>(${ tx.fee.value_usd.toFixed(2) })</Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Gas price"
        hint="Price per unit of gas specified by the sender. Higher gas prices can prioritize transaction inclusion during times of high usage."
      >
        <Text>{ tx.gas_price.toLocaleString('en', { minimumFractionDigits: 18 }) } Ether</Text>
        <Text variant="secondary" ml={ 1 }>({ (tx.gas_price * Math.pow(10, 18)).toFixed(0) } Gwei)</Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Burnt fees"
        hint="Amount of ETH burned for this transaction. Equals Block Base Fee per Gas * Gas Used."
      >
        <Icon as={ flameIcon } boxSize={ 5 } color="gray.500"/>
        <Text ml={ 1 }>{ tx.burnt_fees.value.toLocaleString('en', { minimumFractionDigits: 18 }) } Ether</Text>
        <Text variant="secondary" ml={ 1 }>(${ tx.burnt_fees.value_usd.toFixed(2) })</Text>
      </DetailsInfoItem>
    </Grid>
  );
};

export default TxDetails;
