import { Grid, Text, Box, Icon } from '@chakra-ui/react';
import React from 'react';

import { tx } from 'data/tx';
import clockIcon from 'icons/clock.svg';
import flameIcon from 'icons/flame.svg';
import dayjs from 'lib/date/dayjs';
import AddressIcon from 'ui/shared/AddressIcon';
import AddressLinkWithTooltip from 'ui/shared/AddressLinkWithTooltip';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import Utilization from 'ui/shared/Utilization';
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
        title="Gas limit & usage by txn"
        hint="Actual gas amount used by the transaction."
      >
        <Text>{ tx.gas_used.toLocaleString('en') }</Text>
        <Text { ...leftSeparatorStyles }>{ tx.gas_limit.toLocaleString('en') }</Text>
        <Utilization ml={ 4 } value={ tx.gas_used / tx.gas_limit }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Gas fees (Gwei)"
        // eslint-disable-next-line max-len
        hint="Base Fee refers to the network Base Fee at the time of the block, while Max Fee & Max Priority Fee refer to the max amount a user is willing to pay for their tx & to give to the miner respectively."
      >
        <Box>
          <Text as="span">Base: </Text>
          <Text fontWeight="600" as="span">{ tx.gas_fees.base }</Text>
        </Box>
        <Box { ...leftSeparatorStyles }>
          <Text as="span">Max: </Text>
          <Text fontWeight="600" as="span">{ tx.gas_fees.max }</Text>
        </Box>
        <Box { ...leftSeparatorStyles }>
          <Text as="span">Max priority: </Text>
          <Text fontWeight="600" as="span">{ tx.gas_fees.max_priority }</Text>
        </Box>
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
