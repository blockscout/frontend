import { Grid, GridItem, Text, Box, Icon, Link, Tag, Flex, Tooltip, chakra } from '@chakra-ui/react';
import appConfig from 'configs/app/config';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import { tx } from 'data/tx';
import clockIcon from 'icons/clock.svg';
import flameIcon from 'icons/flame.svg';
import errorIcon from 'icons/status/error.svg';
import successIcon from 'icons/status/success.svg';
import dayjs from 'lib/date/dayjs';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import PrevNext from 'ui/shared/PrevNext';
import RawInputData from 'ui/shared/RawInputData';
import TextSeparator from 'ui/shared/TextSeparator';
import TokenSnippet from 'ui/shared/TokenSnippet';
import type { Props as TxStatusProps } from 'ui/shared/TxStatus';
import TxStatus from 'ui/shared/TxStatus';
import Utilization from 'ui/shared/Utilization';
import TokenTransfer from 'ui/tx/TokenTransfer';
import TxDecodedInputData from 'ui/tx/TxDecodedInputData';

const TxDetails = () => {
  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const handleCutClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo('TxDetails__cutLink', {
      duration: 500,
      smooth: true,
    });
  }, []);

  return (
    <Grid columnGap={ 8 } rowGap={{ base: 3, lg: 3 }} templateColumns={{ base: 'minmax(0, 1fr)', lg: 'auto minmax(0, 1fr)' }}>
      <DetailsInfoItem
        title="Transaction hash"
        hint="Unique character string (TxID) assigned to every verified transaction."
        flexWrap="nowrap"
      >
        <Box overflow="hidden">
          <HashStringShortenDynamic hash={ tx.hash }/>
        </Box>
        <CopyToClipboard text={ tx.hash }/>
        <PrevNext ml={ 7 }/>
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
        <TextSeparator color="gray.500"/>
        <Text variant="secondary">
          { tx.confirmation_num } Block confirmations
        </Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Timestamp"
        hint="Date & time of transaction inclusion, including length of time for confirmation."
      >
        <Icon as={ clockIcon } boxSize={ 5 } color="gray.500"/>
        <Text ml={ 1 }>{ dayjs(tx.timestamp).fromNow() }</Text>
        <TextSeparator/>
        <Text whiteSpace="normal">{ dayjs(tx.timestamp).format('LLLL') }<TextSeparator color="gray.500"/></Text>
        <Text variant="secondary">
          Confirmed within { tx.confirmation_duration } secs
        </Text>
      </DetailsInfoItem>
      <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 3, lg: 8 }}/>
      <DetailsInfoItem
        title="From"
        hint="Address (external or contract) sending the transaction."
      >
        <Address>
          <AddressIcon hash={ tx.address_from.hash }/>
          <AddressLink ml={ 2 } hash={ tx.address_from.hash }/>
          <CopyToClipboard text={ tx.address_from.hash }/>
        </Address>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Interacted with contract"
        hint="Address (external or contract) receiving the transaction."
        flexWrap={{ base: 'wrap', lg: 'nowrap' }}
      >
        <Address mr={ 3 }>
          <AddressIcon hash={ tx.address_to.hash }/>
          <AddressLink ml={ 2 } hash={ tx.address_to.hash }/>
          <CopyToClipboard text={ tx.address_to.hash }/>
        </Address>
        <Tag colorScheme="orange" variant="solid" flexShrink={ 0 }>SANA</Tag>
        <Tooltip label="Contract execution completed">
          <chakra.span display="inline-flex">
            <Icon as={ successIcon } boxSize={ 4 } ml={ 2 } color="green.500" cursor="pointer"/>
          </chakra.span>
        </Tooltip>
        <Tooltip label="Error occured during contract execution">
          <chakra.span display="inline-flex">
            <Icon as={ errorIcon } boxSize={ 4 } ml={ 2 } color="red.500" cursor="pointer"/>
          </chakra.span>
        </Tooltip>
        <TokenSnippet symbol="UP" name="User Pay" hash="0xA17ed5dFc62D0a3E74D69a0503AE9FdA65d9f212" ml={ 3 }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Token transferred"
        hint="List of token transferred in the transaction."
      >
        <Flex flexDirection="column" alignItems="flex-start" rowGap={ 5 } w="100%">
          { tx.transferred_tokens.map((item) => <TokenTransfer key={ item.token.hash } { ...item }/>) }
        </Flex>
      </DetailsInfoItem>
      <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 3, lg: 8 }}/>
      <DetailsInfoItem
        title="Value"
        hint="Value sent in the native token (and USD) if applicable."
      >
        <Text>{ tx.amount.value } { appConfig.network.currency }</Text>
        <Text variant="secondary" ml={ 1 }>(${ tx.amount.value_usd.toFixed(2) })</Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Transaction fee"
        hint="Total transaction fee."
      >
        <Text>{ tx.fee.value } { appConfig.network.currency }</Text>
        <Text variant="secondary" ml={ 1 }>(${ tx.fee.value_usd.toFixed(2) })</Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Gas price"
        hint="Price per unit of gas specified by the sender. Higher gas prices can prioritize transaction inclusion during times of high usage."
      >
        <Text mr={ 1 }>{ tx.gas_price.toLocaleString('en', { minimumFractionDigits: 18 }) } { appConfig.network.currency }</Text>
        <Text variant="secondary">({ (tx.gas_price * Math.pow(10, 18)).toFixed(0) } Gwei)</Text>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Gas limit & usage by txn"
        hint="Actual gas amount used by the transaction."
      >
        <Text>{ tx.gas_used.toLocaleString('en') }</Text>
        <TextSeparator/>
        <Text >{ tx.gas_limit.toLocaleString('en') }</Text>
        <Utilization ml={ 4 } value={ tx.gas_used / tx.gas_limit }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Gas fees (Gwei)"
        // eslint-disable-next-line max-len
        hint="Base Fee refers to the network Base Fee at the time of the block, while Max Fee & Max Priority Fee refer to the max amount a user is willing to pay for their tx & to give to the miner respectively."
      >
        <Box>
          <Text as="span" fontWeight="500">Base: </Text>
          <Text fontWeight="600" as="span">{ tx.gas_fees.base }</Text>
          <TextSeparator/>
        </Box>
        <Box>
          <Text as="span" fontWeight="500">Max: </Text>
          <Text fontWeight="600" as="span">{ tx.gas_fees.max }</Text>
          <TextSeparator/>
        </Box>
        <Box>
          <Text as="span" fontWeight="500">Max priority: </Text>
          <Text fontWeight="600" as="span">{ tx.gas_fees.max_priority }</Text>
        </Box>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Burnt fees"
        hint={ `Amount of ${ appConfig.network.currency } burned for this transaction. Equals Block Base Fee per Gas * Gas Used.` }
      >
        <Icon as={ flameIcon } boxSize={ 5 } color="gray.500"/>
        <Text ml={ 1 } mr={ 1 }>{ tx.burnt_fees.value.toLocaleString('en', { minimumFractionDigits: 18 }) } { appConfig.network.currency }</Text>
        <Text variant="secondary">(${ tx.burnt_fees.value_usd.toFixed(2) })</Text>
      </DetailsInfoItem>
      <GridItem colSpan={{ base: undefined, lg: 2 }}>
        <Element name="TxDetails__cutLink">
          <Link
            mt={ 6 }
            display="inline-block"
            fontSize="sm"
            textDecorationLine="underline"
            textDecorationStyle="dashed"
            onClick={ handleCutClick }
          >
            { isExpanded ? 'Hide details' : 'View details' }
          </Link>
        </Element>
      </GridItem>
      { isExpanded && (
        <>
          <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>
          <DetailsInfoItem
            title="Other"
            hint="Other data related to this transaction."
          >
            <Box>
              <Text as="span" fontWeight="500">Txn type: </Text>
              <Text fontWeight="600" as="span">{ tx.type.value }</Text>
              <Text fontWeight="400" as="span" ml={ 1 }>({ tx.type.eip })</Text>
              <TextSeparator/>
            </Box>
            <Box>
              <Text as="span" fontWeight="500">Nonce: </Text>
              <Text fontWeight="600" as="span">{ tx.nonce }</Text>
              <TextSeparator/>
            </Box>
            <Box>
              <Text as="span" fontWeight="500">Position: </Text>
              <Text fontWeight="600" as="span">{ tx.position }</Text>
            </Box>
          </DetailsInfoItem>
          <DetailsInfoItem
            title="Raw input"
            hint="Binary data included with the transaction. See logs tab for additional info."
          >
            <RawInputData hex={ tx.input_hex }/>
          </DetailsInfoItem>
          <DetailsInfoItem
            title="Decoded input data"
            hint="Decoded input data"
          >
            <TxDecodedInputData/>
          </DetailsInfoItem>
        </>
      ) }
    </Grid>
  );
};

export default TxDetails;
